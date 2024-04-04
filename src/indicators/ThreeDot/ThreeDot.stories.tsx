import { Meta, StoryObj } from "@storybook/react";

import ThreeDot from "./ThreeDot";
import { developmentColorArr, developmentColorStr } from "../variables";

export default {
	title: "rli/ThreeDot",
	component: ThreeDot
} as Meta<typeof ThreeDot>;

type ThreeDotStory = StoryObj<typeof ThreeDot>;

export const Primary: ThreeDotStory = {};

export const Secondary: ThreeDotStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: ThreeDotStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: ThreeDotStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
