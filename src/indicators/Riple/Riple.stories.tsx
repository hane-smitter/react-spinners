import { Meta, StoryObj } from "@storybook/react";

import Riple from "./Riple";
import { developmentColorArr, developmentColorStr } from "../variables";

export default {
	title: "rli/Riple",
	component: Riple
} as Meta<typeof Riple>;

type RipleStory = StoryObj<typeof Riple>;

export const Primary: RipleStory = {};

export const Secondary: RipleStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: RipleStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: RipleStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
