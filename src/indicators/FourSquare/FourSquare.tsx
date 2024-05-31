"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./FourSquare.scss";
import { FourSquareProps } from "./FourSquare.types";

const FourSquare = (props: FourSquareProps) => {
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

	/* Color SETTINGS - Sets the colors of the 4 squares*/
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				// e.g --square1-color
				const cssColorVars: Array<string> = Array.from(
					{ length: 4 },
					(item, idx) => {
						const num: number = idx + 1;
						const cssPropName: string = `--${"square" + num + "-"}color`;
						return cssPropName;
					}
				);

				elemRef.current?.style.removeProperty("color");
				for (let i = 0; i < cssColorVars.length; i++) {
					elemRef.current?.style.removeProperty(cssColorVars[i]);
				}
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const fourSquareColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b foursquare-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn })
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span
				className={`rli-d-i-b foursquare-throbber`}
				ref={elemRef}
				style={{ ...fourSquareColorStyles, ...styles }}
			>
				<span className="rli-d-i-b squares-container">
					<span className={`square square1`}></span>
					<span className={`square square2`}></span>
					<span className={`square square3`}></span>
					<span className={`square square4`}></span>
				</span>

				<Text
					className="foursquare-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export default React.memo(FourSquare);

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
		const arrLength = colorProp.length;

		stylesObject["color"] = colorProp[0];

		for (let idx = 0; idx < arrLength; idx++) {
			if (idx >= 4) break;
			let num: number = idx + 1;
			let squareId = `square${num}`;

			stylesObject[`--${squareId}-color`] = colorProp[idx];
		}

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
