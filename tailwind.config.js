/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#268976",
      },
    },
  },
  plugins: [],
};
