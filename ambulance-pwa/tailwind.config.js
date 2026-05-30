/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E24B4A",
        amber: { header: "#D97706", light: "#F59E0B" },
        dark: "#1a1a1a",
        surface: "#242424",
        "surface-light": "#2e2e2e",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        heading: ["Syne", "system-ui", "sans-serif"],
      },
      maxWidth: { app: "390px" },
      minHeight: { touch: "44px" },
      fontSize: {
        body: ["15px", { lineHeight: "1.4" }],
        label: ["13px", { lineHeight: "1.3" }],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        pulseAlert: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245,158,11,0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(245,158,11,0)" },
        },
      },
      animation: {
        blink: "blink 1.2s ease-in-out infinite",
        "slide-up": "slide-up 0.35s ease-out",
        "pulse-alert": "pulseAlert 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
