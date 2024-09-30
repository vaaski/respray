import { apply } from "./apply"
import { prettier } from "./prettier"

import { parseArgs } from "node:util"
import { run } from "./util"
import { eslint } from "./eslint"
import { eslintNuxt, isNuxt } from "./nuxt"

// todo make commits for each step
// todo format committed files

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

if (await isNuxt()) {
  if (args.positionals.length > 0) {
    // if (args.positionals.includes("prettier")) await prettier(config)
    if (args.positionals.includes("eslint")) await eslintNuxt(config)
  } else {
    // await prettier(config)
    await eslintNuxt(config)
  }
} else {
  if (args.positionals.length > 0) {
    if (args.positionals.includes("prettier")) await prettier(config)
    if (args.positionals.includes("eslint")) await eslint(config)
  } else {
    await prettier(config)
    await eslint(config)
  }
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
