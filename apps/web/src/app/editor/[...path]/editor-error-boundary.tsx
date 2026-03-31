'use client';

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

/**
 * Error boundary for the Puck visual editor.
 * Catches rendering errors and shows a friendly recovery UI
 * instead of a white screen.
 */
export class EditorErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[EditorErrorBoundary] Caught rendering error:', error);
    console.error('[EditorErrorBoundary] Component stack:', info.componentStack);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          fontFamily: 'system-ui, sans-serif',
          background: '#fafafa',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            padding: '40px',
            textAlign: 'center',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#dc2626',
            }}
          >
            !
          </div>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 8px',
            }}
          >
            Editor Error
          </p>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 20px',
              lineHeight: 1.5,
            }}
          >
            Something went wrong while rendering the editor. This is usually a
            temporary issue.
          </p>
          {this.state.error && (
            <p
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0 0 20px',
                padding: '8px 12px',
                background: '#f9fafb',
                borderRadius: '6px',
                fontFamily: 'monospace',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Reload Editor
          </button>
        </div>
      </div>
    );
  }
}
