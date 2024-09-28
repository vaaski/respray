export const run = async (command: Parameters<typeof Bun.spawn>[0]) => {
  // todo make this work on node
  return await Bun.spawn(command, {
    stdio: ["inherit", "inherit", "inherit"],
  }).exited
}
