import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "atlas-bg": "#1c1914",
        "atlas-bg-card": "#231f18",
        "atlas-bg-hover": "#2a251d",
        "atlas-text": "#ede5d5",
        "atlas-text-muted": "#a09070",
        "atlas-gold": "#c9a96e",
        "atlas-gold-light": "#e8c994",
        "atlas-gold-dark": "#9a7840",
        "atlas-border": "#3a3228",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
      },
      typography: {
        atlas: {
          css: {
            "--tw-prose-body": "#ede5d5",
            "--tw-prose-headings": "#e8c994",
            "--tw-prose-links": "#c9a96e",
            "--tw-prose-bold": "#ede5d5",
            "--tw-prose-counters": "#a09070",
            "--tw-prose-bullets": "#c9a96e",
            "--tw-prose-hr": "#3a3228",
            "--tw-prose-quotes": "#ede5d5",
            "--tw-prose-quote-borders": "#c9a96e",
            "--tw-prose-code": "#e8c994",
            "--tw-prose-pre-bg": "#231f18",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
