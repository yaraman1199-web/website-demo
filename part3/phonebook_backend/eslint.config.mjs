import js from "@eslint/js";
import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin";

export default [
  {
    ignores: ["dist/**", "eslint.config.mjs"],
  },

  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["eslint.config.mjs"],
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {
      ...js.configs.recommended.rules,
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
