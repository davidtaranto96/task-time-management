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
        // Claude Code dark theme tokens
        "ae-bg": "#0d1117",
        "ae-surface": "#161b22",
        "ae-surface-2": "#1e2430",
        "ae-border": "#30363d",
        "ae-primordial": "#f59e0b", // amber - high signal/primordial
        "ae-secondary": "#6b7280", // gray - noise/secondary
        "ae-info": "#3b82f6",      // blue - informational
        "ae-success": "#34d399",   // emerald - success/done (Claude Code)
        "ae-danger": "#f87171",    // red - delete/danger (Claude Code)
        "ae-accent": "#c9a0ff",    // violet Claude - accent primary
        "ae-link": "#7dd3fc",      // cyan - links/secondary actions
        "ae-text": "#e6edf3",
        "ae-text-muted": "#8b949e",
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
