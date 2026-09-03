import js from "@eslint/js";
import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin";

export default [
  // 1. የ dist ማህደርን እና የውቅር ፋይሉን ራሱ መዝለል
  {
    ignores: ["dist/**", "eslint.config.mjs"],
  },
  // 2. ለውቅር ፋይሉ ራሱ (eslint.config.mjs) የሚሆን ልዩ ደንብ
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
  // 3. ለቀቀሩት የپրጀክት ፋይሎችዎ የሚሆን ዋናው ውቅር
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
