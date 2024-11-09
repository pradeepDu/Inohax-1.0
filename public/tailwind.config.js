/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        robotoslab: ["Roboto Slab", "serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
