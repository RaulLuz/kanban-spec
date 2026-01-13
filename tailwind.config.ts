import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Design tokens from Figma
        "main-purple": "#635FC7",
        "main-purple-hover": "#A8A4FF",
        "red": "#EA5555",
        "red-hover": "#FF9898",
        "black": "#000112",
        "very-dark-grey": "#20212C",
        "dark-grey": "#2B2C37",
        "lines-dark": "#3E3F4E",
        "medium-grey": "#828FA3",
        "lines-light": "#E4EBFA",
        "light-grey": "#F4F7FD",
        "white": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "heading-xl": ["24px", { lineHeight: "100%", fontWeight: "700" }],
        "heading-l": ["18px", { lineHeight: "100%", fontWeight: "700" }],
        "heading-m": ["15px", { lineHeight: "100%", fontWeight: "700" }],
        "heading-s": ["12px", { lineHeight: "100%", fontWeight: "700", letterSpacing: "2.4px" }],
        "body-l": ["13px", { lineHeight: "177%", fontWeight: "500" }],
        "body-m": ["12px", { lineHeight: "100%", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};

export default config;
