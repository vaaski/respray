import { readFile } from "node:fs/promises"
import type { Config } from "."

import { join } from "node:path"

const CONFIG_FILE = join(import.meta.dir, "../configs/eslint.js")

export const eslint = async (config: Config) => {
  const contents = await readFile(CONFIG_FILE, "utf8")

  config.files.push({
    name: "eslint.config.js",
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
