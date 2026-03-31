'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

/**
 * Wrap the editor in Suspense for useSearchParams() compatibility.
 * Next.js requires Suspense around components that call useSearchParams()
 * to avoid static generation errors.
 */
const EditorPage = dynamic(() => import('./editor-client'), { ssr: false });

export default function EditorRoute() {
  return (
    <Suspense
      fallback={
        <div style={centeredStyle}>
          <p style={textStyle}>Loading editor...</p>
        </div>
      }
    >
      <EditorPage />
    </Suspense>
  );
}

const centeredStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
};

const textStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#666',
  fontFamily: 'system-ui, sans-serif',
};
