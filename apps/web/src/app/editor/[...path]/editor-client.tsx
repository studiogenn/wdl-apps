'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import type { Data } from '@measured/puck';
import { Puck, usePuck } from '@measured/puck';
import '@measured/puck/puck.css';

import { puckConfig } from '@/lib/puck-config';
import { sectionsToPuckData } from '@/lib/puck-field-helpers';
import {
  verifyEditorToken,
  loadEditorState,
  saveEditorState,
  saveDraft,
  fetchVersionHistory,
  revertToVersion,
} from '@/lib/editor-api';
import type { VersionItem } from '@/lib/editor-api';
import { EditorErrorBoundary } from './editor-error-boundary';
import { setEditorToken } from '@/lib/editor-token';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EditorPhase =
  | { status: 'verifying' }
  | { status: 'loading' }
  | { status: 'ready'; data: Data }
  | { status: 'error'; message: string };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_BEHEMOUTH_API_URL ?? '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

const EMPTY_DATA: Data = { content: [], root: { props: {} } };

const BANNER_AUTO_DISMISS_MS = 3000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatVersionDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Version history dropdown
// ---------------------------------------------------------------------------

function VersionHistoryDropdown({
  metadataId,
  token,
  onBanner,
  onRevert,
}: {
  metadataId: number;
  token: string;
  onBanner: (banner: { type: 'success' | 'error'; message: string }) => void;
  onRevert: (data: Record<string, unknown>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [reverting, setReverting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleOpen = useCallback(async () => {
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);
    setLoading(true);
    try {
      const result = await fetchVersionHistory(metadataId, token);
      setVersions(result.versions);
    } catch (err) {
      onBanner({
        type: 'error',
        message: `Failed to load history: ${err instanceof Error ? err.message : String(err)}`,
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [open, metadataId, token, onBanner]);

  const handleRevert = useCallback(async (index: number, timestamp: string) => {
    const label = formatVersionDate(timestamp);
    const confirmed = window.confirm(
      `Revert to version from ${label}? This will replace your current editor state.`,
    );
    if (!confirmed) return;

    setReverting(true);
    try {
      const result = await revertToVersion(metadataId, token, index);
      setOpen(false);
      onRevert(result.editor_state);
      onBanner({ type: 'success', message: `Reverted to version from ${label}` });
    } catch (err) {
      onBanner({
        type: 'error',
        message: `Revert failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setReverting(false);
    }
  }, [metadataId, token, onRevert, onBanner]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={handleOpen}
        disabled={reverting}
        style={{
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 500,
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          background: 'transparent',
          color: '#374151',
          cursor: reverting ? 'not-allowed' : 'pointer',
          opacity: reverting ? 0.6 : 1,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        History
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            width: '320px',
            maxHeight: '360px',
            overflowY: 'auto',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 1000,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #f3f4f6',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}
          >
            Version History
          </div>

          {loading && (
            <div style={{ padding: '20px 14px', fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
              Loading...
            </div>
          )}

          {!loading && versions.length === 0 && (
            <div style={{ padding: '20px 14px', fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
              No history yet
            </div>
          )}

          {!loading && versions.length > 0 && (
            <div style={{ padding: '4px 0' }}>
              {/* Show newest first */}
              {[...versions].reverse().map((version, reversedIdx) => {
                const originalIndex = versions.length - 1 - reversedIdx;
                return (
                  <button
                    key={`${version.timestamp}-${originalIndex}`}
                    onClick={() => handleRevert(originalIndex, version.timestamp)}
                    disabled={reverting}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: reverting ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      color: '#374151',
                      fontFamily: 'system-ui, sans-serif',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>
                      {formatVersionDate(version.timestamp)}
                    </div>
                    {version.saved_by && (
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        by {version.saved_by}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor header with branding, Save Draft + Preview buttons
// ---------------------------------------------------------------------------

function EditorHeader({
  actions,
  children,
  metadataId,
  token,
  pagePath,
  onBanner,
  onSaved,
  onRevert,
}: {
  actions: React.ReactNode;
  children: React.ReactNode;
  metadataId: number;
  token: string;
  pagePath: string;
  onBanner: (banner: { type: 'success' | 'error'; message: string }) => void;
  onSaved: () => void;
  onRevert: (data: Record<string, unknown>) => void;
}) {
  const { appState } = usePuck();
  const [saving, setSaving] = useState(false);

  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    try {
      await saveDraft(metadataId, token, {
        editor_state: appState.data as unknown as Record<string, unknown>,
      });
      onBanner({ type: 'success', message: 'Draft saved.' });
      onSaved();
    } catch (err) {
      onBanner({
        type: 'error',
        message: `Draft save failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setSaving(false);
    }
  }, [appState.data, metadataId, token, onBanner, onSaved]);

  const handlePreview = useCallback(async () => {
    setSaving(true);
    try {
      await saveDraft(metadataId, token, {
        editor_state: appState.data as unknown as Record<string, unknown>,
      });
      onSaved();
      const previewUrl = `${SITE_URL}/api/draft?token=${encodeURIComponent(token)}&path=${encodeURIComponent(pagePath)}`;
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      onBanner({
        type: 'error',
        message: `Preview failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setSaving(false);
    }
  }, [appState.data, metadataId, token, pagePath, onBanner, onSaved]);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        gap: '8px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {/* Brand mark */}
      <span
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#111827',
          letterSpacing: '-0.02em',
          marginRight: '4px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        WDL Editor
      </span>

      {/* Separator */}
      <span
        style={{
          width: '1px',
          height: '20px',
          background: '#d1d5db',
          flexShrink: 0,
        }}
      />

      {/* Page path */}
      <span
        style={{
          fontSize: '13px',
          color: '#6b7280',
          fontFamily: 'monospace',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {pagePath}
      </span>

      {children}

      {/* Version history dropdown */}
      <VersionHistoryDropdown
        metadataId={metadataId}
        token={token}
        onBanner={onBanner}
        onRevert={onRevert}
      />

      {/* Save Draft -- ghost style */}
      <button
        onClick={handleSaveDraft}
        disabled={saving}
        style={{
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 500,
          borderRadius: '6px',
          border: '1px solid transparent',
          background: 'transparent',
          color: '#374151',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.6 : 1,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {saving ? 'Saving...' : 'Save Draft'}
      </button>

      {/* Preview -- outline style */}
      <button
        onClick={handlePreview}
        disabled={saving}
        style={{
          padding: '6px 14px',
          fontSize: '13px',
          fontWeight: 500,
          borderRadius: '6px',
          border: '1px solid #3b82f6',
          background: 'transparent',
          color: '#3b82f6',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.6 : 1,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Preview
      </button>

      {/* Publish -- Puck's built-in action button (primary/solid style applied by Puck) */}
      {actions}
    </header>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EditorClient() {
  const params = useParams<{ path?: string[] }>();
  const searchParams = useSearchParams();

  const pagePath = params.path ? `/${params.path.join('/')}` : '/';
  const token = searchParams.get('token');

  const tokenRef = useRef(token);
  const metadataIdRef = useRef<number | null>(null);
  const dataRef = useRef<Data>(EMPTY_DATA);

  const [phase, setPhase] = useState<EditorPhase>({ status: 'verifying' });
  const [banner, setBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [puckKey, setPuckKey] = useState(0);

  // -------------------------------------------------------------------------
  // Set document title
  // -------------------------------------------------------------------------

  useEffect(() => {
    document.title = `Editor - ${pagePath} | WDL`;
  }, [pagePath]);

  // -------------------------------------------------------------------------
  // Auto-dismiss success banners
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (banner === null || banner.type !== 'success') return;

    const timer = setTimeout(() => {
      setBanner(null);
    }, BANNER_AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [banner]);

  // -------------------------------------------------------------------------
  // Callback for successful saves (updates lastSaved timestamp)
  // -------------------------------------------------------------------------

  const handleSaved = useCallback(() => {
    setLastSaved(formatTimestamp(new Date()));
  }, []);

  // -------------------------------------------------------------------------
  // Revert handler (replaces editor data and forces Puck remount)
  // -------------------------------------------------------------------------

  const handleRevert = useCallback((restoredState: Record<string, unknown>) => {
    const data = restoredState as unknown as Data;
    dataRef.current = data;
    setPhase({ status: 'ready', data });
    setPuckKey((prev) => prev + 1);
  }, []);

  // -------------------------------------------------------------------------
  // Auth + data loading
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional early-exit for missing token on mount
      setPhase({
        status: 'error',
        message:
          'Editor access requires a valid token. Open this page from the dashboard.',
      });
      return;
    }

    tokenRef.current = token;
    let cancelled = false;

    async function init() {
      // 1. Verify token
      try {
        const verification = await verifyEditorToken(token!);
        if (cancelled) return;

        if (!verification.valid || verification.metadata_id === null) {
          setPhase({ status: 'error', message: 'Invalid or expired editor token.' });
          return;
        }

        metadataIdRef.current = verification.metadata_id;
        setEditorToken(token!);
      } catch (err) {
        if (cancelled) return;
        setPhase({
          status: 'error',
          message: `Token verification failed: ${err instanceof Error ? err.message : String(err)}`,
        });
        return;
      }

      // 2. Load editor state
      setPhase({ status: 'loading' });

      try {
        const metadataId = metadataIdRef.current!;
        const editorResult = await loadEditorState(metadataId, token!);
        if (cancelled) return;

        if (editorResult.editor_state !== null) {
          // Saved state exists -- use it directly (already in Puck Data format)
          const data = editorResult.editor_state as unknown as Data;
          dataRef.current = data;
          setPhase({ status: 'ready', data });
          return;
        }

        // No saved state -- try loading sections from public API
        const initialData = await fetchInitialSections(pagePath);
        if (cancelled) return;
        dataRef.current = initialData;
        setPhase({ status: 'ready', data: initialData });
      } catch (err) {
        if (cancelled) return;
        setPhase({
          status: 'error',
          message: `Failed to load page data: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [token, pagePath]);

  // -------------------------------------------------------------------------
  // Keyboard shortcuts (Cmd+S: save draft, Cmd+Shift+P: preview)
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (phase.status !== 'ready') return;

    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      const metadataId = metadataIdRef.current;
      const currentToken = tokenRef.current;

      if (!currentToken || metadataId === null) return;

      // Cmd+S or Ctrl+S -- save draft
      if (mod && !e.shiftKey && e.key === 's') {
        e.preventDefault();
        saveDraft(metadataId, currentToken, {
          editor_state: dataRef.current as unknown as Record<string, unknown>,
        })
          .then(() => {
            setBanner({ type: 'success', message: 'Draft saved.' });
            setLastSaved(formatTimestamp(new Date()));
          })
          .catch((err) => {
            setBanner({
              type: 'error',
              message: `Draft save failed: ${err instanceof Error ? err.message : String(err)}`,
            });
          });
        return;
      }

      // Cmd+Shift+P or Ctrl+Shift+P -- save draft + open preview
      if (mod && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        saveDraft(metadataId, currentToken, {
          editor_state: dataRef.current as unknown as Record<string, unknown>,
        })
          .then(() => {
            setLastSaved(formatTimestamp(new Date()));
            const previewUrl = `${SITE_URL}/api/draft?token=${encodeURIComponent(currentToken)}&path=${encodeURIComponent(pagePath)}`;
            window.open(previewUrl, '_blank', 'noopener,noreferrer');
          })
          .catch((err) => {
            setBanner({
              type: 'error',
              message: `Preview failed: ${err instanceof Error ? err.message : String(err)}`,
            });
          });
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase.status, pagePath]);

  // -------------------------------------------------------------------------
  // Publish handler
  // -------------------------------------------------------------------------

  const handlePublish = useCallback(async (data: Data) => {
    const currentToken = tokenRef.current;
    const metadataId = metadataIdRef.current;

    if (!currentToken || metadataId === null) {
      setBanner({ type: 'error', message: 'Cannot save: missing authentication.' });
      return;
    }

    try {
      await saveEditorState(metadataId, currentToken, {
        editor_state: data as unknown as Record<string, unknown>,
        publish: true,
      });
      setBanner({ type: 'success', message: 'Page published successfully.' });
      setLastSaved(formatTimestamp(new Date()));
    } catch (err) {
      setBanner({
        type: 'error',
        message: `Publish failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }, []);

  // -------------------------------------------------------------------------
  // Track current Puck data via onChange
  // -------------------------------------------------------------------------

  const handleChange = useCallback((data: Data) => {
    dataRef.current = data;
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (phase.status === 'verifying') {
    return <LoadingScreen message="Verifying editor access..." />;
  }

  if (phase.status === 'loading') {
    return <LoadingScreen message="Loading page data..." />;
  }

  if (phase.status === 'error') {
    return <ErrorMessage message={phase.message} />;
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        animation: 'editorFadeIn 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes editorFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes editorSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {banner && (
        <Banner
          type={banner.type}
          message={banner.message}
          onDismiss={() => setBanner(null)}
        />
      )}
      <EditorErrorBoundary>
        <Puck
          key={puckKey}
          config={puckConfig}
          data={phase.data}
          onPublish={handlePublish}
          onChange={handleChange}
          iframe={{ enabled: true }}
          overrides={{
            header: ({ actions, children }: { actions: React.ReactNode; children: React.ReactNode }) => (
              <EditorHeader
                actions={actions}
                metadataId={metadataIdRef.current!}
                token={tokenRef.current!}
                pagePath={pagePath}
                onBanner={setBanner}
                onSaved={handleSaved}
                onRevert={handleRevert}
              >
                {lastSaved && (
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      fontFamily: 'system-ui, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Saved {lastSaved}
                  </span>
                )}
                {children}
              </EditorHeader>
            ),
          }}
        />
      </EditorErrorBoundary>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: fetch initial sections from public API
// ---------------------------------------------------------------------------

async function fetchInitialSections(pagePath: string): Promise<Data> {
  if (!API_URL) return EMPTY_DATA;

  try {
    const res = await fetch(
      `${API_URL}/public/seo/sections?path=${encodeURIComponent(pagePath)}`,
    );

    if (!res.ok) return EMPTY_DATA;

    const sections = await res.json();
    if (!Array.isArray(sections) || sections.length === 0) return EMPTY_DATA;

    return sectionsToPuckData(sections);
  } catch {
    return EMPTY_DATA;
  }
}

// ---------------------------------------------------------------------------
// UI sub-components
// ---------------------------------------------------------------------------

function LoadingScreen({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        gap: '16px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes editorSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'editorSpin 0.8s linear infinite',
        }}
      />
      <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>{message}</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          padding: '32px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#b91c1c' }}>
          Editor Unavailable
        </p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
          {message}
        </p>
      </div>
    </div>
  );
}

function Banner({
  type,
  message,
  onDismiss,
}: {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}) {
  const bgColor = type === 'success' ? '#dcfce7' : '#fee2e2';
  const textColor = type === 'success' ? '#166534' : '#991b1b';
  const borderColor = type === 'success' ? '#86efac' : '#fca5a5';

  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '14px',
        fontFamily: 'system-ui, sans-serif',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <span>{message}</span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          color: textColor,
          padding: '0 4px',
          lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        x
      </button>
    </div>
  );
}
