import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium dark theme tokens
        "ae-bg": "#0a0a0b",
        "ae-surface": "#111113",
        "ae-surface-2": "#1a1a1f",
        "ae-border": "#2a2a35",
        "ae-signal": "#f59e0b",    // amber - high signal/primordial
        "ae-noise": "#6b7280",     // gray - noise/secondary
        "ae-success": "#10b981",   // emerald - success/done
        "ae-danger": "#ef4444",    // red - delete/danger
        "ae-accent": "#8b5cf6",    // violet - accent/CEO mode
        "ae-text": "#f4f4f5",
        "ae-text-muted": "#71717a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
