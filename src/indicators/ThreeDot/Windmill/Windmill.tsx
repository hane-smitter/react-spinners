"use strict";

import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Windmill.scss";
import { WindmillProps } from "./Windmill.types";
import useRegisterCssColors from "../../../hooks/useRegisterCssColors";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import arrayRepeat from "../../../utils/arrayRepeat";

const TDWindmillColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--TD-windmill-phase${idx + 1}-color`
);

const Windmill = (props: WindmillProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);

	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS - Set color of the loading indicator */
	useRegisterCssColors(TDWindmillColorPhases);
	const colorReset: () => void = useCallback(
		function () {
			if (elemRef.current) {
				const cssVars: string[] = Array.from({ length: 3 }, (item, idx) => {
					const num: number = idx + 1;
					const windmillDotId: string = `--windmill-dot${num}-color`;

					return windmillDotId;
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
	const brickStackColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);
	return (
		<span
			ref={elemRef}
			className="rli-d-i-b windmill-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...brickStackColorStyles,
					...styles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span className="rli-d-i-b windmill-indicator">
				<span className="rli-d-i-b windmill"></span>
			</span>

			<Text staticText text={props?.text} textColor={props?.textColor} />
		</span>
	);
};

export { Windmill };

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
		const colorArr: string[] = arrayRepeat(
			colorProp,
			TDWindmillColorPhases.length
		);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[TDWindmillColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < TDWindmillColorPhases.length; i++) {
			stylesObject[TDWindmillColorPhases[i]] = colorProp;
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
					)} received in <ThreeDot variant="windmill" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < TDWindmillColorPhases.length; i++) {
			stylesObject[TDWindmillColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
