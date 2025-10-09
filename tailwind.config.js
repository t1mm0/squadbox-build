/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        slatebg: "#111315",
        slatecard: "#1a1d21",
        brand: {
          50: "#e9f7ff",
          100: "#cfeeff",
          200: "#9ddcff",
          300: "#68c6ff",
          400: "#3dafff",
          500: "#0b98ff",
          600: "#0077d1",
          700: "#005aa0",
          800: "#074274",
          900: "#0b2f54"
        }
      },
      boxShadow: {
        soft: "0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)"
      },
      borderRadius: {
        "2xl": "1rem"
      }
    }
  },
  plugins: []
}
