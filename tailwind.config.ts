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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "off-white": "#e5e5e5",
        "charcoal": "#0a0a0a",
        "card-bg": "#1a1a1a",
        "periwinkle": "#a8aef5",
        "slate-light": "#a0a0a0",
        "slate-lighter": "#c8c8c8",
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'clay-card': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'clay-btn': '0 8px 24px rgba(168, 174, 245, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'clay-hover': '0 16px 40px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};
export default config;