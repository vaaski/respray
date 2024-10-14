import type { Config } from "."

import { readFile } from "node:fs/promises"
import path from "node:path"

import { eslintNuxt, isNuxt } from "./nuxt"

const CONFIG_FILE = path.join(import.meta.dir, "../configs/eslint.js")

export const eslint = async (config: Config) => {
	if (await isNuxt()) return await eslintNuxt(config)

	const contents = await readFile(CONFIG_FILE, "utf8")

	config.files.push({
		name: "eslint.config.mjs",
		contents,
	})

	config.packages.dev.push(
		"@eslint/js",
		"eslint",
		"eslint-plugin-unicorn",
		"globals",
		"typescript-eslint",
	)

	config.scripts.push({
		name: "lint",
		command: "eslint .",
	})
}
