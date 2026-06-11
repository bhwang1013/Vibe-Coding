import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#070708",
        charcoal: "#0e0e11",
        graphite: "#17171c",
        slate2: "#1f1f26",
        gold: {
          300: "#f0d68a",
          400: "#e8c46b",
          500: "#d4af37",
          600: "#b8962e",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.45)",
        glow: "0 0 40px rgba(16, 185, 129, 0.12)",
        "glow-gold": "0 0 40px rgba(212, 175, 55, 0.12)",
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite alternate",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translate(-8%, -6%) scale(1)" },
          "50%": { transform: "translate(6%, 4%) scale(1.15)" },
          "100%": { transform: "translate(-4%, 8%) scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
