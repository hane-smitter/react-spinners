import { Meta, StoryFn, StoryObj } from "@storybook/react";

import OrbitProgress from "./OrbitProgress";
import { developmentColorStr, developmentColorArr } from "../variables";

export default {
	title: "rli/OrbitProgress",
	component: OrbitProgress
} as Meta<typeof OrbitProgress>;

type OPIndicatorStory = StoryObj<typeof OrbitProgress>;

export const Primary: OPIndicatorStory = {};

export const Secondary: OPIndicatorStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: OPIndicatorStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: OPIndicatorStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
