import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./SplitDisc.scss";
import { SplitDiscProps } from "./SplitDisc.types";

const SplitDisc = (props: SplitDiscProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles
	let { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	// If Color property is a string, that is the color of all rings
	// If color property is an array, that is color for each rings
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
	let colorProp: string | string[] = props?.color ?? "";
	const discsColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b split-disc-rli-bounding-box"
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
				className="rli-d-i-b split-disc-throbber"
				ref={elemRef}
				style={{
					...discsColorStyles,
					...styles
				}}
			>
				<span className="rli-d-i-b split-disc-ring"></span>
				<Text
					className="split-disc-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export { SplitDisc };

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
		stylesObject["--splits-color"] = colorProp[0];
		stylesObject["color"] = colorProp[0];

		for (let idx = 0; idx < arrLength; idx++) {
			if (idx >= 2) break;
			let currentItem = `split${idx + 1}`;

			stylesObject[`--${currentItem}-color`] = colorProp[idx];
		}
		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
