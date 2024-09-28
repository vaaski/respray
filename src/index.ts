import { apply } from "./apply"
import { prettier } from "./prettier"

import { parseArgs } from "node:util"
import { run } from "./util"
import { eslint } from "./eslint"

export type Config = {
  files: {
    name: string
    contents: string
  }[]

  scripts: {
    name: string
    command: string
  }[]

  packages: {
    save: string[]
    dev: string[]
  }
}

const args = parseArgs({
  allowPositionals: true,
  options: {
    dry: {
      type: "boolean",
      short: "d",
    },
    "no-sort": {
      type: "boolean",
    },
  },
})

const config: Config = {
  files: [],
  scripts: [],
  packages: {
    save: [],
    dev: [],
  },
}

if (args.positionals.length > 0) {
  if (args.positionals.includes("prettier")) await prettier(config)
  if (args.positionals.includes("eslint")) await eslint(config)
} else {
  await prettier(config)
  await eslint(config)
}

if (args.values.dry) {
  console.log(config)
} else {
  await apply(config)

  if (!args.values["no-sort"]) {
    try {
      // todo: make this better
      await run(["bun", "x", "sort-package-json"])
    } catch {}
  }
}
