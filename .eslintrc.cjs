module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  env: { browser: true, es2021: true },
};

// eslint.config.js (ESM)
export default [
  {
    // сюда перенеси всё, что было в .eslintignore
    ignores: [
      "_archive/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "node_modules/**"
    ],
  },

  // дальше оставляй свой текущий конфиг как есть:
  // js.configs.recommended, ...tseslint.configs.recommended, плагины и т.п.
];