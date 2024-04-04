import { StoryObj, Meta } from "@storybook/react";

import LifeLine from "./LifeLine";
import { developmentColorStr,developmentColorArr } from "../variables";

export default {
	title: "rli/LifeLine",
	component: LifeLine
} as Meta<typeof LifeLine>;

type LifeLineStory = StoryObj<typeof LifeLine>;

export const Primary: LifeLineStory = {};

export const Secondary: LifeLineStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: LifeLineStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: LifeLineStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
