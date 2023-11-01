import React, { useCallback, useEffect, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Disc.scss";
import { DiscProps } from "./Disc.types";
import { defaultColor } from "../../variables";

const Disc = (props: DiscProps) => {
	const DEFAULT_COLOR: string = defaultColor;
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.5s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTING */
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
	let colorProp: string | string[] = props?.color ?? "";
	const discColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	// Registering/giving types to css variables controlling color of spinner
	useEffect(() => {
		const colorVars = [
			"--disc-color1",
			"--disc-color2",
			"--disc-color3",
			"--disc-color4"
		];

		for (let i = 0; i < colorVars.length; i++) {
			try {
				window.CSS.registerProperty({
					name: colorVars[i],
					syntax: "<color>",
					inherits: true,
					initialValue: DEFAULT_COLOR
				});
			} catch (error) {
				continue;
			}
		}
	}, []);

	return (
		<span
			className="rli-d-i-b disc-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn })
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span
				className="rli-d-i-b disc-throbber"
				ref={elemRef}
				style={{ ...discColorStyles, ...styles }}
			>
				<svg className="whirl" viewBox="25 25 50 50">
					{/* 👇SVGGeometry length: 124.85393524169922 */}
					<circle
						className="path"
						cx="50"
						cy="50"
						r="20"
						fill="none"
						strokeWidth="4"
						strokeMiterlimit="10"
					/>
				</svg>

				<Text
					className="disc-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export { Disc };

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
		const arrLength = colorProp.length;
		for (let idx = 0; idx < arrLength; idx++) {
			if (idx >= 4) break;
			let colorId: number = idx + 1;

			stylesObject[`--disc-color${colorId}`] = colorProp[idx];
		}

		return stylesObject;
	}

	// If color prop is not an array, set all coloring vars to the received prop
	for (let idx: number = 0; idx <= 3; idx++) {
		let colorId: number = idx + 1;

		stylesObject[`--disc-color${colorId}`] = colorProp;
	}

	return stylesObject;
}
