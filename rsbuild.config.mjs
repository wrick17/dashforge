import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	plugins: [pluginReact()],
	html: {
		title: "DashForge",
	},
	output: {
		filename: '[name].[hash].js'
	}
});
