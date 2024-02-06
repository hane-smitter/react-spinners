"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Pulsate.scss";
import { PulsateProps } from "./Pulsate.types";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import useRegisterCssColors from "../../../hooks/useRegisterCssColors";
import arrayRepeat from "../../../utils/arrayRepeat";

const TDPulsateColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--TD-pulsate-phase${idx + 1}-color`
);

const Pulsate = (props: PulsateProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS - Set color of the loading indicator */
	useRegisterCssColors(TDPulsateColorPhases);
	const colorReset: () => void = useCallback(function () {
		if (elemRef.current) {
			for (let i = 0; i < TDPulsateColorPhases.length; i++) {
				elemRef.current?.style.removeProperty(TDPulsateColorPhases[i]);
			}
		}
	}, []);
	const colorProp: string | string[] = props?.color ?? "";
	const pulsateDotColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b pulsate-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...pulsateDotColorStyles,
					...styles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b pulsate-indicator">
				<span className="rli-d-i-b pulsate-dot"></span>
				<span className="rli-d-i-b pulsate-dot"></span>
				<span className="rli-d-i-b pulsate-dot"></span>
			</span>

			<Text
				// className="pulsate-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export { Pulsate };

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
		const colorArr: string[] = arrayRepeat(
			colorProp,
			TDPulsateColorPhases.length
		);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[TDPulsateColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < TDPulsateColorPhases.length; i++) {
			stylesObject[TDPulsateColorPhases[i]] = colorProp;
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
					)} received in <ThreeDot variant="pulsate" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < TDPulsateColorPhases.length; i++) {
			stylesObject[TDPulsateColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
