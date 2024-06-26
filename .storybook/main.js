const path = require("path");
const webpack = require("webpack");

module.exports = {
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

    addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions"
	],

    framework: {
        name: "@storybook/react-webpack5",
        options: {}
    },

    webpackFinal: async (config, { configType }) => {
		// Make whatever fine-grained changes you need
		config.module.rules.push({
			test: /^.*\.s[ac]ss$/i,
			use: [
				// Creates `style` nodes from JS strings
				"style-loader",
				// Translates CSS into CommonJS
				"css-loader",
				// Compiles Sass to CSS
				"sass-loader"
			],
			include: path.resolve(__dirname, "../src")
		});

		// Return the altered config
		return {
			...config,
			plugins: config.plugins.map(plugin => {
				if (plugin.constructor.name === "IgnorePlugin") {
					return new webpack.IgnorePlugin({
						resourceRegExp: plugin.options.resourceRegExp,
						contextRegExp: plugin.options.contextRegExp
					});
				}

				return plugin;
			})
		};
	}
};
