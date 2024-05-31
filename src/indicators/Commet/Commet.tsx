import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./Commet.scss";
import { CommetProps } from "./Commet.types";

const Commet = (props: CommetProps) => {
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

	// color SETTINGS
	// If Color property is a string, that is the color of all rings
	// If color property is an array, that is color for each rings
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				// e.g --ring1-color
				const cssColorVars: Array<string> = Array.from(
					{ length: 2 },
					(item, idx) => {
						const num: number = idx + 1;
						const cssPropName: string = `--${"ring" + num + "-"}color`;
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
	let colorProp: string | string[] = props?.color ?? "";
	const ringColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b commet-rli-bounding-box"
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
				className="rli-d-i-b commet-throbber"
				ref={elemRef}
				style={{
					...ringColorStyles,
					...styles
				}}
			>
				<Text
					className="commet-text"
					text={props?.text}
					textColor={props?.textColor}
				/>

				<span className="rli-d-i-b ring-wrapper ring1">
					<span className="rli-d-i-b ring "></span>
					<span className="rli-d-i-b ringball-holder"></span>
				</span>
				<span className="rli-d-i-b ring-wrapper ring2">
					<span className="rli-d-i-b ring "></span>
					<span className="rli-d-i-b ringball-holder"></span>
				</span>
			</span>
		</span>
	);
};

export default React.memo(Commet);

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
			if (idx >= 2) break;
			let currentItem = `ring${idx + 1}`;

			stylesObject[`--${currentItem}-color`] = colorProp[idx];
		}

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
