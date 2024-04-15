"use strict";

import React from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./LifeLine.scss";
import { LifeLineProps } from "./LifeLine.types";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

const lifeLineColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--life-line-phase${idx + 1}-color`
);

const LifeLine = (props: LifeLineProps) => {
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	const colorProp: string | string[] = props?.color ?? "";
	const lifeLineColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b lifeline-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...lifeLineColorStyles,
					...styles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b lifeline-indicator">
				{/* Original size SVG
				<svg
					width="16em" // ratio -> 2.947368421
					height="5.428571429em"
					xmlns="http://www.w3.org/2000/svg"
					version="1.2"
					viewBox="0 0 550 190"
					preserveAspectRatio="xMinYMin meet"
				>
					<path
						ref={svgPathRef}
						stroke="currentColor"
						fill="none"
						strokeWidth="2"
						strokeLinejoin="round"
						d="M0 70h250q7-30 12-3t5 8 3-7 3 4 6 35 7-60 4 60 7-20s2-11 10-10 1 1 8-10l4 8c6 4 8-6 10-17s2 10 9 11h210"
					/>
				</svg> */}

				{/* Zoomed in SVG */}
				<svg
					width="14em"
					height="6.825000001em"
					xmlns="http://www.w3.org/2000/svg"
					version="1.2"
					viewBox="0 0 350 50"
					preserveAspectRatio="xMinYMin meet"
					// className="rli-pulse-svg"
				>
					<path
						className="rli-lifeline"
						stroke="currentColor"
						fill="none"
						strokeLinejoin="round"
						strokeWidth="4px"
						d="M-113 70h250q8-30 12-3t5 8 3-7 3 4 6 35 8-55 6 40 8-3s2-11 10-10 1 1 8-10l4 8c6 4 8-6 10-17s2 10 9 11h210"
					></path>
				</svg>
			</span>

			<Text
				// className="lifeline-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export default LifeLine;

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
			lifeLineColorPhases.length
		);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[lifeLineColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < lifeLineColorPhases.length; i++) {
			stylesObject[lifeLineColorPhases[i]] = colorProp;
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
					)} received in <LifeLine /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < lifeLineColorPhases.length; i++) {
			stylesObject[lifeLineColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
