import esbuild from "esbuild"
import { parseArgs } from "node:util"

const parameters = parseArgs({
	options: {
		dev: {
			type: "boolean",
			short: "d",
		},
	},
})

const esbuildConfig: esbuild.BuildOptions = {
	entryPoints: ["src/index.ts"],
	bundle: true,
	outdir: "dist",
	format: "esm",
	platform: "node",
	minify: true,

	banner: {
		js: "#!/usr/bin/env bun",
	},
}

if (parameters.values.dev) {
	const context = await esbuild.context(esbuildConfig)

	console.log("watching...")

	await context.watch()
} else {
	await esbuild.build(esbuildConfig)
}
