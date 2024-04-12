"use strict";

import React, { useCallback, useRef } from "react";

import { SlabProps } from "./Slab.types";
import "./Slab.scss";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import Text from "../../utils/Text";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

// NOTE: Below variables should match with ones set in sass file
const slabColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--slab-phase${idx + 1}-color`
);

const Slab = (props: SlabProps) => {
	// Styles
	const elemRef = useRef<HTMLSpanElement | null>(null);

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
	const colorReset: () => void = useCallback(function () {
		if (elemRef.current) {
			// elemRef.current?.style.removeProperty("color");
			for (let i = 0; i < slabColorPhases.length; i++) {
				elemRef.current?.style.removeProperty(slabColorPhases[i]);
			}
		}
	}, []);
	const colorProp: string | string[] = props?.color ?? "";
	const slabColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b slab-rli-bounding-box"
			ref={elemRef}
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

export default React.memo(Slab);

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
