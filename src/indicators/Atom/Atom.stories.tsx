import { Meta, StoryObj } from "@storybook/react";

import Atom from "./Atom";
import { developmentColorStr, developmentColorArr } from "../variables";

export default {
	title: "rli/Atom",
	component: Atom
} as Meta<typeof Atom>;

type AtomStory = StoryObj<typeof Atom>;

export const Primary: AtomStory = {};

export const Secondary: AtomStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: AtomStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: AtomStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
