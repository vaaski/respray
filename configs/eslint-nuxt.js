import withNuxt from "./.nuxt/eslint.config.mjs"
import unicorn from "eslint-plugin-unicorn"

export default withNuxt([
	unicorn.configs["flat/recommended"],
	{
		rules: {
			"unicorn/prefer-ternary": "off",
			"unicorn/prefer-global-this": "off",
		},
	},
	{
		files: ["utils/*.ts", "functions/*.mts"],
		rules: {
			"unicorn/no-anonymous-default-export": "off",
		},
	},
	{
		files: ["**/*.vue"],
		rules: {
			// this is stupid.
			// https://github.com/prettier/prettier/issues/15336
			"vue/html-self-closing": "off",
			"vue/component-name-in-template-casing": ["error", "PascalCase"],
			"unicorn/prevent-abbreviations": [
				"error",
				{
					allowList: {
						props: true,
					},
				},
			],
		},
	},
])
