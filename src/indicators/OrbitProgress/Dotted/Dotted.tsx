import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Dotted.scss";
import { DottedProps } from "./Dotted.types";

const Dotted = (props: DottedProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	// Accept Array or String color prop and set all dots color
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
	let colorProp: string | string[] = props?.color ?? "";
	const dotsColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b dot-rli-bounding-box"
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
				className="rli-d-i-b fading-dot-throbber"
				ref={elemRef}
				style={{ ...dotsColorStyles, ...styles }}
			>
				{Array.from({ length: 12 }).map((item, i) => (
					<span
						key={`fading-dot-${i}`}
						className={`rli-d-i-b fading-dot${i + 1} fading-dot-matter`}
						style={{ "--elem-pos": `${i + 1}` } as React.CSSProperties}
					></span>
				))}

				<Text
					className="fading-dot-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export { Dotted };

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
		// Pick first item as the color
		const [color] = colorProp;

		stylesObject["color"] = color;

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
