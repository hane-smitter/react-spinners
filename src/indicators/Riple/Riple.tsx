"use strict";

import React, { useCallback, useRef } from "react";

import useStylesPipeline from "../../hooks/useStylesPipeline";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import useRegisterCssColors from "../../hooks/useRegisterCssColors";
import Text from "../../utils/Text";
import "./Riple.scss";
import { RipleProps } from "./Riple.types";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

// CSS properties for switching colors
const ripleColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--riple-phase${idx + 1}-color`
);

const Riple = (props: RipleProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
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
	useRegisterCssColors(ripleColorPhases);
	const colorReset: () => void = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const ripleColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

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
					...ripleColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span
				className="rli-d-i-b riple-indicator"
				ref={elemRef}
				style={{ ...styles }}
			>
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

export default React.memo(Riple);

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
