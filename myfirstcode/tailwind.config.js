/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#12132B", soft: "#1B1D3D", line: "#2A2C55" },
        cloud: "#F5F6FB",
        card: "#FFFFFF",
        brand: { DEFAULT: "#5B5FEF", dark: "#4547C9", light: "#EDEEFF" },
        mint: { DEFAULT: "#12D992", dark: "#0EB87B", light: "#E4FBF2" },
        amber: { DEFAULT: "#FFB627", dark: "#E39F14", light: "#FFF4DF" },
        coral: { DEFAULT: "#FF5C7A", dark: "#E2415F", light: "#FFE9ED" },
        slate: { DEFAULT: "#4B4D68", muted: "#8B8DAE", faint: "#C7C9DE" },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(18,19,43,0.08)",
        card: "0 4px 24px -6px rgba(18,19,43,0.10)",
        pop: "0 8px 30px -8px rgba(91,95,239,0.35)",
      },
    },
  },
  plugins: [],
};
