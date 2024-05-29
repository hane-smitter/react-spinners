import React, { useCallback, useRef } from "react";
import colorParse from "tinycolor2";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import { defaultColor } from "../variables";
import "./Atom.scss";
import { AtomProps } from "./Atom.types";

const DEFAULT_COLOR = colorParse(defaultColor).toRgb();

const Atom = (props: AtomProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles
	let { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.8s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	// If Color property is a string, that is the color of all rings
	// If color property is an array, that is color for each rings
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				// e.g --ring1-color
				const cssColorVars: Array<string> = Array.from(
					{ length: 3 },
					(item, idx) => {
						const num: number = idx + 1;
						const cssPropName: string = `--${"orbit" + num + "-"}color`;
						return cssPropName;
					}
				);

				elemRef.current?.style.removeProperty("--color-r");
				elemRef.current?.style.removeProperty("--color-g");
				elemRef.current?.style.removeProperty("--color-b");
				for (let i = 0; i < cssColorVars.length; i++) {
					elemRef.current?.style.removeProperty(cssColorVars[i]);
				}
			}
		},
		[elemRef.current]
	);
	let colorProp: string | string[] = props?.color ?? "";
	const atomColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b atom-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...atomColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b atom-throbber" style={{ ...styles }}>
				<span className="rli-d-i-b inner">
					<span className="orbit nucleus-holder">
						<span className="nucleus"></span>
					</span>
					<span className="orbit"></span>
					<span className="orbit"></span>
				</span>
			</span>
			<Text
				className="atom-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export default React.memo(Atom);

/**
 * Creates a style object with props that color the throbber/spinner
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

	if (colorProp instanceof Array) {
		let arrLength: number = colorProp.length;

		if (arrLength <= 0) return stylesObject;

		try {
			const firstColor = colorParse(colorProp[0]);
			if (!firstColor.isValid()) throw new Error("invalid color");

			const toRgbColor = firstColor.toRgb();
			stylesObject["--color-r"] = toRgbColor.r;
			stylesObject["--color-g"] = toRgbColor.g;
			stylesObject["--color-b"] = toRgbColor.b;
		} catch (error) {
			console.warn(
				`Possibly an invalid color( ${colorProp[0]} ) passed to Atom loader!`
			);
			stylesObject["--color-r"] = DEFAULT_COLOR.r;
			stylesObject["--color-g"] = DEFAULT_COLOR.g;
			stylesObject["--color-b"] = DEFAULT_COLOR.b;
		}

		for (let i = 0; i < arrLength; i++) {
			if (i >= 3) break; // Max no. of discs can only be 3
			let currentItem: string = `orbit${i + 1}`;
			let currentColor = colorProp[i];

			stylesObject[`--${currentItem}-color`] = currentColor;
		}
		return stylesObject;
	}

	try {
		const color = colorParse(colorProp);
		if (!color.isValid()) throw new Error("invalid color");

		const toRgbColor = color.toRgb();
		stylesObject["--color-r"] = toRgbColor.r;
		stylesObject["--color-g"] = toRgbColor.g;
		stylesObject["--color-b"] = toRgbColor.b;
	} catch (error) {
		console.warn(
			`Invalid color( ${JSON.stringify(colorProp)} ) passed to Atom indicator!`
		);
		stylesObject["--color-r"] = DEFAULT_COLOR.r;
		stylesObject["--color-g"] = DEFAULT_COLOR.g;
		stylesObject["--color-b"] = DEFAULT_COLOR.b;
	}

	return stylesObject;
}
