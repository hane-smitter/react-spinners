"use strict";

import React, { useCallback, useRef, useEffect } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./Mosaic.scss";
import { MosaicProps } from "./Mosaic.types";
import { defaultColor } from "../variables";

const Mosaic = (props: MosaicProps) => {
	const DEFAULT_COLOR: string = defaultColor;
	const elemRef = useRef<HTMLSpanElement | null>(null);
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
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const tesseraeColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	// Registering/giving types to css variables controlling color of loading indicator
	useEffect(() => {
		const colorVars = [
			"--mosaic-color1",
			"--mosaic-color2",
			"--mosaic-color3",
			"--mosaic-color4"
		];

		for (let i = 0; i < colorVars.length; i++) {
			try {
				window.CSS.registerProperty({
					name: colorVars[i],
					syntax: "<color>",
					inherits: true,
					initialValue: DEFAULT_COLOR
				});
			} catch (error) {
				console.group("--mosaic-colorX vAR ERR");
				console.log(error);
				console.groupEnd();
				continue;
			}
		}
	}, []);

	return (
		<span
			className="rli-d-i-b  mosaic-rli-bounding-box"
			ref={elemRef}
			style={
				{
					...(fontSize && { fontSize }),
					...(animationPeriod && {
						"--rli-animation-duration": animationPeriod
					}),
					...(easingFn && { "--rli-animation-function": easingFn }),
					...tesseraeColorStyles
				} as React.CSSProperties
			}
			role="status"
			aria-live="polite"
			aria-label="Loading"
		>
			<span
				className="rli-d-i-b mosaic-throbber"
				style={
					{
						...(tesseractAnimationInterval && {
							"--mosaic-skip-interval": tesseractAnimationInterval
						}),
						...styles
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

export default React.memo(Mosaic);

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
		for (let idx = 0; idx < arrLength; idx++) {
			if (idx >= 4) break;
			let colorId: number = idx + 1;

			stylesObject[`--mosaic-color${colorId}`] = colorProp[idx];
		}

		return stylesObject;
	}

	// If color prop is not an array, set all coloring vars to the received prop
	for (let idx: number = 0; idx <= 3; idx++) {
		let colorId: number = idx + 1;

		stylesObject[`--mosaic-color${colorId}`] = colorProp;
	}

	return stylesObject;
}

