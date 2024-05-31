"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Pulsate.scss";
import { PulsateProps } from "./Pulsate.types";

const Pulsate = (props: PulsateProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.3s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS - Set color of the loading indicator */
	const colorReset: () => void = useCallback(
		function () {
			if (elemRef.current) {
				const cssVars: string[] = Array.from({ length: 3 }, (item, idx) => {
					const num: number = idx + 1;
					const dotId: string = `--pulsateDot${num}-color`;

					return dotId;
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
					...pulsateDotColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b pulsate-indicator" style={{ ...styles }}>
				<span className="rli-d-i-b pulsate-bounce pulsate-bounce1"></span>
				<span className="rli-d-i-b pulsate-bounce pulsate-bounce2"></span>
				<span className="rli-d-i-b pulsate-bounce pulsate-bounce3"></span>
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
		const arrLength: number = colorProp.length;

		// STEPS:
		// 1. first item in Array to set `color` prop
		const [color] = colorProp;
		stylesObject["color"] = color;

		// 2. Set CSS variables to set individual dots
		for (let i = 0; i < arrLength; i++) {
			if (i >= 3) break; // Indicator has only 3 dots, hence stop processing longer array
			const num: number = i + 1;
			const dotId: string = `--pulsateDot${num}-color`;

			stylesObject[dotId] = colorProp[i];
		}

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
