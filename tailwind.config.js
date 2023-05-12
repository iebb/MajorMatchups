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
        white: "#000000",
        black: "#ffffff",
        "blue-gray": {
          900:  "#eceff1",
          800:  "#cfd8dc",
          700:  "#b0bec5",
          600:  "#90a4ae",
          500:  "#78909c",
          400:  "#607d8b",
          300:  "#546e7a",
          200:  "#455a64",
          100:  "#37474f",
          50:  "#263238",
          30:  "#1a1a26",
        },
        gray: {
          900:  "#fafafa",
          800:  "#f5f5f5",
          700:  "#eeeeee",
          600:  "#e0e0e0",
          500:  "#bdbdbd",
          400:  "#9e9e9e",
          300:  "#757575",
          200:  "#616161",
          100:  "#42424a",
          50:  "#212121",
        },
        brown: {
          900:  "#efebe9",
          800:  "#d7ccc8",
          700:  "#bcaaa4",
          600:  "#a1887f",
          500:  "#8d6e63",
          400:  "#795548",
          300:  "#6d4c41",
          200:  "#5d4037",
          100:  "#4e342e",
          50:  "#3e2723",
        },
        "deep-orange": {
          900:  "#fbe9e7",
          800:  "#ffccbc",
          700:  "#ffab91",
          600:  "#ff8a65",
          500:  "#ff7043",
          400:  "#ff5722",
          300:  "#f4511e",
          200:  "#e64a19",
          100:  "#d84315",
          50:  "#bf360c",
        },
        orange: {
          900:  "#fff3e0",
          800:  "#ffe0b2",
          700:  "#ffcc80",
          600:  "#ffb74d",
          500:  "#ffa726",
          400:  "#ff9800",
          300:  "#fb8c00",
          200:  "#f57c00",
          100:  "#ef6c00",
          50:  "#e65100",
        },
        amber: {
          900:  "#fff8e1",
          800:  "#ffecb3",
          700:  "#ffe082",
          600:  "#ffd54f",
          500:  "#ffca28",
          400:  "#ffc107",
          300:  "#ffb300",
          200:  "#ffa000",
          100:  "#ff8f00",
          50:  "#ff6f00",
        },
        yellow: {
          900:  "#fffde7",
          800:  "#fff9c4",
          700:  "#fff59d",
          600:  "#fff176",
          500:  "#ffee58",
          400:  "#ffeb3b",
          300:  "#fdd835",
          200:  "#fbc02d",
          100:  "#f9a825",
          50:  "#f57f17",
        },
        lime: {
          900:  "#f9fbe7",
          800:  "#f0f4c3",
          700:  "#e6ee9c",
          600:  "#dce775",
          500:  "#d4e157",
          400:  "#cddc39",
          300:  "#c0ca33",
          200:  "#afb42b",
          100:  "#9e9d24",
          50:  "#827717",
        },
        "light-green": {
          900:  "#f1f8e9",
          800:  "#dcedc8",
          700:  "#c5e1a5",
          600:  "#aed581",
          500:  "#9ccc65",
          400:  "#8bc34a",
          300:  "#7cb342",
          200:  "#689f38",
          100:  "#558b2f",
          50:  "#33691e",
        },
        green: {
          900:  "#e8f5e9",
          800:  "#c8e6c9",
          700:  "#a5d6a7",
          600:  "#81c784",
          500:  "#66bb6a",
          400:  "#4caf50",
          300:  "#43a047",
          200:  "#388e3c",
          100:  "#2e7d32",
          50:  "#217327",
          30:  "#165921",
          c10:  "#2A6F2A",
          c7:  "#378a37",
        },
        teal: {
          900:  "#e0f2f1",
          800:  "#b2dfdb",
          700:  "#80cbc4",
          600:  "#4db6ac",
          500:  "#26a69a",
          400:  "#009688",
          300:  "#00897b",
          200:  "#00796b",
          100:  "#00695c",
          50:  "#004d40",
        },
        cyan: {
          900:  "#e0f7fa",
          800:  "#b2ebf2",
          700:  "#80deea",
          600:  "#4dd0e1",
          500:  "#26c6da",
          400:  "#00bcd4",
          300:  "#00acc1",
          200:  "#0097a7",
          100:  "#00838f",
          50:  "#006064",
        },
        "light-blue": {
          900:  "#e1f5fe",
          800:  "#b3e5fc",
          700:  "#81d4fa",
          600:  "#4fc3f7",
          500:  "#29b6f6",
          400:  "#03a9f4",
          300:  "#039be5",
          200:  "#0288d1",
          100:  "#0277bd",
          50:  "#01579b",
        },
        blue: {
          900:  "#e3f2fd",
          800:  "#bbdefb",
          700:  "#90caf9",
          600:  "#64b5f6",
          500:  "#42a5f5",
          400:  "#2196f3",
          300:  "#1e88e5",
          200:  "#1976d2",
          100:  "#1565c0",
          50:  "#0d47a1",
          30:  "#002259",
          c10:  "#0F4275",
          c7:  "#1359A0",
        },
        indigo: {
          900:  "#e8eaf6",
          800:  "#c5cae9",
          700:  "#9fa8da",
          600:  "#7986cb",
          500:  "#5c6bc0",
          400:  "#3f51b5",
          300:  "#3949ab",
          200:  "#303f9f",
          100:  "#283593",
          50:  "#1a237e",
          30:  "#0d1240",
        },
        "deep-purple": {
          900:  "#ede7f6",
          800:  "#d1c4e9",
          700:  "#b39ddb",
          600:  "#9575cd",
          500:  "#7e57c2",
          400:  "#673ab7",
          300:  "#5e35b1",
          200:  "#512da8",
          100:  "#4527a0",
          50:  "#311b92",
        },
        purple: {
          900:  "#f3e5f5",
          800:  "#e1bee7",
          700:  "#ce93d8",
          600:  "#ba68c8",
          500:  "#ab47bc",
          400:  "#9c27b0",
          300:  "#8e24aa",
          200:  "#7b1fa2",
          100:  "#6a1b9a",
          50:  "#4a148c",
        },
        pink: {
          900:  "#fce4ec",
          800:  "#f8bbd0",
          700:  "#f48fb1",
          600:  "#f06292",
          500:  "#ec407a",
          400:  "#e91e63",
          300:  "#d81b60",
          200:  "#c2185b",
          100:  "#ad1457",
          50:  "#880e4f",
        },
        red: {
          900:  "#ffebee",
          800:  "#ef9a9a",
          700:  "#e57373",
          600:  "#ef5350",
          500:  "#f44336",
          400:  "#e53935",
          300:  "#d32f2f",
          200:  "#c62828",
          100:  "#b71c1c",
          50:  "#8c1515",
          30:  "#730f0f",
          c10:  "#871212",
          c7:  "#AE1E1E",
        },
        secondary: {
          600:  "#747b8a",
          500:  "#7b809a",
          400:  "#495361",
          300:  "#3a416f",
        },
        light: {
          700:  "#f8f9fa",
          600:  "#ebeff4",
          500:  "#f0f2f5",
          400:  "#ced4da",
        },
        dark: {
          600:  "#42424a",
          500:  "#344767",
          400:  "#191919",
        },
      }
    },
  },
  plugins: [],
});

