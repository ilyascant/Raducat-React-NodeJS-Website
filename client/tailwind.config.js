/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    patterns: {
      opacities: {
        100: "1",
        80: ".80",
        60: ".60",
        40: ".40",
        20: ".20",
        10: ".10",
        5: ".05",
      },
      sizes: {
        1: "0.25rem",
        2: "0.5rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      },
    },
    extend: {
      spacing: {
        container: "1150px",
        contentWidth: "66.667%",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        xs: "384px",
        xxs: "472px",
        xxxs: "300px",
      },
      colors: {
        logo: "#FF0000",
        dark: "#0F0F0F",
        darkblue: "#1A1C20",
        dark_input: "#161719",
        light: "#F3F4F6",
        light_input: "rgba(209, 213, 219,  0.4)",
        light_overlay: "rgba(209, 213, 219,  0.3)",
        customgray: "#3F3F3F",
        customslate_dark: "#1E2124",
        customslate_light: "rgb(226, 232, 240)",
      },
      maxWidth: {
        container: "1150px",
      },
    },
  },
  plugins: [require("tailwindcss-bg-patterns"), require("@tailwindcss/typography")],
};
