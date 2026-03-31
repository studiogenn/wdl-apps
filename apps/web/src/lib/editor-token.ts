/**
 * Module-level store for the editor authentication token.
 *
 * The Puck editor page calls `setEditorToken()` once after verifying the
 * token. Custom field components (e.g. the image picker) can then read it
 * via `getEditorToken()` without prop-drilling or React context.
 */

let _token: string | null = null;

export function setEditorToken(token: string): void {
  _token = token;
}

export function getEditorToken(): string | null {
  return _token;
}
