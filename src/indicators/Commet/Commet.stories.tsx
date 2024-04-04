import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Commet from "./Commet";

export default {
	title: "rli/Commet",
	component: Commet
} as ComponentMeta<typeof Commet>;

const Template: ComponentStory<typeof Commet> = args => <Commet {...args} />;

export const Primary = Template.bind({});

export const Secondary = Template.bind({});
Secondary.args = {
	color: "rebeccapurple",
	text: true
};

export const MultiColored = Template.bind({});
MultiColored.args = {
	color: ["#FF90BC", "dodgerblue", "#610C9F", "crimson"]
};

export const CustomText = Template.bind({});
CustomText.args = {
	text: "Fairly Long text passed",
	color: "#64CCC5"
};
