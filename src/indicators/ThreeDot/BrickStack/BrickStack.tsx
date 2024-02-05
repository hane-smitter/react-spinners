"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import useRegisterCssColors from "../../../hooks/useRegisterCssColors";
import Text from "../../../utils/Text";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import "./BrickStack.scss";
import { BrickStackProps } from "./BrickStack.types";
import arrayRepeat from "../../../utils/arrayRepeat";

const TDBrickStackColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--TD-brick-stack-phase${idx + 1}-color`
);

const BrickStack = (props: BrickStackProps) => {
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

	/* Color SETTINGS - Set color of the loading indicator */
	useRegisterCssColors(TDBrickStackColorPhases);
	const colorReset: () => void = useCallback(function () {
		if (elemRef.current) {
			for (let i = 0; i < TDBrickStackColorPhases.length; i++) {
				elemRef.current?.style.removeProperty(TDBrickStackColorPhases[i]);
			}
		}
	}, []);
	const colorProp: string | string[] = props?.color ?? "";
	const brickStackColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b brick-stack-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...brickStackColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b brick-stack-indicator" style={{ ...styles }}>
				<span className=" rli-d-i-b brick-stack"></span>
			</span>

			<Text staticText text={props?.text} textColor={props?.textColor} />
		</span>
	);
};

export { BrickStack };

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
			TDBrickStackColorPhases.length
		);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[TDBrickStackColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < TDBrickStackColorPhases.length; i++) {
			stylesObject[TDBrickStackColorPhases[i]] = colorProp;
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
					)} received in <ThreeDot variant="brick-stack" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < TDBrickStackColorPhases.length; i++) {
			stylesObject[TDBrickStackColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
