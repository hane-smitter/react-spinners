import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./TrackDisc.scss";
import { TrackDiscProps } from "./TrackDisc.types";

const TrackDisc = (props: TrackDiscProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTING */
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
				elemRef.current?.style.removeProperty("--track-path-color");
			}
		},
		[elemRef.current]
	);
	let colorProp: string | string[] = props?.color ?? "";
	const trackDiscColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b track-disc-rli-bounding-box"
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
				className="rli-d-i-b track-disc-throbber"
				ref={elemRef}
				style={{ ...trackDiscColorStyles, ...styles }}
			>
				<span className="rli-d-i-b track-disc-ring"></span>

				<Text
					className="track-disc-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export { TrackDisc };

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
		// Array with first item - disc color, second item - track color
		const [color, trackColor] = colorProp;

		if (color) stylesObject["color"] = color;
		if (trackColor) stylesObject["--track-path-color"] = trackColor;

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
