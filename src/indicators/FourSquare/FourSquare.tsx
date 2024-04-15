"use strict";

import React from "react";

import { FourSquareProps } from "./FourSquare.types";
import "./FourSquare.scss";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import Text from "../../utils/Text";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

// NOTE: Below variables should match with ones set in sass file
const fourSquareColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--four-square-phase${idx + 1}-color`
);

const FourSquare = (props: FourSquareProps) => {
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS - Sets the colors of the 4 squares*/
	const colorProp: string | string[] = props?.color ?? "";
	const fourSquareColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b foursquare-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...fourSquareColorStyles,
					...styles
				} as React.CSSProperties
			}
		>
			<span className="rli-d-i-b foursquare-indicator">
				<span className="squares-container">
					<span className="square square1"></span>
					<span className="square square2"></span>
					<span className="square square3"></span>
					<span className="square square4"></span>
				</span>
			</span>

			<Text text={props?.text} textColor={props?.textColor} staticText />
		</span>
	);
};

export default FourSquare;

/**
 * Creates a style object with props that color the throbber/spinner
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(
			colorProp,
			fourSquareColorPhases.length
		);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[fourSquareColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < fourSquareColorPhases.length; i++) {
			stylesObject[fourSquareColorPhases[i]] = colorProp;
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
					)} received in <FourSquare /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < fourSquareColorPhases.length; i++) {
			stylesObject[fourSquareColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
