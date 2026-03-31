'use client';

const HEIGHT_MAP: Record<string, number> = {
  xs: 16,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
};

export interface SpacerSectionProps {
  height: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function SpacerSection({ height }: SpacerSectionProps) {
  const px = HEIGHT_MAP[height] ?? HEIGHT_MAP.md;

  return (
    <div
      style={{
        height: `${px}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Visual indicator for edit mode -- dashed border + height label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px dashed #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: '12px',
          fontFamily: 'system-ui, sans-serif',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {px}px
      </div>
    </div>
  );
}
