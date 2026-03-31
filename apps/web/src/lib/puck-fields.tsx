'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getEditorToken } from '@/lib/editor-token';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MediaItem {
  id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  url: string;
  thumbnail_url: string | null;
  uploaded_by: string;
  created_at: string;
}

interface MediaListResponse {
  items: MediaItem[];
  total: number;
  limit: number;
  offset: number;
}

interface CustomFieldRenderProps {
  value: string;
  onChange: (value: string) => void;
  field: { label?: string };
}

// ---------------------------------------------------------------------------
// Styles (inline -- runs inside Puck sidebar, not the canvas)
// ---------------------------------------------------------------------------

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    width: '100%',
  },
  preview: {
    width: '100%',
    maxHeight: '160px',
    objectFit: 'contain' as const,
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  previewPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
    borderRadius: '6px',
    border: '1px dashed #d1d5db',
    background: '#f9fafb',
    color: '#9ca3af',
    fontSize: '13px',
  },
  input: {
    width: '100%',
    padding: '6px 10px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  browseButton: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    cursor: 'pointer',
    width: '100%',
  },
  clearButton: {
    padding: '6px 14px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #fca5a5',
    background: '#fff',
    color: '#dc2626',
    cursor: 'pointer',
    width: '100%',
  },
  buttonRow: {
    display: 'flex',
    gap: '6px',
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    background: '#fff',
    borderRadius: '12px',
    width: '90vw',
    maxWidth: '900px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#6b7280',
    cursor: 'pointer',
    padding: '4px 8px',
    lineHeight: 1,
  },
  searchBar: {
    padding: '12px 20px',
    borderBottom: '1px solid #e5e7eb',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px',
    padding: '20px',
    overflowY: 'auto' as const,
    flex: 1,
  },
  gridItem: {
    cursor: 'pointer',
    borderRadius: '8px',
    border: '2px solid transparent',
    overflow: 'hidden',
    background: '#f9fafb',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  gridItemHover: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59,130,246,0.2)',
  },
  gridImage: {
    width: '100%',
    aspectRatio: '4 / 3',
    objectFit: 'cover' as const,
    display: 'block',
  },
  gridLabel: {
    padding: '6px 8px',
    fontSize: '11px',
    color: '#6b7280',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  statusMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    color: '#6b7280',
    fontSize: '14px',
  },
  paginationBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '13px',
    color: '#6b7280',
  },
  paginationButton: {
    padding: '4px 12px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    cursor: 'pointer',
  },
  paginationButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
} as const;

// ---------------------------------------------------------------------------
// Media browser modal
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_BEHEMOUTH_API_URL ?? '';
const PAGE_SIZE = 24;

function MediaBrowserModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchMedia = useCallback(async (currentOffset: number) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const token = getEditorToken();
    if (!token || !API_URL) {
      setError('Media library unavailable. Use manual URL entry instead.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/v1/media?limit=${PAGE_SIZE}&offset=${currentOffset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data: MediaListResponse = await res.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(
        `Failed to load media library: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia(offset);
    return () => {
      abortRef.current?.abort();
    };
  }, [offset, fetchMedia]);

  const query = search.trim().toLowerCase();
  const filteredItems = !query
    ? items
    : items.filter((item) =>
        [item.original_filename, item.filename, item.alt_text ?? ''].some(
          (v) => v.toLowerCase().includes(query),
        ),
      );

  const hasPrev = offset > 0;
  const hasNext = offset + PAGE_SIZE < total;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Media Library</h3>
          <button style={styles.closeButton} onClick={onClose} aria-label="Close">
            x
          </button>
        </div>

        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Filter images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />
        </div>

        {loading ? (
          <div style={styles.statusMessage}>Loading images...</div>
        ) : error ? (
          <div style={{ ...styles.statusMessage, color: '#dc2626' }}>{error}</div>
        ) : filteredItems.length === 0 ? (
          <div style={styles.statusMessage}>
            {items.length === 0
              ? 'No images uploaded yet.'
              : 'No images match your filter.'}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.gridItem,
                  ...(hoveredId === item.id ? styles.gridItemHover : {}),
                }}
                onClick={() => onSelect(item.url)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                title={item.original_filename}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url ?? item.url}
                  alt={item.alt_text ?? item.original_filename}
                  style={styles.gridImage}
                />
                <div style={styles.gridLabel}>{item.original_filename}</div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && total > 0 && (
          <div style={styles.paginationBar}>
            <span>
              {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                style={{
                  ...styles.paginationButton,
                  ...(hasPrev ? {} : styles.paginationButtonDisabled),
                }}
                disabled={!hasPrev}
                onClick={() => setOffset((v) => Math.max(0, v - PAGE_SIZE))}
              >
                Previous
              </button>
              <button
                style={{
                  ...styles.paginationButton,
                  ...(hasNext ? {} : styles.paginationButtonDisabled),
                }}
                disabled={!hasNext}
                onClick={() => setOffset((v) => v + PAGE_SIZE)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image picker field render component
// ---------------------------------------------------------------------------

function ImagePickerFieldRender({ value, onChange }: CustomFieldRenderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = (url: string) => {
    onChange(url);
    setModalOpen(false);
  };

  return (
    <div style={styles.wrapper}>
      {value ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={value} alt="Selected image" style={styles.preview} />
      ) : (
        <div style={styles.previewPlaceholder}>No image selected</div>
      )}

      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter image URL or browse library"
        style={styles.input}
      />

      <div style={styles.buttonRow}>
        <button
          type="button"
          style={styles.browseButton}
          onClick={() => setModalOpen(true)}
        >
          Browse Library
        </button>
        {value && (
          <button
            type="button"
            style={styles.clearButton}
            onClick={() => onChange('')}
          >
            Clear
          </button>
        )}
      </div>

      {modalOpen && (
        <MediaBrowserModal
          onSelect={handleSelect}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported field definition for puck-config.tsx
// ---------------------------------------------------------------------------

/**
 * Custom Puck field that provides an image URL picker with
 * media library browser. Use it in component field definitions:
 *
 * ```ts
 * fields: {
 *   heroImage: { ...imagePickerField, label: 'Hero Image' },
 * }
 * ```
 */
export const imagePickerField = {
  type: 'custom' as const,
  label: 'Image',
  render: ImagePickerFieldRender,
};
