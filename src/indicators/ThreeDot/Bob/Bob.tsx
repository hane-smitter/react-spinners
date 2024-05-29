"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Bob.scss";
import { BobProps } from "./Bob.types";

const Bob = (props: BobProps) => {
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
	const colorReset: () => void = useCallback(
		function () {
			if (elemRef.current) {
				const cssVars: string[] = Array.from({ length: 3 }, (item, idx) => {
					// bob-dot2-color
					const bodDotId: string = `--bob-dot${idx + 1}-color`;

					return bodDotId;
				});

				elemRef.current?.style.removeProperty("color");
				for (let i = 0; i < cssVars.length; i++) {
					elemRef.current?.style.removeProperty(cssVars[i]);
				}
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const brickStackColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b bob-rli-bounding-box"
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
			<span className="bob-indicator" style={{ ...styles }}>
				<span className="bobbing"></span>
			</span>

			<Text staticText text={props?.text} textColor={props?.textColor} />
		</span>
	);
};

export { Bob };

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
		const arrLength: number = colorProp.length;

		// STEPS:
		// 1. first item in Array to set `color` prop
		const [color] = colorProp;
		stylesObject["color"] = color;

		// 2. Set CSS variables to set individual dots
		for (let i = 0; i < arrLength; i++) {
			if (i >= 3) break; // Indicator has only 3 brick/dots, hence stop processing longer array
			const num: number = i + 1;
			const bodDotId: string = `--bob-dot${num}-color`;

			stylesObject[bodDotId] = colorProp[i];
		}

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
