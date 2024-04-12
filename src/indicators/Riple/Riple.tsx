"use strict";

import React from "react";

import "./Riple.scss";
import Text from "../../utils/Text";
import { RipleProps } from "./Riple.types";
import arrayRepeat from "../../utils/arrayRepeat";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import { defaultColor as DEFAULT_COLOR } from "../variables";

// CSS properties for switching colors
const ripleColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--riple-phase${idx + 1}-color`
);

const Riple = (props: RipleProps) => {
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	const colorProp: string | string[] = props?.color ?? "";
	const ripleColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b riple-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...ripleColorStyles,
					...styles
				} as React.CSSProperties
			}
		>
			<span className="rli-d-i-b riple-indicator">
				<span className="rli-d-i-b riple"></span>
				<span className="rli-d-i-b riple"></span>

				<Text
					className="riple-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export default Riple;

/**
 * Creates a style object with props that color the loading indicator
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, ripleColorPhases.length);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[ripleColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < ripleColorPhases.length; i++) {
			stylesObject[ripleColorPhases[i]] = colorProp;
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
					)} received in <Riple /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < ripleColorPhases.length; i++) {
			stylesObject[ripleColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
