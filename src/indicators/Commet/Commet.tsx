import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./Commet.scss";
import { CommetProps } from "./Commet.types";
import arrayRepeat from "../../utils/arrayRepeat";
import { defaultColor as DEFAULT_COLOR } from "../variables";

// NOTE: Below variables should match with ones set in sass file
const commetColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--commet-phase${idx + 1}-color`
);

const Commet = (props: CommetProps) => {
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

	// color SETTINGS
	const colorReset: () => void = useCallback(function () {
		if (elemRef.current) {
			// elemRef.current?.style.removeProperty("color");
			for (let i = 0; i < commetColorPhases.length; i++) {
				elemRef.current?.style.removeProperty(commetColorPhases[i]);
			}
		}
	}, []);
	const colorProp: string | string[] = props?.color ?? "";
	const commetColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	return (
		<span
			className="rli-d-i-b commet-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...commetColorStyles,
					...styles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b commet-indicator">
				<span className="rli-d-i-b commet-box">
					<span className="rli-d-i-b commet-trail trail1"></span>
					<span className="rli-d-i-b  commetball-box"></span>
				</span>
				<span className="rli-d-i-b commet-box">
					<span className="rli-d-i-b commet-trail trail2"></span>
					<span className="rli-d-i-b commetball-box"></span>
				</span>

				<Text
					className="commet-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export default React.memo(Commet);

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
		const colorArr: string[] = arrayRepeat(colorProp, commetColorPhases.length);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[commetColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < commetColorPhases.length; i++) {
			stylesObject[commetColorPhases[i]] = colorProp;
		}
	} catch (error: unknown) {
		error instanceof Error
			? console.warn(
					`[${
						error.message
					}]: Received "${typeof colorProp}" instead with value, ${JSON.stringify(
						colorProp
					)}`
			  )
			: console.warn(
					`${JSON.stringify(
						colorProp
					)} received in <Commet /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < commetColorPhases.length; i++) {
			stylesObject[commetColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
