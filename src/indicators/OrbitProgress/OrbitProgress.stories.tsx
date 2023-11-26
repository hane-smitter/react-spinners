import React from "react";
import { Meta, StoryFn, StoryObj } from "@storybook/react";
import OrbitProgress from "./OrbitProgress";
import { OrbitProgressProps } from "./OrbitProgress.types";
import { devSecondaryColor } from "../variables";

// extended OrbitProgress props
interface xOPProps extends OrbitProgressProps {
	dense?: boolean;
}

export default {
	title: "rli/OrbitProgress",
	component: OrbitProgress
} as Meta<typeof OrbitProgress>;

// const Template: StoryFn<typeof OrbitProgress> = args => {
// 	const CmpProps: xOPProps = { ...args };
// 	if (CmpProps.variant === "bubble-dotted") {
// 		CmpProps.dense = true;
// 	}
// 	return <OrbitProgress {...CmpProps} />;
// };

type OPIndicatorStory = StoryObj<typeof OrbitProgress>;

export const Primary: OPIndicatorStory = {};

export const Secondary: OPIndicatorStory = {
	args: {
		color: devSecondaryColor,
		text: true
	}
};

export const Small: OPIndicatorStory = {
	args: {
		size: "small"
	}
};

export const Medium: OPIndicatorStory = {
	args: {
		size: "medium"
	}
};

export const Large: OPIndicatorStory = {
	args: {
		size: "large"
	}
};

// export const Large = Template.bind({});
// Large.args = {
// 	size: "large"
// };
