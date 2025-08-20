// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",                // ручной контроль тёмной темы
  theme: {
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

    extend: {
      fontFamily: {
        // чтобы Inter подтянулся по классу font-sans
        sans: ['InterVariable', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1280px" }
      }
    }
  },
  
  plugins: []
};