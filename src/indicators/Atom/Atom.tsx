"use strict";

import React from "react";
import colorParse from "tinycolor2";

import "./Atom.scss";
import { AtomProps } from "./Atom.types";
import { defaultColor } from "../variables";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import arrayRepeat from "../../utils/arrayRepeat";

const DEFAULT_COLOR = colorParse(defaultColor).toRgb();

// NOTE: Below variables should match with ones set in sass file
const atomColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--atom-phase${idx + 1}-rgb`
);

const Atom = (props: AtomProps) => {
	// Styles
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	const colorProp: string | string[] = props?.color ?? "";
	const atomColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b atom-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...atomColorStyles,
					...styles
				} as React.CSSProperties
			}
		>
			<span className="rli-d-i-b atom-indicator">
				<span className="rli-d-i-b electron-orbit"></span>
				<span className="rli-d-i-b electron-orbit"></span>
				<span className="rli-d-i-b electron-orbit"></span>
			</span>
			<Text
				className="atom-text"
				staticText
				text={props?.text}
				textColor={props?.textColor}
			/>
		</span>
	);
};

export default Atom;

/**
 * Creates a style object with props that color the throbber/spinner
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, atomColorPhases.length);

		for (let i = 0; i < colorArr.length; i++) {
			if (i >= 4) break;

			try {
				const newColor = colorParse(colorArr[i]);
				if (!newColor.isValid()) throw new Error("invalid color");

				const newRgbColor = newColor.toRgb();

				const redChannel = newRgbColor.r;
				const greenChannel = newRgbColor.g;
				const blueChannel = newRgbColor.b;

				stylesObject[
					atomColorPhases[i]
				] = `${redChannel}, ${greenChannel}, ${blueChannel}`;
			} catch (error) {
				const redChannel = DEFAULT_COLOR.r;
				const greenChannel = DEFAULT_COLOR.g;
				const blueChannel = DEFAULT_COLOR.b;

				stylesObject[
					atomColorPhases[i]
				] = `${redChannel}, ${greenChannel}, ${blueChannel}`;
				console.warn(
					`Possibly an invalid color( ${colorArr[i]} ) passed to Atom indicator!`
				);
			}
		}
		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		const newColor = colorParse(colorProp);
		if (!newColor.isValid()) throw new Error("Invalid color");

		const newRgbColor = newColor.toRgb();

		const redChannel = newRgbColor.r;
		const greenChannel = newRgbColor.g;
		const blueChannel = newRgbColor.b;

		for (let i = 0; i < atomColorPhases.length; i++) {
			stylesObject[
				atomColorPhases[i]
			] = `${redChannel}, ${greenChannel}, ${blueChannel}`;
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
					)} received in <Atom /> indicator cannot be processed. Using default instead!`
			  );
		for (let i = 0; i < atomColorPhases.length; i++) {
			const redChannel = DEFAULT_COLOR.r;
			const greenChannel = DEFAULT_COLOR.g;
			const blueChannel = DEFAULT_COLOR.b;

			stylesObject[
				atomColorPhases[i]
			] = `${redChannel}, ${greenChannel}, ${blueChannel}`;
		}
	}

	return stylesObject;
}
