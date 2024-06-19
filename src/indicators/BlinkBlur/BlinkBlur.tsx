"use strict";

import React from "react";

import { BlinkBlurProps } from "./BlinkBlur.types";
import "./BlinkBlur.scss";
import { defaultColor as DEFAULT_COLOR } from "../variables";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import Text from "../../utils/Text";
import arrayRepeat from "../../utils/arrayRepeat";

// CSS properties for switching colors
const ColorPhaseVars: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--shape-phase${idx + 1}-color`
);

const BlinkBlur = (props: BlinkBlurProps) => {
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	const colorProp: string | string[] = props?.color ?? "";
	const blinkBlurColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b blink-blur-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...blinkBlurColorStyles,
					...styles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b blink-blur-indicator">
				<span className="blink-blur-shape blink-blur-shape1"></span>
				<span className="blink-blur-shape blink-blur-shape2"></span>
				<span className="blink-blur-shape blink-blur-shape3"></span>
				<span className="blink-blur-shape blink-blur-shape4"></span>
				<span className="blink-blur-shape blink-blur-shape5"></span>
				{/* <span className="blink-blur-shape blink-blur-shape6"></span> */}
			</span>

			<Text
				// className="blink-blur-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
				style={{ marginTop: "0.8em" }}
			/>
		</span>
	);
};

export default BlinkBlur;

/**
 * Creates a style object with props that color the loading indicator
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};
	const coloringPhases = ColorPhaseVars.length;

	if (Array.isArray(colorProp) && colorProp.length > 0) {
		const colorArr: string[] = arrayRepeat(colorProp, coloringPhases);

		for (let i = 0; i < colorArr.length; i++) {
			if (i > coloringPhases - 1) break;

			const color = colorArr[i];

			stylesObject[ColorPhaseVars[i]] = color;
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < coloringPhases; i++) {
			stylesObject[ColorPhaseVars[i]] = colorProp;
		}
	} catch (error: unknown) {
		error instanceof Error
			? console.warn(
					`[${
						error.message
					}]: Received "${typeof colorProp}" instead with value, ${JSON.stringify(
						colorProp
					)}`
			  )
			: console.warn(
					`${JSON.stringify(
						colorProp
					)} received in <BlinkBlur /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < coloringPhases; i++) {
			stylesObject[ColorPhaseVars[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
