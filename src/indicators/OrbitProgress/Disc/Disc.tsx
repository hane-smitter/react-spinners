import React, { useCallback, useEffect, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./Disc.scss";
import { DiscProps } from "./Disc.types";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import arrayRepeat from "../../../utils/arrayRepeat";

// CSS properties for switching colors
const discColorSwitchVars: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--disc-phase${idx + 1}-color`
);

const Disc = (props: DiscProps) => {
	const elemRef = useRef<HTMLSpanElement | null>(null);
	// Styles
	const { styles, fontSize } = useStylesPipeline(props?.style, props?.size);

	// Animation speed and smoothing control
	const easingFn: string | undefined = props?.easing;
	const DEFAULT_ANIMATION_DURATION = "1.5s"; // Animation's default duration
	const { animationPeriod } = useAnimationPacer(
		props?.speedPlus,
		DEFAULT_ANIMATION_DURATION
	);

	/* Color SETTING */
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				// elemRef.current?.style.removeProperty("color");
				for (let i = 0; i < discColorSwitchVars.length; i++) {
					elemRef.current?.style.removeProperty(discColorSwitchVars[i]);
				}
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const discColorStyles: React.CSSProperties = stylesObjectFromColorProp(
		colorProp,
		colorReset
	);

	// Registering/giving types to css variables controlling color of indicator
	useEffect(() => {
		for (let i = 0; i < discColorSwitchVars.length; i++) {
			try {
				window.CSS.registerProperty({
					name: discColorSwitchVars[i],
					syntax: "<color>",
					inherits: true,
					initialValue: DEFAULT_COLOR
				});
			} catch (error) {
				continue;
			}
		}
	}, []);

	return (
		<span
			className="rli-d-i-b disc-rli-bounding-box"
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
				className="rli-d-i-b disc-throbber"
				ref={elemRef}
				style={{ ...discColorStyles, ...styles }}
			>
				<svg className="whirl" viewBox="25 25 50 50">
					{/* 👇SVGGeometry length: 124.85393524169922 */}
					<circle
						className="path"
						cx="50"
						cy="50"
						r="20"
						fill="none"
						strokeWidth="4"
						strokeMiterlimit="10"
					/>
				</svg>

				<Text
					className="disc-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export { Disc };

/**
 * Creates a style object with props that color the indicator
 */
function stylesObjectFromColorProp(
	colorProp: string | string[],
	resetToDefaultColors: () => void
): React.CSSProperties {
	const stylesObject: any = {};
	const switchersLength = discColorSwitchVars.length;

	if (!colorProp) {
		resetToDefaultColors();
		return stylesObject;
	}

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, switchersLength);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[discColorSwitchVars[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[discColorSwitchVars[i]] = colorProp;
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
					)} received in <OrbitProgress variant="disc" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[discColorSwitchVars[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
