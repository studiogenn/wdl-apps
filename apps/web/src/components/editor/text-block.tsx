'use client';

const FONT_SIZE_MAP: Record<string, string> = {
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
};

const LINE_HEIGHT_MAP: Record<string, string> = {
  sm: '1.5',
  base: '1.6',
  lg: '1.6',
  xl: '1.5',
  '2xl': '1.4',
};

const FONT_WEIGHT_MAP: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export interface TextBlockProps {
  content: string;
  fontSize: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

export function TextBlock({
  content,
  fontSize,
  fontWeight,
  textAlign,
  color,
}: TextBlockProps) {
  return (
    <div
      style={{
        fontSize: FONT_SIZE_MAP[fontSize] ?? FONT_SIZE_MAP.base,
        lineHeight: LINE_HEIGHT_MAP[fontSize] ?? LINE_HEIGHT_MAP.base,
        fontWeight: FONT_WEIGHT_MAP[fontWeight] ?? FONT_WEIGHT_MAP.normal,
        textAlign: textAlign ?? 'left',
        color: color || '#050B39',
        whiteSpace: 'pre-wrap',
      }}
    >
      {content}
    </div>
  );
}
