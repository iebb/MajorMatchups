/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/*/*/*.{js,jsx,ts,tsx}",
    "./src/*/*/*/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "Inter var, sans-serif",
        {
          fontFeatureSettings: '"cv11", "cv02", "cv03", "cv04", "cv05", "cv08", "cv09", "ss01"',
        },
      ],
    },
    extend: {
      colors: {
        inherit: "inherit",
        current: "currentColor",
        transparent: "transparent",
        nekoko: {
          '50': '#f4f7fa',
          '100': '#e5ebf4',
          '200': '#d2ddeb',
          '300': '#b3c6dd',
          '400': '#8ea9cc',
          '500': '#738ebe',
          '600': '#6078b0',
          '700': '#5568a0',
          '800': '#495684',
          '900': '#3e496a',
          '950': '#2f354b',
        },
        green: {
          c10:  "#2A6F2A",
          c7:  "#378a37",
        },
        blue: {
          c10:  "#0F4275",
          c7:  "#1359A0",
        },
        red: {
          c10:  "#871212",
          c7:  "#AE1E1E",
        },
      }
    },
  },
  plugins: [],
});

