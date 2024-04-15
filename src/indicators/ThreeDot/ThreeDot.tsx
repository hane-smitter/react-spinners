import React from "react";

import { ThreeDotProps } from "./ThreeDot.types";
import { Pulsate } from "./Pulsate";
import { BrickStack } from "./BrickStack";
import { Windmill } from "./Windmill";
import { Bob } from "./Bob";

const ThreeDot = (props: ThreeDotProps) => {
	let { variant: componentVariant = "pulsate" }: ThreeDotProps = Object(props);

	return componentVariant === "pulsate" ? (
		<Pulsate {...props} />
	) : componentVariant === "brick-stack" ? (
		<BrickStack {...props} />
	) : componentVariant === "windmill" ? (
		<Windmill {...props} />
	) : componentVariant === "bob" ? (
		<Bob {...props} />
	) : null;
};

export default ThreeDot;
