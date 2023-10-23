import React from "react";

interface TextProps {
	className?: string;
	text?: string | boolean;
	textColor?: string;
	staticText?: boolean;
	style?: React.CSSProperties;
}

const staticTextStyles: React.CSSProperties = {
	color: "currentColor",
	mixBlendMode: "difference",
	width: "unset",
	display: "block",
	paddingTop: "2px"
};

const Text = (props: TextProps): JSX.Element | null => {
	const { className, text, textColor, staticText, style } = props;
	return text ? (
		<span
			className={`rli-d-i-b rli-text-format ${className || ""}`.trim()}
			style={{
				...(staticText && staticTextStyles),
				...(textColor && {
					color: textColor,
					mixBlendMode: "unset"
				}),
				...(style && style)
			}}
		>
			{typeof text === "string" && text.length ? text : "loading"}
		</span>
	) : null;
};

export default Text;
