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
        "off-white": "#F2F0EF",
        periwinkle: "#888DDD",
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'clay-card': '8px 8px 16px 0 rgba(0, 0, 0, 0.1), -8px -8px 16px 0 rgba(255, 255, 255, 0.8), inset 6px 6px 10px 0 rgba(0, 0, 0, 0.02), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.6)',
        'clay-btn': '6px 6px 12px 0 rgba(136, 141, 221, 0.4), -6px -6px 12px 0 rgba(255, 255, 255, 0.8), inset 4px 4px 8px 0 rgba(0, 0, 0, 0.05), inset -4px -4px 8px 0 rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
