import React from "react";

import { ThreeDotProps } from "./ThreeDot.types";
import { Pulsate } from "./Pulsate";
import { BrickStack } from "./BrickStack";
import { Bob } from "./Bob";
import { Bounce } from "./Bounce";

const ThreeDot = (props: ThreeDotProps) => {
	let { variant: componentVariant = "pulsate" }: ThreeDotProps = Object(props);

	return componentVariant === "pulsate" ? (
		<Pulsate {...props} />
	) : componentVariant === "brick-stack" ? (
		<BrickStack {...props} />
	) : componentVariant === "bob" ? (
		<Bob {...props} />
	) : componentVariant === "bounce" ? (
		<Bounce {...props} />
	) : null;
};

export default ThreeDot;
