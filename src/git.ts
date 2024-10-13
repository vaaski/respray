import { args, run } from "./util"

export const commit = async (message: string) => {
  if (args.values["no-commit"]) return

  await run(["git", "add", "."])
  await run(["git", "commit", "-m", message])
}
