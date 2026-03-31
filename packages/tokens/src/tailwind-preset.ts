import { colors, semantic } from "./colors";
import { fontFamily, fontSize, letterSpacing } from "./typography";
import { borderRadius, shadows } from "./spacing";

export const wdlPreset = {
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
