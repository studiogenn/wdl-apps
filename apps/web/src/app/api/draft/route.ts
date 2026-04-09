/**
 * Draft mode route handler.
 *
 * Validates the editor JWT token via the CMS API, enables
 * Next.js draft mode, and redirects the user to the target page.
 *
 * Usage: GET /api/draft?token=xxx&path=/some-page
 */

import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.CMS_API_URL ?? '';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const path = request.nextUrl.searchParams.get('path') ?? '/';

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  if (!API_URL) {
    return NextResponse.json(
      { error: 'API not configured' },
      { status: 500 },
    );
  }

  // Validate the editor token against the API
  try {
    const verifyUrl = `${API_URL}/public/seo/verify-editor-token?token=${encodeURIComponent(token)}`;
    const res = await fetch(verifyUrl, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Token verification failed' },
        { status: 401 },
      );
    }

    const data = await res.json();

    if (!data.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 502 },
    );
  }

  // Enable Next.js draft mode
  (await draftMode()).enable();

  // Redirect to the target page
  const redirectUrl = new URL(path, request.url);
  return NextResponse.redirect(redirectUrl);
}
