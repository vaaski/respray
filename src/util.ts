import { parseArgs } from "node:util"

export const run = async (command: Parameters<typeof Bun.spawn>[0]) => {
  // todo make this work on node
  return await Bun.spawn(command, {
    stdio: ["inherit", "inherit", "inherit"],
  }).exited
}

export const args = parseArgs({
  allowPositionals: true,
  options: {
    dry: {
      type: "boolean",
      short: "d",
    },
    "no-sort": {
      type: "boolean",
    },
    "no-commit": {
      type: "boolean",
    },
  },
})
