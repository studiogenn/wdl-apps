import type { Config } from "tailwindcss";
import { colors, semantic } from "@wdl/tokens/colors";
import { fontFamily, fontSize, letterSpacing } from "@wdl/tokens/typography";
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
      fontFamily,
      fontSize,
      letterSpacing,
      borderRadius,
      boxShadow: shadows,
    },
  },
};

export default config;
