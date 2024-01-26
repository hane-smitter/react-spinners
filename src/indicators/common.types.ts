type Easing =
	| "ease-in"
	| "ease-out"
	| "ease-in-out"
	| "linear"
	| "cubic-bezier(0.25, 0.1, 0.25, 1.0)"
	| "cubic-bezier(0.42, 0.0, 1.0, 1.0)"
	| "cubic-bezier(0.0, 0.0, 0.58, 1.0)"
	| "cubic-bezier(0.42, 0.0, 0.58, 1.0)"
	| "linear(0, 1)"
	| "steps(4, end)"
	| (string & {});

export interface CommonProps {
	/**
	 * Sets color of the indicator.
	 *
	 * When specifying alpha channel in **RGB** color format, it's recommended to explicitly use **RGBA**.
	 */
	color?: string | string[];
	/**
	 * Sets size of the indicator
	 */
	size?: "small" | "medium" | "large";
	/**
	 * Supply CSS in JS styles
	 */
	style?: React.CSSProperties;
	/* Enables default text, or supply a custom text */
	text?: string | boolean;
	/**
	 * Sets color of text
	 */
	textColor?: string;
	/**
	 * Unitless number `-5` through `5`. (`-`)Slows down, (`+`)speeds up animation.
	 */
	speedPlus?: -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
	/**  
	 CSS easing function, e.g `linear`, `ease-in`
	 *	@see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function | MDN Docs}
	 */
	easing?: Easing;
	/**
	 * Make the animation more compact/bold.
	 */
	dense?: boolean;
}
