import { readFile } from "node:fs/promises"
import type { Config } from "."

import { join } from "node:path"

const PRETTIER_CONFIG = join(import.meta.dir, "../configs/prettier.json")

export const prettier = async (config: Config) => {
  const prettierConfig = await readFile(PRETTIER_CONFIG, "utf8")

  config.files.push({
    name: ".prettierrc.json",
    contents: prettierConfig,
  })

  config.packages.dev.push("prettier")

  config.scripts.push({
    name: "format",
    command: "prettier -w .",
  })
}
