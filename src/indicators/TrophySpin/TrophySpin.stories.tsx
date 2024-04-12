import { Meta, StoryObj } from "@storybook/react";

import TrophySpin from "./TrophySpin";
import { developmentColorArr, developmentColorStr } from "../variables";

export default {
	title: "rli/TrophySpin",
	component: TrophySpin
} as Meta<typeof TrophySpin>;

type TrophySpinStory = StoryObj<typeof TrophySpin>;

export const Primary: TrophySpinStory = {};

export const Secondary: TrophySpinStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: TrophySpinStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: TrophySpinStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
