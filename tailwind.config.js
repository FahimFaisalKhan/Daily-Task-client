/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      ...colors,

      dark: "#0d0c1d",
      primary: "#161b33",
      secondary: "#474973",
      tertiary: "#a69cac",
      light: "#f1dac4",
    },
    extend: {},
  },
  plugins: [],
};
