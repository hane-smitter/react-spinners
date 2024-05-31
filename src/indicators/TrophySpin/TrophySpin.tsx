"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./TrophySpin.scss";
import { TwistProps } from "./TrophySpin.types";

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

	/* Color SETTINGS - Sets colors of all tesserae boxes*/
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const twistColorStyles: React.CSSProperties = stylesObjectFromColorProp(
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
					...twistColorStyles
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

	if (!colorProp) {
		resetToDefaultColors();
		return stylesObject;
	}

	if (colorProp instanceof Array) {
		const [color] = colorProp;

		stylesObject["color"] = color;

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
