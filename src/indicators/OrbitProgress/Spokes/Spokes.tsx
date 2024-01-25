"use strict";

import React, { useCallback, useRef } from "react";

import { SpokesProps } from "./Spokes.types";
import "./Spokes.scss";
import Text from "../../../utils/Text";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import useAnimationPacer from "../../../hooks/useAnimationPacer";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import arrayRepeat from "../../../utils/arrayRepeat";
import useSetCSSColorTypes from "../../../hooks/useSetCSSColorTypes";

const spokesColorSwitchVars = Array.from(
	{ length: 4 },
	(_, idx) => `--OP-spokes-phase${idx + 1}-color`
);
const spokeSize: number = 1.2; // Size of spoke for this indicator when dense prop is activated

const Spokes = (props: SpokesProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);

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
	useSetCSSColorTypes(spokesColorSwitchVars);
	const colorReset = useCallback(function () {
		if (elemRef.current) {
			elemRef.current?.style.removeProperty("color");
		}
	}, []);
	const colorProp: string | string[] = props?.color ?? "";
	const spokesColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	const numOfSpokes: 16 | 12 = props?.dense ? 16 : 12; // specific to this indicator

	const createStyles = useCallback(
		/**
		 * Calculates styles for compact variant of indicator when `spokesCount = 16`, i.e `dense` prop is `true`.
		 * @param {number} i Index position in array
		 * @param {number} spokesCount Number of spokes/bars
		 */
		(i: number, spokesCount: 16 | 12): React.CSSProperties | undefined => {
			if (spokesCount === 16) {
				const spokesOffset: string = (spokeSize + spokeSize * 0.3) * -1 + "em";

				const reverseSpokeNum: number = spokesCount - i;
				const duration = Number.parseFloat(animationPeriod);
				const delayInterval: number = duration / spokesCount;

				const rotateInclination = (i * 360) / spokesCount;

				return {
					transform: `rotate(${rotateInclination}deg) translate(-50%, ${spokesOffset})`,
					animationDelay: `${(reverseSpokeNum - 1) * delayInterval * -1}s`
				};
			} else {
				return undefined;
			}
		},
		[animationPeriod]
	);

	return (
		<span
			className="rli-d-i-b OP-spokes-rli-bounding-box"
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
				className="rli-d-i-b OP-spokes-indicator"
				style={
					{
						...spokesColorStyles,
						...styles
					} as React.CSSProperties
				}
			>
				{Array.from({ length: numOfSpokes }, (_, idx) => (
					<span
						key={`${(Math.random() * 1e12).toString(36)}${idx}`}
						className="rli-d-i-b spoke"
						style={createStyles(idx, numOfSpokes)}
					></span>
				))}
			</span>
			<Text text={props?.text} textColor={props?.textColor} />
		</span>
	);
};

export { Spokes };

/**
 * Creates a style object with props that color the throbber/spinner
 */
function stylesObjectFromColorProp(
	colorProp: string | string[],
	resetToDefaultColors: () => void
): React.CSSProperties {
	const stylesObject: any = {};
	const switchersLength = spokesColorSwitchVars.length;

	if (!colorProp) {
		resetToDefaultColors();
		return stylesObject;
	}

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, switchersLength);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[spokesColorSwitchVars[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[spokesColorSwitchVars[i]] = colorProp;
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
					)} received in <OrbitProgress variant="spokes" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[spokesColorSwitchVars[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
