# respray

Initializer for formatters and linters with opinionated defaults to give your project a fresh coat of paint.

### Synopsis

This is a very opinionated CLI tool to initialize ESLint and Prettier for all the side projects I tend to start.
It's meant to be run right after initializing a project with `bun init` or `bunx nuxi init` command.

Apart from adding the config files, it will also add package.json scripts for linting and formatting.
It also adds two commits by default, one for initializing respray and one for formatting everything after.

You can also run `bunx respray prettier` or `bunx respray eslint` to only configure Prettier or ESLint respectively.

It has a special mode for Nuxt projects, and configures ESLint and Prettier with these settings:

- [eslint.js](./configs/eslint.js)
- [eslint-nuxt.js](./configs/eslint-nuxt.js)
- [prettier.json](./configs/prettier.json)

### Usage

I use Bun as a package manager these days and respray is built using Bun APIs. I haven't tested or used it on Node.js yet.

```bash
bunx respray
```

There are also a few flags you can use:

```
--dry, -d      Don't write any files, just print the config
--no-sort      Don't sort package.json after installing packages
--no-commit    Don't commit the changes
--no-format    Don't format the files
--prime, -P    Don't sort, commit, or format
```
