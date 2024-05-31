"use strict";

import React, { useCallback, useEffect, useRef } from "react";

import useAnimationPacer from "../../hooks/useAnimationPacer";
import useStylesPipeline from "../../hooks/useStylesPipeline";
import Text from "../../utils/Text";
import "./LifeLine.scss";
import { LifeLineProps } from "./LifeLine.types";

const LifeLine = (props: LifeLineProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	const svgPathRef = useRef<SVGPathElement>(null);
	const lifeLineAnimation = useRef<Animation | null>(null);
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "2s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTINGS */
	// Sets the color
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				elemRef.current?.style.removeProperty("color");
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const lifeLineColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	useEffect(() => {
		if (svgPathRef.current) {
			const pathEl: SVGPathElement = svgPathRef.current;
			const parentSvgEl: HTMLElement | null = pathEl.parentElement;
			const pathLength: number = pathEl.getTotalLength();

			const pathLengthRepeats = pathLength / 2;
			const dashArray = pathLengthRepeats * 0.94;
			const dashArrayGap = pathLengthRepeats * 0.06;

			pathEl.style.strokeDasharray = `${dashArray} ${dashArrayGap}`;
			pathEl.style.strokeDashoffset = `${pathLength}`;
			parentSvgEl && (parentSvgEl.style.visibility = "visible");

			// Trigger a layout so styles are calculated & the browser
			// picks up the starting position before animating
			pathEl.getBoundingClientRect();

			const lifeLineKeyframes = new KeyframeEffect(
				pathEl, // element to animate
				[{ strokeDashoffset: `${pathLength}` }, { strokeDashoffset: `0` }],
				{
					duration: parseFloat(DEFAULT_ANIMATION_DURATION) * 1000, // seconds to milliseconds
					iterations: Infinity,
					easing: easingFn || "linear"
				}
			);

			const lifeLine = new Animation(lifeLineKeyframes, document.timeline);
			lifeLineAnimation.current = lifeLine;

			// Play lifeLine animation
			lifeLine.play();
		}

		return () => {
			lifeLineAnimation.current = null;
		};
	}, []);

	useEffect(() => {
		try {
			if (lifeLineAnimation.current) {
				lifeLineAnimation.current.effect?.updateTiming({
					duration: parseFloat(animationPeriod) * 1000,
					easing: easingFn
				}); // ease, linear
			}
		} catch (error: any) {
			console.warn(error?.message);
		}
	}, [easingFn, animationPeriod]);

	return (
		<span
			className="rli-d-i-b lifeline-rli-bounding-box"
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
				ref={elemRef}
				className="rli-d-i-b lifeline-throbber"
				style={{ ...lifeLineColorStyles, ...styles }}
			>
				{/* Original size SVG */}
				{/* <svg
					width="16em" // ratio -> 2.947368421
					height="5.428571429em"
					xmlns="http://www.w3.org/2000/svg"
					version="1.2"
					viewBox="0 0 550 190"
					preserveAspectRatio="xMinYMin meet"
				>
					<path
						ref={svgPathRef}
						stroke="currentColor"
						fill="none"
						strokeWidth="2"
						strokeLinejoin="round"
						d="M0 70h250q7-30 12-3t5 8 3-7 3 4 6 35 7-60 4 60 7-20s2-11 10-10 1 1 8-10l4 8c6 4 8-6 10-17s2 10 9 11h210"
					/>
				</svg> */}

				{/* Zoomed in SVG */}
				<svg
					width="14em"
					height="6.825000001em"
					xmlns="http://www.w3.org/2000/svg"
					version="1.2"
					viewBox="0 0 350 50"
					preserveAspectRatio="xMinYMin meet"
					className="rli-pulse-svg"
				>
					<path
						ref={svgPathRef}
						stroke="currentColor"
						fill="none"
						strokeLinejoin="round"
						strokeWidth="0.18em"
						d="M-113 70h250q8-30 12-3t5 8 3-7 3 4 6 35 8-55 6 40 8-3s2-11 10-10 1 1 8-10l4 8c6 4 8-6 10-17s2 10 9 11h210"
					></path>
				</svg>

				<Text
					// className="lifeline-text"
					staticText
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export default React.memo(LifeLine);

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
		const [color] = colorProp;

		stylesObject["color"] = color;

		return stylesObject;
	}

	stylesObject["color"] = colorProp;

	return stylesObject;
}
