'use client';

import type { ReactNode } from 'react';

const MAX_WIDTH_MAP: Record<string, string> = {
  full: '100%',
  wide: '1280px',
  default: '1024px',
  narrow: '768px',
};

const PADDING_Y_MAP: Record<string, string> = {
  none: '0',
  sm: '16px',
  md: '32px',
  lg: '48px',
  xl: '64px',
};

const PADDING_X_MAP: Record<string, string> = {
  none: '0',
  sm: '16px',
  md: '32px',
  lg: '48px',
};

export interface ContainerSectionProps {
  maxWidth: 'full' | 'wide' | 'default' | 'narrow';
  paddingY: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  paddingX: 'none' | 'sm' | 'md' | 'lg';
  backgroundColor: string;
  children?: ReactNode;
}

export function ContainerSection({
  maxWidth,
  paddingY,
  paddingX,
  backgroundColor,
  children,
}: ContainerSectionProps) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: backgroundColor || undefined,
      }}
    >
      <div
        style={{
          maxWidth: MAX_WIDTH_MAP[maxWidth] ?? MAX_WIDTH_MAP.default,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingTop: PADDING_Y_MAP[paddingY] ?? PADDING_Y_MAP.md,
          paddingBottom: PADDING_Y_MAP[paddingY] ?? PADDING_Y_MAP.md,
          paddingLeft: PADDING_X_MAP[paddingX] ?? PADDING_X_MAP.md,
          paddingRight: PADDING_X_MAP[paddingX] ?? PADDING_X_MAP.md,
        }}
      >
        {children}
      </div>
    </div>
  );
}
