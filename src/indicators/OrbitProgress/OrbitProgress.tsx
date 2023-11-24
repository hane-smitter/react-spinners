import React from "react";
import { Spokes } from "./Spokes";
import { OrbitProgressProps } from "./OrbitProgress.types";

import { Disc } from "./Disc";
import { Dotted } from "./Dotted";
import { SplitDisc } from "./SplitDisc";
import { TrackDisc } from "./TrackDisc";

const OrbitProgress = (props: OrbitProgressProps) => {
	// let componentVariant: string = props?.variant || "disc";
	const { variant: componentVariant = "disc" }: OrbitProgressProps =
		Object(props);

	return componentVariant === "dotted" ? (
		<Dotted {...props} />
	) : componentVariant === "bubble-dotted" ? (
		<Spokes {...props} />
	) : componentVariant === "disc" ? (
		<Disc {...props} />
	) : componentVariant === "split-disc" ? (
		<SplitDisc {...props} />
	) : componentVariant === "track-disc" ? (
		<TrackDisc {...props} />
	) : null;
};

export default React.memo(OrbitProgress);
