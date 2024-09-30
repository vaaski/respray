import withNuxt from "./.nuxt/eslint.config.mjs"
import unicorn from "eslint-plugin-unicorn"

export default withNuxt([
  {
    files: ["**/*.html", "**/*.vue"],
    rules: {
      // this is stupid.
      // https://github.com/prettier/prettier/issues/15336
      "vue/html-self-closing": "off",
    },
  },
]).prepend([
  unicorn.configs["flat/recommended"],
  {
    rules: {
      "unicorn/prefer-ternary": "off",
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            props: true,
          },
        },
      ],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
    },
  },
])
