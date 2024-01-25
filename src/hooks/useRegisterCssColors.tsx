import { useEffect } from "react";
import { defaultColor as DEFAULT_COLOR } from "../indicators/variables";

type initColorFn = (
	defaultColor: string,
	positionIndex: number,
	loopedArray: string[]
) => string;

/**
 * @callback setInitialColorCb
 * @param {string} defaultColor - The default/fallback color for the animation
 * @param {number} positionIndex - The index of property name obtained from array of property names
 * @param {string[]} loopedArray - The array source of `positionIndex`
 */

/**
 * Registers css coloring custom properties
 * @param CssProperties - Pass css property names in an array or nested array of depth 1
 * @param {setInitialColorCb} setInitialColor -  A callback that allows to customize a default color to be set
 */
function useRegisterCssColors(
	CssProperties: Array<string | Array<string>>,
	setInitialColor: initColorFn = (defaultColor: string) => defaultColor
): void {
	function generateWarning(error: unknown) {
		if (error instanceof Error) {
			if (error.name == "InvalidModificationError") {
				return;
			} else {
				console.warn(error.message);
			}
		} else {
			console.warn("Error occured while registering css properties");
		}
	}
	// Registering/giving types to css variables controlling color of spinner
	useEffect(() => {
		const hasArrayItems: boolean = CssProperties.every(property =>
			Array.isArray(property)
		);

		if (hasArrayItems) {
			for (let i = 0; i < CssProperties.length; i++) {
				const cssPropsArr: string[] = CssProperties[i] as string[];

				for (let idx = 0; idx < cssPropsArr.length; idx++) {
					const property: string = String(cssPropsArr[idx]);

					try {
						window.CSS.registerProperty({
							name: property,
							syntax: "<color>",
							inherits: true,
							initialValue: setInitialColor(DEFAULT_COLOR, idx, cssPropsArr)
						});
					} catch (error: unknown) {
						generateWarning(error);
						continue;
					}
				}
			}
		} else {
			for (let i = 0; i < CssProperties.length; i++) {
				const property: string = String(CssProperties[i]);
				const propertiesArr: string[] = CssProperties as string[];

				try {
					window.CSS.registerProperty({
						name: property,
						syntax: "<color>",
						inherits: true,
						initialValue: setInitialColor(DEFAULT_COLOR, i, propertiesArr)
					});
				} catch (error: unknown) {
					generateWarning(error);
					continue;
				}
			}
		}
	}, []);
}

export default useRegisterCssColors;
