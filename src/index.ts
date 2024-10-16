import { addConfigFiles, addScripts, installPackages, runPostHooks } from "./apply"
import { prettier } from "./prettier"
import { eslint } from "./eslint"
import { parameters, run } from "./util"
import { commit, gitWorktreeDirty } from "./git"

export type ConfigExecutor = () => Promise<void>
export type ConfigFile = {
	name: string
	contents: string
}

export type Config = {
	files: (ConfigExecutor | ConfigFile)[]

	scripts: {
		name: string
		command: string
	}[]

	packages: {
		save: string[]
		dev: string[]
	}

	/** run stuff after all other steps, after the initial "respray" commit */
	postHooks: ConfigExecutor[]
}

const config: Config = {
	files: [],
	scripts: [],
	packages: {
		save: [],
		dev: [],
	},
	postHooks: [],
}

if (gitWorktreeDirty) {
	console.log(
		"Worktree dirty. Please stash or commit your work or pass --no-commit to continue.",
	)
	process.exit(1)
}

if (parameters.positionals.length > 0) {
	if (parameters.positionals.includes("prettier")) await prettier(config)
	if (parameters.positionals.includes("eslint")) await eslint(config)
} else {
	await prettier(config)
	await eslint(config)
}

if (parameters.values.dry) {
	console.log(config)
} else {
	await installPackages(config.packages)
	await addConfigFiles(config.files)
	await addScripts(config.scripts)

	if (!parameters.values["no-sort"]) {
		try {
			// todo: make this better
			await run(["bun", "x", "sort-package-json"])
		} catch {
			// ignore
		}
	}

	await commit("respray")

	await runPostHooks(config.postHooks)
}
