"use strict";

import React from "react";

import { MosaicProps } from "./Mosaic.types";
import "./Mosaic.scss";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import useAnimationPacer from "../../hooks/useAnimationPacer";
import Text from "../../utils/Text";
import { defaultColor as DEFAULT_COLOR } from "../variables";
import arrayRepeat from "../../utils/arrayRepeat";

// CSS properties for switching colors
const mosaicColorPhases: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--mosaic-phase${idx + 1}-color`
);

const Mosaic = (props: MosaicProps) => {
	// Styles and size
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.5s"; // Animation's default duration
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
	const colorProp: string | string[] = props?.color ?? "";
	const tesseraeColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp);

	return (
		<span
			className="rli-d-i-b  mosaic-rli-bounding-box"
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...tesseraeColorStyles,
					...styles
				} as React.CSSProperties
			}
		>
			<span
				className="rli-d-i-b mosaic-indicator"
				style={
					{
						...(tesseractAnimationInterval && {
							"--mosaic-skip-interval": tesseractAnimationInterval
						})
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

export default Mosaic;

/**
 * Creates a style object with props that color the throbber/spinner
 */
function stylesObjectFromColorProp(
	colorProp: string | string[]
): React.CSSProperties {
	const stylesObject: any = {};

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, mosaicColorPhases.length);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[mosaicColorPhases[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	// If color prop is not an array, set all coloring vars to the received prop
	// for (let idx: number = 0; idx <= 3; idx++) {
	// 	let colorId: number = idx + 1;

	// 	stylesObject[`--mosaic-color${colorId}`] = colorProp;
	// }

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < mosaicColorPhases.length; i++) {
			stylesObject[mosaicColorPhases[i]] = colorProp;
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
					)} received in <Mosaic /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < mosaicColorPhases.length; i++) {
			stylesObject[mosaicColorPhases[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
