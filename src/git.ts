import { args, run, runResult } from "./util"

export const commit = async (message: string) => {
	if (args.values["no-commit"]) return

	await run(["git", "add", "."])
	await run(["git", "commit", "-m", message])
}

export const gitWorktreeDirty = await (async () => {
	if (args.values["no-commit"]) return false

	const stdout = await runResult(["git", "status", "--porcelain"])

	return stdout.trim() !== ""
})()
