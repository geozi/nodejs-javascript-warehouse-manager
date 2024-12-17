import globals from "globals";
import pluginJs from "@eslint/js";
import js from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  pluginJs.configs.recommended,
];
