import type { Config } from "."

import { run } from "./util"

import { readFile, writeFile } from "node:fs/promises"

export const installPackages = async (packages: Partial<Config["packages"]>) => {
	const { save, dev } = packages

	if (save && save.length > 0) await run(["bun", "i", ...save])
	if (dev && dev.length > 0) await run(["bun", "i", "-D", ...dev])
}

export const addScripts = async (scripts: Config["scripts"]) => {
	const packageJsonString = await readFile("package.json", "utf8")
	const packageJson = JSON.parse(packageJsonString)

	if (packageJson === null) throw new Error("package.json is not valid JSON")
	if (typeof packageJson !== "object") throw new Error("package.json is not an object")

	const copy = {
		...packageJson,
		scripts: packageJson.scripts ?? {},
	}

	for (const script of scripts) {
		copy.scripts[script.name] = script.command
	}

	const stringified = JSON.stringify(copy, undefined, 2)
	await writeFile("package.json", stringified)
}

export const addConfigFiles = async (files: Config["files"]) => {
	for (const file of files) {
		if (typeof file === "function") {
			await file()
		} else {
			await writeFile(file.name, file.contents)
		}
	}
}

export const runPostHooks = async (hooks: Config["postHooks"]) => {
	for (const hook of hooks) {
		await hook()
	}
}
