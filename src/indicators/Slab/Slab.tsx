"use strict";

import React from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./Slab.scss";
import { SlabProps } from "./Slab.types";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

// NOTE: Below variables should match with ones set in sass file
const slabColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--slab-phase${idx + 1}-color`
);

const Slab = (props: SlabProps) => {
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "3s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS - Set color of the loading indicator */
	const colorProp: string | string[] = props?.color ?? "";
	const slabColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b slab-rli-bounding-box"
			style={{
				...(fontSize && { fontSize }),
				...(animationPeriod && {
					// This animation will uniquely use a unitless duration unlike the others with "--rli-animation-duration". See SCSS file for more context
					"--rli-animation-duration-unitless": parseFloat(animationPeriod)
				}),
				...(easingFn && { "--rli-animation-function": easingFn }),
				...slabColorStyles,
				...styles
			}}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b slab-indicator">
				<span className="slabs-wrapper">
					<span className="slab"></span>
					<span className="slab"></span>
					<span className="slab"></span>
					<span className="slab"></span>
				</span>
			</span>

			<Text
				// className="slab-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export default Slab;

function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, slabColorPhases.length);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[slabColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < slabColorPhases.length; i++) {
			stylesObject[slabColorPhases[i]] = colorProp;
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
					)} received in <Slab /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < slabColorPhases.length; i++) {
			stylesObject[slabColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
