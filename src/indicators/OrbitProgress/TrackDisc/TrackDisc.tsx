"use strict";

import React from "react";
import colorParse from "tinycolor2";

import { TrackDiscProps } from "./TrackDisc.types";
import "./TrackDisc.scss";
import Text from "../../../utils/Text";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import useAnimationPacer from "../../../hooks/useAnimationPacer";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import arrayRepeat from "../../../utils/arrayRepeat";

// CSS properties for switching colors
const annulusTrackColorVars: Array<string[]> = Array.from(
	{ length: 4 },
	(_, idx) => [
		`--OP-annulus-track-phase${idx + 1}-color`,
		`--OP-annulus-sector-phase${idx + 1}-color`
	]
);
const ANNULUS_TRACK_ALPHA__: number = 0.22; // 0-1
const alphaSetter: (num?: number) => number = (originalAlpha: number = 1) => {
	const derived = originalAlpha * ANNULUS_TRACK_ALPHA__;
	return derived;
};

const TrackDisc = (props: TrackDiscProps) => {
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
	let colorProp: string | string[] = props?.color ?? "";
	const annulusTrackColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);
	const boldface: string = props.dense ? "0.45em" : "";

	return (
		<span
			className="rli-d-i-b OP-annulus-sector-track-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...annulusTrackColorStyles,
					...styles
				} as React.CSSProperties
			}
		>
			<span className="rli-d-i-b OP-annulus-sector-track-indicator">
				<span
					className="rli-d-i-b annulus-track-ring"
					style={{ ...(boldface && { borderWidth: boldface }) }}
				></span>

				<Text
					className="OP-annulus-sector-text"
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
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};
	const switchersLength = annulusTrackColorVars.length;

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, switchersLength);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;
			// For each other, generate it light opacity counterpart
			// Then assign both the color and its opacity counterpart in object

			const varNames: string[] = annulusTrackColorVars[idx];
			try {
				const parsedColor = colorParse(colorArr[idx]);
				if (!parsedColor.isValid()) {
					throw new Error(`Invalid Color: ${parsedColor.getOriginalInput()}`);
				}

				const nowColorLight: string = parsedColor
					.setAlpha(alphaSetter(parsedColor.getAlpha()))
					.toRgbString();
				const nowColor = colorArr[idx];

				stylesObject[varNames[0]] = nowColorLight; // Track color
				stylesObject[varNames[1]] = nowColor; // Annulus split color
			} catch (error) {
				const nowColor = DEFAULT_COLOR;
				const parsedColor = colorParse(DEFAULT_COLOR);

				const nowColorLight = parsedColor
					.setAlpha(alphaSetter(parsedColor.getAlpha()))
					.toRgbString();

				stylesObject[varNames[0]] = nowColorLight; // Track color
				stylesObject[varNames[1]] = nowColor; // Annulus split piece color
			}
		}

		return stylesObject;
	}

	try {
		const parsedColor = colorParse(colorProp); // Note: if `colorProp` is an invalid color, it is set to black
		if (typeof colorProp !== "string") {
			throw new Error("Color String expected");
		} else if (!parsedColor.isValid()) {
			throw new Error(`Invalid Color: ${parsedColor.getOriginalInput()}`);
		}

		const nowColor = colorProp;
		const nowColorLight = parsedColor
			.setAlpha(alphaSetter(parsedColor.getAlpha()))
			.toRgbString();

		for (let i = 0; i < switchersLength; i++) {
			const varNames = annulusTrackColorVars[i];

			stylesObject[varNames[0]] = nowColorLight; // Track color
			stylesObject[varNames[1]] = nowColor; // Annulus split piece color
		}
	} catch (error: unknown) {
		error instanceof Error
			? console.warn(
					`[${
						error.message
					}]: Received "${typeof colorProp}" with value, ${JSON.stringify(
						colorProp
					)}`
			  )
			: console.warn(
					`${JSON.stringify(
						colorProp
					)} received in <OrbitProgress variant="annulus-track" /> indicator cannot be processed. Using default instead!`
			  );

		const nowColor = DEFAULT_COLOR;
		const parsedColor = colorParse(DEFAULT_COLOR);

		const nowColorLight = parsedColor
			.setAlpha(alphaSetter(parsedColor.getAlpha()))
			.toRgbString();

		for (let i = 0; i < annulusTrackColorVars.length; i++) {
			const varNames = annulusTrackColorVars[i];
			stylesObject[varNames[0]] = nowColorLight; // Track color
			stylesObject[varNames[1]] = nowColor; // Annulus split piece color
		}
	}

	return stylesObject;
}
