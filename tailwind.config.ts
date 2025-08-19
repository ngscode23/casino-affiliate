// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // чтобы точно покрыть все файлы
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e", // акцент (emerald-ish)
          600: "#16a34a",
          700: "#15803d",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.05), 0 1px 3px rgba(16,24,40,0.1)",
      },
      borderRadius: {
        xl: "0.8rem",
        "2xl": "1.2rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"], // чтобы подтягивался inter
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // полезно для форм
    require("@tailwindcss/typography"), // удобный prose
  ],
} satisfies Config;