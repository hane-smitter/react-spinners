import { Meta, StoryObj } from "@storybook/react";

import Slab from "./Slab";
import { developmentColorArr, developmentColorStr } from "../variables";

export default {
	title: "rli/Slab",
	component: Slab
} as Meta<typeof Slab>;

type SlabStory = StoryObj<typeof Slab>;

export const Primary: SlabStory = {};

export const Secondary: SlabStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: SlabStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: SlabStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
