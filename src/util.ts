import { parseArgs } from "node:util"

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
		"no-format": {
			type: "boolean",
		},
		prime: {
			type: "boolean",
			short: "P",
		},
	},
})

if (args.values.prime) {
	args.values["no-sort"] = true
	args.values["no-commit"] = true
	args.values["no-format"] = true
}

export const run = async (command: Parameters<typeof Bun.spawn>[0]) => {
	// todo make this work on node
	return await Bun.spawn(command, {
		stdio: ["inherit", "inherit", "inherit"],
	}).exited
}

export const runResult = async (command: Parameters<typeof Bun.spawn>[0]) => {
	// todo make this work on node
	const process = Bun.spawn(command)
	return await new Response(process.stdout).text()
}
