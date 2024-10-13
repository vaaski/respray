import type { Config } from "."

import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { args, run } from "./util"
import { commit } from "./git"

const CONFIG_FILE = join(import.meta.dir, "../configs/prettier.json")

export const prettier = async (config: Config) => {
  const contents = await readFile(CONFIG_FILE, "utf8")

  config.files.push({
    name: ".prettierrc.json",
    contents,
  })

  config.packages.dev.push("prettier")

  config.scripts.push({
    name: "format",
    command: "prettier -w .",
  })

  config.postHooks.push(async () => {
    if (args.values["no-format"]) return

    await run(["bun", "run", "format"])
    await commit("format")
  })
}
