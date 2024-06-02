"use strict";

import React from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Bounce.scss";
import { BounceProps } from "./Bounce.types";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import arrayRepeat from "../../../utils/arrayRepeat";

const TDWindmillColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--TD-windmill-phase${idx + 1}-color`
);

const Bounce = (props: BounceProps) => {
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
	const colorProp: string | string[] = props?.color ?? "";
	const brickStackColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span className="rli-d-i-b bounce-rli-bounding-box">
			<span className="rli-d-i-b  circle"></span>
			<span className="rli-d-i-b  circle"></span>
			<span className="rli-d-i-b  circle"></span>
			<span className="rli-d-i-b  shadow"></span>
			<span className="rli-d-i-b  shadow"></span>
			<span className="rli-d-i-b  shadow"></span>
		</span>
	);
};

export { Bounce };

/**
 * Creates a style object with props that color the loading indicator
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(
			colorProp,
			TDWindmillColorPhases.length
		);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[TDWindmillColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < TDWindmillColorPhases.length; i++) {
			stylesObject[TDWindmillColorPhases[i]] = colorProp;
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
					)} received in <ThreeDot variant="windmill" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < TDWindmillColorPhases.length; i++) {
			stylesObject[TDWindmillColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
