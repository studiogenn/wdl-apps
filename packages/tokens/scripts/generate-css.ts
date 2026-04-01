import { writeFileSync, mkdirSync } from "fs";
import { colors, semantic } from "../src/colors";
import { fontFamily, fontSize, letterSpacing } from "../src/typography";
import { spacing, borderRadius, shadows } from "../src/spacing";

function flattenColors(
  obj: Record<string, string | Record<string, string>>,
  prefix: string
): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      lines.push(`  --color-${prefix}${key}: ${value};`);
    } else {
      for (const [shade, hex] of Object.entries(value)) {
        lines.push(`  --color-${key}-${shade}: ${hex};`);
      }
    }
  }
  return lines;
}

const colorLines = [
  "  /* Brand colors */",
  ...flattenColors(colors, ""),
  "",
  "  /* Semantic colors */",
  ...flattenColors(semantic, ""),
];

const spacingLines = Object.entries(spacing).map(
  ([key, value]) => `  --space-${key}: ${value};`
);

const radiusLines = Object.entries(borderRadius).map(
  ([key, value]) => `  --radius-${key}: ${value};`
);

const shadowLines = Object.entries(shadows).map(
  ([key, value]) => `  --shadow-${key}: ${value};`
);

const fontSizeLines: string[] = [];
for (const [key, entry] of Object.entries(fontSize)) {
  const [size, opts] = entry as unknown as [string, Record<string, string>];
  fontSizeLines.push(`  --font-size-${key}: ${size};`);
  if (opts.lineHeight) fontSizeLines.push(`  --line-height-${key}: ${opts.lineHeight};`);
  if (opts.letterSpacing) fontSizeLines.push(`  --letter-spacing-${key}: ${opts.letterSpacing};`);
}

const trackingLines = Object.entries(letterSpacing).map(
  ([key, value]) => `  --tracking-${key}: ${value};`
);

const fontFamilyLines = Object.entries(fontFamily).map(
  ([key, fonts]) => `  --font-${key}: ${(fonts as readonly string[]).join(", ")};`
);

const css = `/* Auto-generated from @wdl/tokens — do not edit manually */
/* Run: pnpm --filter @wdl/tokens generate-css */

@theme {
${colorLines.join("\n")}

  /* Spacing */
${spacingLines.join("\n")}

  /* Border radius */
${radiusLines.join("\n")}

  /* Shadows */
${shadowLines.join("\n")}

  /* Font sizes */
${fontSizeLines.join("\n")}

  /* Letter spacing */
${trackingLines.join("\n")}

  /* Font families */
${fontFamilyLines.join("\n")}
}
`;

mkdirSync("dist", { recursive: true });
writeFileSync("dist/theme.css", css);
console.log("Generated dist/theme.css");
