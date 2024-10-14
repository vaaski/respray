import type { Config } from "."

import { readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"

import { addModulesToNuxtConfig } from "./transformers/nuxt-config"

export const isNuxt = async () => {
	try {
		await stat("nuxt.config.ts")
		return true
	} catch {
		return false
	}
}

export const overwriteNuxtConfig = async () => {
	const originalNuxt = await readFile("nuxt.config.ts", "utf8")
	const transformedNuxt = addModulesToNuxtConfig(originalNuxt, ["@nuxt/eslint"])
	await writeFile("nuxt.config.ts", transformedNuxt)
}

const CONFIG_FILE = path.join(import.meta.dir, "../configs/eslint-nuxt.js")
export const eslintNuxt = async (config: Config) => {
	const contents = await readFile(CONFIG_FILE, "utf8")

	config.files.push({
		name: "eslint.config.mjs",
		contents,
	})

	config.packages.dev.push("@nuxt/eslint", "eslint-plugin-unicorn")

	config.files.push(overwriteNuxtConfig)

	config.scripts.push({
		name: "lint",
		command: "eslint .",
	})
}
