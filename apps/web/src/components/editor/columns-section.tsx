'use client';

import type { ReactNode } from 'react';

const GAP_MAP: Record<string, string> = {
  sm: '16px',
  md: '24px',
  lg: '32px',
};

const VERTICAL_ALIGN_MAP: Record<string, string> = {
  top: 'start',
  center: 'center',
  bottom: 'end',
};

export interface ColumnsSectionProps {
  columns: 2 | 3 | 4;
  gap: 'sm' | 'md' | 'lg';
  verticalAlign: 'top' | 'center' | 'bottom';
  stackOnMobile: boolean;
  children?: ReactNode;
}

export function ColumnsSection({
  columns,
  gap,
  verticalAlign,
  stackOnMobile,
  children,
}: ColumnsSectionProps) {
  const gapValue = GAP_MAP[gap] ?? GAP_MAP.md;
  const alignValue = VERTICAL_ALIGN_MAP[verticalAlign] ?? VERTICAL_ALIGN_MAP.top;

  /**
   * For stackOnMobile we inject a <style> tag with a scoped class rather than
   * relying on Tailwind, since these components render inside Puck's iframe
   * which may not have the site's Tailwind build.
   */
  const scopeId = `cols-${columns}`;

  return (
    <>
      {stackOnMobile && (
        <style>{`
          @media (max-width: 767px) {
            .${scopeId}-stack {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      )}
      <div
        className={stackOnMobile ? `${scopeId}-stack` : undefined}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gapValue,
          alignItems: alignValue,
          width: '100%',
        }}
      >
        {children}
      </div>
    </>
  );
}
