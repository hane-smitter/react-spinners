import { Meta, StoryObj } from "@storybook/react";

import FourSquare from "./FourSquare";
import { developmentColorStr, developmentColorArr } from "../variables";

export default {
	title: "rli/FourSquare",
	component: FourSquare
} as Meta<typeof FourSquare>;

type FourSquareStory = StoryObj<typeof FourSquare>;

export const Primary: FourSquareStory = {};

export const Secondary: FourSquareStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: FourSquareStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: FourSquareStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
