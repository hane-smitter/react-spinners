"use strict";

import React from "react";

import { CommetProps } from "./Commet.types";
import "./Commet.scss";
import Text from "../../utils/Text";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

// NOTE: Below variables should match with ones set in sass file
const commetColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--commet-phase${idx + 1}-color`
);

const Commet = (props: CommetProps) => {
	// Styles
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	// color SETTINGS
	const colorProp: string | string[] = props?.color ?? "";
	const commetColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b commet-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...commetColorStyles,
					...styles
				} as React.CSSProperties
			}
		>
			<span className="rli-d-i-b commet-indicator">
				<span className="rli-d-i-b commet-box">
					<span className="rli-d-i-b commet-trail trail1"></span>
					<span className="rli-d-i-b  commetball-box"></span>
				</span>
				<span className="rli-d-i-b commet-box">
					<span className="rli-d-i-b commet-trail trail2"></span>
					<span className="rli-d-i-b commetball-box"></span>
				</span>

				<Text
					className="commet-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export default Commet;

/**
 * Creates a style object with props that color the loading indicator
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, commetColorPhases.length);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[commetColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < commetColorPhases.length; i++) {
			stylesObject[commetColorPhases[i]] = colorProp;
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
					)} received in <Commet /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < commetColorPhases.length; i++) {
			stylesObject[commetColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
