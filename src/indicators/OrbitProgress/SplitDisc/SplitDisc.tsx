import React, { useCallback, useRef } from "react";

import useAnimationPacer from "../../../hooks/useAnimationPacer";
import useStylesPipeline from "../../../hooks/useStylesPipeline";
import Text from "../../../utils/Text";
import "./SplitDisc.scss";
import { SplitDiscProps } from "./SplitDisc.types";
import { defaultColor as DEFAULT_COLOR } from "../../variables";
import arrayRepeat from "../../../utils/arrayRepeat";
import useRegisterCssProps from "../../../hooks/useSetCSSColorTypes";

// CSS properties for switching colors
const annulusSplitsColorVars: Array<string> = Array.from(
	{ length: 4 },
	(_, idx) => `--OP-annulus-dual-sectors-phase${idx + 1}-color`
);

const SplitDisc = (props: SplitDiscProps) => {
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
	useRegisterCssProps(annulusSplitsColorVars);
	const colorReset = useCallback(
		function () {
			if (elemRef.current) {
				for (let i = 0; i < annulusSplitsColorVars.length; i++) {
					elemRef.current?.style.removeProperty(annulusSplitsColorVars[i]);
				}
			}
		},
		[elemRef.current]
	);
	const colorProp: string | string[] = props?.color ?? "";
	const annulusSplitsColorStyles: React.CSSProperties =
		stylesObjectFromColorProp(colorProp, colorReset);

	return (
		<span
			className="rli-d-i-b OP-annulus-dual-sectors-rli-bounding-box"
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
				className="rli-d-i-b OP-annulus-dual-sectors-indicator"
				ref={elemRef}
				style={{
					...annulusSplitsColorStyles,
					...styles
				}}
			>
				<span className="rli-d-i-b annulus-sectors"></span>
				<Text
					className="OP-annulus-dual-sectors-text"
					text={props?.text}
					textColor={props?.textColor}
				/>
			</span>
		</span>
	);
};

export { SplitDisc };

/**
 * Creates a style object with props that color the throbber/spinner
 */
function stylesObjectFromColorProp(
	colorProp: string | string[],
	resetToDefaultColors: () => void
): React.CSSProperties {
	const stylesObject: any = {};
	const switchersLength = annulusSplitsColorVars.length;

	if (!colorProp) {
		resetToDefaultColors();
		return stylesObject;
	}

	if (colorProp instanceof Array) {
		const colorArr: string[] = arrayRepeat(colorProp, switchersLength);

		for (let idx = 0; idx < colorArr.length; idx++) {
			if (idx >= 4) break;

			stylesObject[annulusSplitsColorVars[idx]] = colorArr[idx];
		}

		return stylesObject;
	}

	// if (colorProp instanceof Array) {
	// 	const arrLength = colorProp.length;
	// 	stylesObject["--splits-color"] = colorProp[0];
	// 	stylesObject["color"] = colorProp[0];

	// 	for (let idx = 0; idx < arrLength; idx++) {
	// 		if (idx >= 2) break;
	// 		let currentItem = `split${idx + 1}`;

	// 		stylesObject[`--${currentItem}-color`] = colorProp[idx];
	// 	}
	// 	return stylesObject;
	// }

	try {
		if (typeof colorProp !== "string") throw new Error("Color String expected");

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[annulusSplitsColorVars[i]] = colorProp;
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
					)} received in <OrbitProgress variant="annulus-splits" /> indicator cannot be processed. Using default instead!`
			  );

		for (let i = 0; i < switchersLength; i++) {
			stylesObject[annulusSplitsColorVars[i]] = DEFAULT_COLOR;
		}
	}

	return stylesObject;
}
