"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./Slab.scss";
import { SlabProps } from "./Slab.types";

const Slab = (props: SlabProps) => {
	// Styles
	const elemRef = useRef<HTMLSpanElement | null>(null);

	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "4s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS - Set color of the loading indicator */
	const colorReset: () => void = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
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
					"--rli-animation-duration": animationPeriod
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
		const [color] = colorProp;
		stylesObject["color"] = color;

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
