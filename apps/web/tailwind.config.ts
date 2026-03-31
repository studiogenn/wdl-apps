import type { Config } from "tailwindcss";
import { colors, semantic } from "@wdl/tokens/colors";
import { fontSize, letterSpacing } from "@wdl/tokens/typography";
import { borderRadius, shadows } from "@wdl/tokens/spacing";

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: { ...colors, ...semantic },
      fontFamily: {
        heading: ["var(--font-zilla-slab)", "serif"],
        "heading-medium": ["var(--font-zilla-slab)", "serif"],
        "heading-bold": ["var(--font-zilla-slab)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        "body-light": ["var(--font-dm-sans)", "sans-serif"],
        "body-medium": ["var(--font-dm-sans)", "sans-serif"],
        "body-bold": ["var(--font-dm-sans)", "sans-serif"],
      },
      fontSize,
      letterSpacing,
      borderRadius,
      boxShadow: shadows,
    },
  },
};

export default config;
