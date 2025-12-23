import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import * as tseslint from "typescript-eslint";

export const makeConfig = (opts) => {
  const withReact = opts?.react === true

  return [
    {
      ignores: [
        "dist/**",
        "**/dist/**",
        "**/node_modules/**",
        "**/vite.config.*.timestamp*",
        "**/vitest.config.*.timestamp*",
        "**/eslint.config.cjs",
        "**/eslint.config.mjs",
      ],
    },
    {
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },


    js.configs.recommended,
    ...tseslint.configs.recommended,



    {
      name: "seij/eslint-ts-commons",
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "no-extra-semi": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-empty-object-type": "off",
        "jsx-a11y/accessible-emoji": "off",
        // "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-unused-vars": ["warn", { "args": "none" }]
      }
    },
    {
      name: "seij/eslint-js-commons",
      files: ["**/*.js", "**/*.jsx"],
      rules: {
        "no-extra-semi": "off",
        "jsx-a11y/accessible-emoji": "off"
      }
    },
    // bloc React optionnel
    ...(withReact ? [{
      files: ["**/*.{jsx,tsx}"],
      settings: { react: { version: "detect" } },
      plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      rules: {
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-key": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "jsx-a11y/alt-text": "warn",
      },
    },
    ] : [])
  ];
};
