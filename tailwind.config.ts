import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        oracle: {
          bg: "#07080a",
          panel: "#0e1013",
          panelAlt: "#121519",
          border: "#23262b",
          borderActive: "#7a2b2b",
          red: "#b2302f",
          redBright: "#e4453f",
          amber: "#c98a3a",
          text: "#e7e4df",
          textDim: "#8c9196",
          textFaint: "#5a5f65",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "1" },
          "46%": { opacity: "0.4" },
          "47%": { opacity: "1" },
          "48%": { opacity: "0.6" },
          "49%": { opacity: "1" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-1px,1px)" },
          "40%": { transform: "translate(1px,-1px)" },
          "60%": { transform: "translate(-1px,-1px)" },
          "80%": { transform: "translate(1px,1px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        flicker: "flicker 6s infinite",
        blink: "blink 1s steps(1) infinite",
        scan: "scan 6s linear infinite",
        glitch: "glitch 0.2s linear",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
