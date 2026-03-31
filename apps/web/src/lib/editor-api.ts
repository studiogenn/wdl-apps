/**
 * Editor API helpers -- client-side calls used by the Puck visual editor route.
 *
 * Token is passed as a Bearer header (or query param for verify).
 * Base URL comes from the public env var so it's available in the browser.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BEHEMOUTH_API_URL ?? ''

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VerifyEditorTokenResult {
  valid: boolean
  metadata_id: number | null
  page_path: string | null
}

export interface EditorStateResult {
  editor_state: Record<string, unknown> | null
  updated_at: string | null
}

export interface SaveEditorStateResult {
  editor_state: Record<string, unknown>
  sections_count: number
}

export interface VersionItem {
  timestamp: string
  saved_by: string | null
}

export interface VersionHistoryResult {
  versions: VersionItem[]
}

export interface RevertResult {
  editor_state: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function assertOk(res: Response, context: string): Promise<void> {
  if (res.ok) return

  let detail: string
  try {
    const body = await res.json()
    detail = body?.detail ?? body?.message ?? JSON.stringify(body)
  } catch {
    detail = await res.text().catch(() => res.statusText)
  }
  throw new Error(`${context}: ${res.status} ${detail}`)
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validate an editor token (called on editor route load).
 * No auth header needed -- the token is passed as a query param.
 */
export async function verifyEditorToken(
  token: string,
): Promise<VerifyEditorTokenResult> {
  const url = `${BASE_URL}/public/seo/verify-editor-token?token=${encodeURIComponent(token)}`
  const res = await fetch(url)
  await assertOk(res, 'verifyEditorToken')
  return res.json()
}

/**
 * Load the saved Puck editor state for a page.
 */
export async function loadEditorState(
  metadataId: number,
  token: string,
): Promise<EditorStateResult> {
  const url = `${BASE_URL}/v1/seo/metadata/${metadataId}/editor-state`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  await assertOk(res, 'loadEditorState')
  return res.json()
}

/**
 * Persist editor state (and optionally publish).
 */
export async function saveEditorState(
  metadataId: number,
  token: string,
  data: {
    editor_state: Record<string, unknown>
    publish?: boolean
  },
): Promise<SaveEditorStateResult> {
  const url = `${BASE_URL}/v1/seo/metadata/${metadataId}/editor-state`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  await assertOk(res, 'saveEditorState')
  return res.json()
}

/**
 * Save current editor state as a draft without publishing.
 * Updates editor_state and draft_sections columns but leaves
 * published sections untouched.
 */
export async function saveDraft(
  metadataId: number,
  token: string,
  data: { editor_state: Record<string, unknown> },
): Promise<SaveEditorStateResult> {
  return saveEditorState(metadataId, token, {
    editor_state: data.editor_state,
    publish: false,
  })
}

/**
 * Fetch version history metadata (timestamps + authors) for the version dropdown.
 * Does not include full editor_state payloads to keep the response lightweight.
 */
export async function fetchVersionHistory(
  metadataId: number,
  token: string,
): Promise<VersionHistoryResult> {
  const url = `${BASE_URL}/v1/seo/metadata/${metadataId}/versions`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  await assertOk(res, 'fetchVersionHistory')
  return res.json()
}

/**
 * Revert editor state to a previous version snapshot.
 * The current state is automatically snapshotted before reverting (so it's undoable).
 */
export async function revertToVersion(
  metadataId: number,
  token: string,
  versionIndex: number,
): Promise<RevertResult> {
  const url = `${BASE_URL}/v1/seo/metadata/${metadataId}/revert`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ version_index: versionIndex }),
  })
  await assertOk(res, 'revertToVersion')
  return res.json()
}
