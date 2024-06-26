"use strict";

import React from "react";

import "./Dotted.scss";
import { DottedProps } from "./Dotted.types";
import Text from "../../../utils/Text";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import useAnimationPacer from "../../../hooks/useAnimationPacer";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import arrayRepeat from "../../../utils/arrayRepeat";
import makeId from "../../../utils/makeId";

// CSS properties for switching colors
const dottedColorSwitchVars: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--OP-dotted-phase${idx + 1}-color`
);

const Dotted = (props: DottedProps) => {
	// Styles
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	const colorProp: string | string[] = props?.color ?? "";
	const dotsColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	const numOfDots: 16 | 12 = props?.dense ? 16 : 12; // dense prop logic

	return (
		<span
			className="rli-d-i-b OP-dotted-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...dotsColorStyles,
					...styles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b OP-dotted-indicator">
				{Array.from({ length: numOfDots }).map((_, idx) => {
					const { animationDelay, transform } = createStyles(
						idx,
						numOfDots,
						animationPeriod
					);

					return (
						<span
							key={makeId()}
							className="rli-d-i-b dot-shape-holder"
							style={transform ? { transform } : undefined}
						>
							<span
								className="dot"
								style={animationDelay ? { animationDelay } : undefined}
							></span>
						</span>
					);
				})}

				<Text
					className="OP-dotted-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export { Dotted };

/**
 * Creates a style object with props that colors the indicator
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};
	const switchersLength = dottedColorSwitchVars.length;

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, switchersLength);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[dottedColorSwitchVars[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[dottedColorSwitchVars[i]] = colorProp;
		}
	} catch (error: unknown) {
		error instanceof Error
			? console.warn(
					`[${
						error.message
					}]: Received "${typeof colorProp}" with value, ${JSON.stringify(
						colorProp
					)}`
			  )
			: console.warn(
					`${JSON.stringify(
						colorProp
					)} received in <OrbitProgress variant="dotted" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[dottedColorSwitchVars[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}

/**
 * Calculates styles for compact variant of indicator when `dotsCount = 16`, i.e `dense` prop is `true`.
 * @param {number} i Index position in array
 * @param {number} dotsCount Number of dots
 * @param {string} animationPeriod Animation Duration in CSS seconds
 */
function createStyles(
	i: number,
	dotsCount: 16 | 12,
	animationPeriod: string
): { transform: string; animationDelay: string } {
	if (dotsCount === 16) {
		const rotationDeg = (i * 360) / dotsCount;
		const reverseDotNum: number = dotsCount - i;
		const duration: number = Number.parseFloat(animationPeriod);
		const animationDelay: number = (duration / dotsCount) * reverseDotNum * -1;

		return {
			transform: `rotate(${rotationDeg}deg)`,
			animationDelay: `${animationDelay}s`
		};
	} else {
		return { transform: "", animationDelay: "" };
	}
}
