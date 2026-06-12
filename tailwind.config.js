/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        night: "#08060b",
        wine: "#4b1422",
        rose: "#ff8fb3",
        blush: "#ffd6df",
        gold: "#f6d98f",
      },
      boxShadow: {
        glow: "0 0 80px rgba(255, 143, 179, 0.22)",
        gold: "0 0 70px rgba(246, 217, 143, 0.18)",
      },
    },
  },
  plugins: [],
};
