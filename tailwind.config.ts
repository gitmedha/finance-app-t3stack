import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx",
    "./node_modules/@radix-ui/themes/**/*.{js,ts,jsx,tsx}", // Add Radix themes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: process.env.THEME_PRIMARY_COLOR || "#3490dc", // Default blue color
        secondary: process.env.THEME_SECONDARY_COLOR || "#ffed4a", // Default yellow color
      },
    },
  },
  plugins: [],
} satisfies Config;
