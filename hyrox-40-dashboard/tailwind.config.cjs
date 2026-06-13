/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#06080d",
        panel: "#0d121b",
        steel: "#9da8b8",
        ember: "#ff5a3d",
        volt: "#b8ff4d",
        aqua: "#2ee6d6",
        cobalt: "#477cff",
      },
      boxShadow: {
        glow: "0 0 80px rgba(46, 230, 214, 0.16)",
        ember: "0 0 70px rgba(255, 90, 61, 0.18)",
      },
    },
  },
  plugins: [],
};
