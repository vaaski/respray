import { parameters, run, runResult } from "./util"

export const commit = async (message: string) => {
	if (parameters.values["no-commit"]) return

	await run(["git", "add", "."])
	await run(["git", "commit", "-m", message])
}

export const gitWorktreeDirty = await (async () => {
	if (parameters.values["no-commit"]) return false

	const stdout = await runResult(["git", "status", "--porcelain"])

	return stdout.trim() !== ""
})()
