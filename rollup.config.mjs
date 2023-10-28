import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import autoprefixer from "autoprefixer";
import path from "path";
import { globSync as glob } from "glob";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

export default [
	// STEP 1: Create main bundle and types/declarations
	{
		input: "src/index.ts",
		output: [
			// Create CommonJS bundle
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: false
			},
			// Create ES bundle
			{
				file: packageJson.module,
				format: "esm",
				sourcemap: false
			}
		],
		plugins: [
			peerDepsExternal(), // Prevents Rollup from bundling the peer dependencies we've defined in package.json (react and react-dom)
			resolve(), // Locate modules, for using third party modules in node_modules
			commonjs(), //  Enables transpilation into CommonJS (CJS) format
			typescript({ tsconfig: "./tsconfig.json" }), // Transpiles our TypeScript code into JavaScript
			postcss({ plugins: [autoprefixer] }), // Transforms our Sass -> into CSS -> into JS tokens; for injection in style tags of HTML
			terser() // Minify the Rollup bundle
		]
	},

	// STEP 2: Create ES bundle of each loading indicator
	{
		input: {
			...Object.fromEntries(
				glob(["**/index.ts"], {
					ignore: ["index.ts", "Atom2/*"],
					maxDepth: 2,
					cwd: path.join(process.cwd(), "src/indicators")
				}).map(file => {
					return [
						// path.relative("src", file.split("/")[0]),
						file.split("/")[0],
						// This expands the relative paths to absolute paths, so e.g.
						// src/nested/foo becomes /project/src/nested/foo.js
						path.resolve(process.cwd(), "src/indicators", file)
					];
				})
			)
		},
		output: { dir: "dist", format: "esm", sourcemap: false },
		plugins: [
			peerDepsExternal(),
			resolve(),
			typescript({ tsconfig: "./tsconfig-noTypings.json" }),
			postcss({ plugins: [autoprefixer] }),
			terser() // Minify the resultant bundle
		]
	},

	// STEP 3: Generate main `index.d.ts`
	{
		input: "dist/esm/types/index.d.ts",
		output: [{ file: "dist/index.d.ts", format: "esm" }],
		plugins: [dts()],
		external: [/\.(css|less|s[ac]ss)$/] // Packages that should not be in our bundle
	},

	// STEP 4: Generate `<Loading-indicator>.d.ts` types
	{
		input: {
			...Object.fromEntries(
				glob(["**/index.ts"], {
					ignore: ["index.ts", "Atom2/*"],
					maxDepth: 2,
					cwd: path.join(process.cwd(), "src/indicators")
				}).map(file => {
					const name = file.split("/")[0];
					return [
						name,
						// This expands the relative paths to absolute paths, so e.g.
						// src/nested/foo becomes /project/src/nested/foo.js
						path.resolve(
							process.cwd(),
							"dist/esm/types/indicators",
							`${name}/index.d.ts`
						)
					];
				})
			)
		},
		output: { dir: "dist", format: "esm" },
		plugins: [dts()],
		external: [/\.(css|less|s[ac]ss)$/] // Packages that should not be in our bundle
	}
];
