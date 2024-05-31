"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./Mosaic.scss";
import { MosaicProps } from "./Mosaic.types";

const Mosaic = (props: MosaicProps) => {
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
	// Specific to this throbber, we create a `rounded off` interval
	// since CSS can't do that seamlessly
	const numOfTesseracts: 9 = 9;
	let tesseractAnimationInterval: any =
		Math.round((parseFloat(animationPeriod) / numOfTesseracts) * 100) / 100;
	tesseractAnimationInterval = tesseractAnimationInterval + "s"; // Convert to CSS time unit

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
	const tesseraeColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b  mosaic-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...tesseraeColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span
				className="rli-d-i-b mosaic-throbber"
				style={
					{
						...(tesseractAnimationInterval && {
							"--mosaic-skip-interval": tesseractAnimationInterval
						}),
						...styles
					} as React.CSSProperties
				}
			>
				<span className="rli-d-i-b mosaic-cube mosaic-cube1"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube2"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube3"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube4"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube5"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube6"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube7"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube8"></span>
				<span className="rli-d-i-b mosaic-cube mosaic-cube9"></span>
			</span>

			<Text
				// className="mosaic-cube-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export default React.memo(Mosaic);

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
