import type { Config } from "."

import { readFile } from "node:fs/promises"
import { eslintNuxt, isNuxt } from "./nuxt"

import { join } from "node:path"

const CONFIG_FILE = join(import.meta.dir, "../configs/eslint.js")

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
