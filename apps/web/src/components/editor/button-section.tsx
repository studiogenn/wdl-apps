'use client';

const SIZE_STYLES: Record<string, { paddingX: string; paddingY: string; fontSize: string }> = {
  sm: { paddingX: '16px', paddingY: '8px', fontSize: '14px' },
  md: { paddingX: '28px', paddingY: '12px', fontSize: '15px' },
  lg: { paddingX: '36px', paddingY: '16px', fontSize: '16px' },
};

const PRIMARY_COLOR = '#1227BE';
const PRIMARY_HOVER = '#0e1f9a';

function getVariantStyles(variant: string): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: PRIMARY_COLOR,
        color: '#ffffff',
        border: 'none',
      };
    case 'secondary':
      return {
        backgroundColor: '#E7E9F8',
        color: PRIMARY_COLOR,
        border: 'none',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: PRIMARY_COLOR,
        border: `2px solid ${PRIMARY_COLOR}`,
      };
    default:
      return {
        backgroundColor: PRIMARY_COLOR,
        color: '#ffffff',
        border: 'none',
      };
  }
}

const ALIGN_MAP: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export interface ButtonSectionProps {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  align: 'left' | 'center' | 'right';
  fullWidth: boolean;
}

export function ButtonSection({
  text,
  href,
  variant,
  size,
  align,
  fullWidth,
}: ButtonSectionProps) {
  const sizeStyles = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const variantStyles = getVariantStyles(variant);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: ALIGN_MAP[align] ?? 'flex-start',
        width: '100%',
      }}
    >
      <a
        href={href || '#'}
        style={{
          ...variantStyles,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: sizeStyles.paddingX,
          paddingRight: sizeStyles.paddingX,
          paddingTop: sizeStyles.paddingY,
          paddingBottom: sizeStyles.paddingY,
          fontSize: sizeStyles.fontSize,
          fontWeight: 600,
          borderRadius: '9999px',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.15s',
          width: fullWidth ? '100%' : 'auto',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
        onMouseEnter={(e) => {
          if (variant === 'primary') {
            (e.currentTarget as HTMLElement).style.backgroundColor = PRIMARY_HOVER;
          } else {
            (e.currentTarget as HTMLElement).style.opacity = '0.85';
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'primary') {
            (e.currentTarget as HTMLElement).style.backgroundColor = PRIMARY_COLOR;
          } else {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }
        }}
      >
        {text || 'Button'}
      </a>
    </div>
  );
}

