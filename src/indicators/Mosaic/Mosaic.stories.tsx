import { Meta, StoryObj } from "@storybook/react";

import Mosaic from "./Mosaic";
import { developmentColorArr, developmentColorStr } from "../variables";

export default {
	title: "rli/Mosaic",
	component: Mosaic
} as Meta<typeof Mosaic>;

type MosaicStory = StoryObj<typeof Mosaic>;

export const Primary: MosaicStory = {};

export const Secondary: MosaicStory = {
	args: {
		color: developmentColorStr,
		text: true
	}
};

export const MultiColored: MosaicStory = {
	args: {
		color: developmentColorArr
	}
};

export const CustomText: MosaicStory = {
	args: {
		text: "Fairly Long text passed",
		color: "#64CCC5"
	}
};
