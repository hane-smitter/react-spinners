"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import useRegisterCssColors from "../../hooks/useRegisterCssColors";
import Text from "../../utils/Text";
import "./TrophySpin.scss";
import { TwistProps } from "./TrophySpin.types";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

const trophySpinColorSwitchVars = Array.from(
	{ length: 4 },
	(_, idx) => `--trophySpin-phase${idx + 1}-color`
);

const TrophySpin = (props: TwistProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "2.5s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	useRegisterCssColors(trophySpinColorSwitchVars);
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				// elemRef.current?.style.removeProperty("color");
				for (let i = 0; i < trophySpinColorSwitchVars.length; i++) {
					elemRef.current?.style.removeProperty(trophySpinColorSwitchVars[i]);
				}
			}
		},
		[]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const trophySpinColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b trophy-spin-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...trophySpinColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b trophy-spin-indicator" style={{ ...styles }}>
				<span className="blade"></span>
				<span className="blade"></span>
				<span className="blade"></span>
				<span className="blade"></span>
				<span className="blade"></span>
				<span className="blade"></span>
				<span className="blade"></span>
				<span className="blade"></span>
			</span>

			<Text
				// className="trophy-spin-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export default React.memo(TrophySpin);

/**
 * Creates a style object with props that color the throbber/spinner
 */
function stylesObjectFromColorProp(
	colorProp: string | string[],
	resetToDefaultColors: () => void
): React.CSSProperties {
	const stylesObject: any = {};
	const switchersLength = trophySpinColorSwitchVars.length;

	if (!colorProp) {
		resetToDefaultColors();
		return stylesObject;
	}

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, switchersLength);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[trophySpinColorSwitchVars[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[trophySpinColorSwitchVars[i]] = colorProp;
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
					)} received in <TrophySpin /> indicator cannot be processed. Using default instead!`
			  );
		for (let i = 0; i < switchersLength; i++) {
			stylesObject[trophySpinColorSwitchVars[i]] = DEFAULT_COLOR;
		}
	}
	// stylesObject["color"] = colorProp;

	return stylesObject;
}
