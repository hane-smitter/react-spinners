import { CommonProps } from "../common.types";

export interface OrbitProgressProps extends CommonProps {
	/**
	 * variant of an orbitting loading indicator. Defaults to `disc`.
	 */
	variant?: "dotted" | "spokes" | "disc" | "split-disc" | "track-disc";
	/**
	 * When used with variant `spokes` it sets a more compact animation.
	 */
	dense?: boolean;
}
