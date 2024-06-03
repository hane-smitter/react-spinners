import { CommonProps } from "../common.types";
export interface ThreeDotProps extends CommonProps {
	/**
	 * Variant of a ThreeDot loading indicator. Defaults to `Pulsate`.
	 */
	variant?: "pulsate" | "bob" | "brick-stack" | "bounce";
}
