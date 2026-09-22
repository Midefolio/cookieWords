import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: "var(--bg-color)",
        surfaceElevated: "var(--surface-elevated)",
        textPrimary: "var(--text-primary)",
        textMuted: "var(--text-muted)",
        cookieBrown: "var(--cookie-brown)",
        cookieGold: "var(--cookie-gold)",
        cookieCream: "var(--cookie-cream)",
        correctGreen: "var(--correct-green)",
        presentYellow: "var(--present-yellow)",
        incorrectGray: "var(--incorrect-gray)",
        cardCreamTop: "var(--card-cream-top)",
        cardCreamBot: "var(--card-cream-bot)",
        keyDefault: "var(--key-default)",
        keyDefaultDark: "var(--key-default-dark)",
        textDark: "var(--text-dark)",
        toonInk: "var(--toon-ink)",
        woodPanel: "var(--wood-panel)",
        woodPanelDark: "var(--wood-panel-dark)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Sora", "sans-serif"],
        body: ["var(--font-body)", "Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

