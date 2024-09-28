export const run = async (command: Parameters<typeof Bun.spawn>[0]) => {
  return await Bun.spawn(command, {
    stdio: ["inherit", "inherit", "inherit"],
  }).exited
}
