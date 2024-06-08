import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js"
  ],
  theme: {
    extend: {
      colors: {
        blue: "#2775EC",
        "light-blue": "#F0F6FF"
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#F15858",
          secondary: "#F0F6FF",
          "secondary-content": "#2775EC",
          "base-300": "#F7F8FB",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dracula"],
          primary: "#F15858",
          secondary: "#F0F6FF",
          "secondary-content": "#2775EC",
        },
      }
    ]
  }
};
export default config;
