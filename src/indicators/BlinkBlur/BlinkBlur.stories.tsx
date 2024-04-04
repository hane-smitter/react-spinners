import { Meta, StoryObj } from "@storybook/react";

import BlinkBlur from "./BlinkBlur";
import { developmentColorStr, developmentColorArr } from "../variables";

export default {
	title: "rli/BlinkBlur",
	component: BlinkBlur
} as Meta<typeof BlinkBlur>;

type BlinkBlurStory = StoryObj<typeof BlinkBlur>;

export const Primary: BlinkBlurStory = {};

export const Secondary: BlinkBlurStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: BlinkBlurStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: BlinkBlurStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
