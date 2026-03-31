/**
 * Standalone image/banner section for the Puck visual editor.
 *
 * Uses a plain <img> tag (not next/image) because the src is dynamic
 * and comes from the CMS media library -- next/image requires known
 * domains at build time or explicit remotePatterns configuration.
 */

export interface ImageSectionProps {
  src?: string;
  alt?: string;
  aspectRatio?: 'auto' | '16:9' | '4:3' | '21:9';
  maxWidth?: 'full' | 'container' | 'narrow';
  caption?: string;
}

const ASPECT_RATIO_MAP: Record<string, string | undefined> = {
  auto: undefined,
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '21:9': '21 / 9',
};

const MAX_WIDTH_MAP: Record<string, string> = {
  full: '100%',
  container: '1200px',
  narrow: '800px',
};

export function ImageSection({
  src = '',
  alt = '',
  aspectRatio = 'auto',
  maxWidth = 'container',
  caption,
}: ImageSectionProps) {
  if (!src) {
    return (
      <section style={placeholderStyles}>
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          No image selected. Use the sidebar to choose an image.
        </p>
      </section>
    );
  }

  const resolvedAspectRatio = ASPECT_RATIO_MAP[aspectRatio];
  const resolvedMaxWidth = MAX_WIDTH_MAP[maxWidth] ?? MAX_WIDTH_MAP.container;

  return (
    <section style={{ width: '100%' }}>
      <figure
        style={{
          margin: '0 auto',
          maxWidth: resolvedMaxWidth,
          padding: maxWidth === 'full' ? 0 : '0 16px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: maxWidth === 'full' ? 0 : '8px',
            objectFit: 'cover',
            ...(resolvedAspectRatio ? { aspectRatio: resolvedAspectRatio } : {}),
          }}
        />
        {caption && (
          <figcaption
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '8px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}

const placeholderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '120px',
  background: '#f9fafb',
  border: '2px dashed #e5e7eb',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '1200px',
};
