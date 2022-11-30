/** @type {import("prettier").Config} */
module.exports = {
  parens: "avoid",
  tabWidth: 4,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
