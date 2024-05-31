import React, { useCallback, useEffect, useRef } from "react";
import colorParse from "tinycolor2";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import { defaultColor } from "../variables";
import "./BlinkBlur.scss";
import { BlinkBlurProps } from "./BlinkBlur.types";

const DEFAULT_COLOR: colorParse.ColorFormats.RGBA =
	colorParse(defaultColor).toRgb();

const BlinkBlur = (props: BlinkBlurProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	const blinkBlurElemRef = useRef<HTMLSpanElement | null>(null);
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	// Adding animations optimizations
	useEffect(() => {
		const blinkBlurElem = blinkBlurElemRef?.current;
		/* No need to add since it is added on the element directly */
		if (blinkBlurElem) {
			blinkBlurElem.style.animationName = "sweepingBlinkBlur";
		}

		return () => {
			blinkBlurElem && (blinkBlurElem.style.willChange = "auto");
		};
	}, []);

	/* Color SETTINGS */
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				const cssColorVars: Array<string> = Array.from(
					{ length: 7 },
					(item, idx) => {
						const cssPropName: string = `--${
							idx ? "shape" + idx + "-" : ""
						}color-base`;
						return cssPropName;
					}
				);

				for (let i = 0; i < cssColorVars.length; i++) {
					elemRef.current?.style.removeProperty(cssColorVars[i]);
				}
			}
		},
		[elemRef.current]
	);
	let colorProp: string | string[] = props?.color ?? "";
	const glidingBlinkColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp, colorReset);

	return (
		<span
			className="rli-d-i-b blink-blur-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...glidingBlinkColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b blink-blur-indicator" style={{ ...styles }}>
				<span
					ref={blinkBlurElemRef}
					className="blink-blur-shape"
				></span>
			</span>

			<Text
				// className="blink-blur-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export default React.memo(BlinkBlur);

/**
 * Creates a style object with props that color the loading indicator
 */
function stylesObjectFromColorProp(
	colorProp: string | string[],
	resetToDefaultColors: () => void
): React.CSSProperties {
	const stylesObject: any = {};

	if (!colorProp) {
		resetToDefaultColors();
		return stylesObject;
	}

	if (colorProp instanceof Array && colorProp.length > 0) {
		try {
			let firstColor = colorParse(colorProp[0]);
			if (!firstColor.isValid()) throw new Error("invalid color");

			const rgbColor = firstColor.toRgb();
			// Set `color-base` from the first item in Array
			stylesObject[
				"--color-base"
			] = `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`;
		} catch (error) {
			console.warn(
				`Possibly an invalid color( ${JSON.stringify(
					colorProp[0]
				)} ) passed to BlinkBlur loader!`
			);
			stylesObject[
				`--color-base`
			] = `${DEFAULT_COLOR.r}, ${DEFAULT_COLOR.g}, ${DEFAULT_COLOR.b}`;
		}

		let arrLength: number = colorProp.length;

		for (let i = 0; i < arrLength; i++) {
			if (i > 5) break; // Max no. of shapes is 6
			let shapeId: string = `shape${i + 1}`;
			try {
				const color = colorParse(colorProp[i]);
				if (!color.isValid()) throw new Error("invalid color");

				const rgbColor = color.toRgb();
				stylesObject[
					`--${shapeId}-color-base`
				] = `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`;
			} catch (error) {
				console.warn(
					`Possibly an invalid color( ${colorProp[i]} ) in BlinkBlur loader!`
				);
				stylesObject[
					`--${shapeId}-color-base`
				] = `${DEFAULT_COLOR.r}, ${DEFAULT_COLOR.g}, ${DEFAULT_COLOR.b}`;
			}
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp === "string") {
			const color = colorParse(colorProp);
			if (!color.isValid()) throw new Error("invalid color");

			const rgbColor = color.toRgb();
			stylesObject[
				"--color-base"
			] = `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`;
		} else {
			throw new Error("Color unprocessable");
		}
	} catch (error) {
		console.warn(
			`Possibly an invalid color( ${JSON.stringify(
				colorProp
			)} ) passed to BlinkBlur loader!`
		);
		stylesObject[
			"--color-base"
		] = `${DEFAULT_COLOR.r}, ${DEFAULT_COLOR.g}, ${DEFAULT_COLOR.b}`;
	}

	return stylesObject;
}
