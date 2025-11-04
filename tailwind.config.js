/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#11B687",
        secondary: "#C69879",
        background: "#EFEFEF",
        itemsBackground: "#FFFFFF",
        text1: "#1D1D1B",
        textPrimary: "#1D1D1B",
        textSpecial: "#FFCC00",
        textSecondary: "#888888",
      },
    },
  },
};
