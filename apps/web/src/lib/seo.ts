/**
 * SEO metadata fetcher — pulls CMS-backed metadata from the Behemouth API.
 *
 * Usage in any page.tsx:
 *
 *   export async function generateMetadata(): Promise<Metadata> {
 *     return getSeoMetadata('/wash-fold')
 *   }
 *
 * If no published metadata exists for a path, returns {} so
 * Next.js falls back to the root layout defaults.
 *
 * Revalidates every 60 seconds via ISR.
 */

import type { Metadata } from "next";

const API_URL = process.env.BEHEMOUTH_API_URL || "";

interface SeoMetadataResponse {
  page_path: string;
  title: string | null;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  h1: string | null;
  canonical_url: string | null;
  schema_markup: Record<string, unknown> | null;
  robots: string | null;
}

interface SeoContentResponse {
  section_key: string;
  content_html: string | null;
  content_json: Record<string, unknown> | unknown[] | null;
}

async function fetchSeoResource<T>(pathname: string): Promise<T | null> {
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}${pathname}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getSeoMetadata(path: string): Promise<Metadata> {
  const data = await fetchSeoResource<SeoMetadataResponse>(
    `/public/seo/metadata?path=${encodeURIComponent(path)}`,
  );
  if (!data) return {};

  const metadata: Metadata = {};

  if (data.title) metadata.title = data.title;
  if (data.description) metadata.description = data.description;

  const ogTitle = data.og_title || data.title;
  const ogDescription = data.og_description || data.description;
  if (ogTitle || ogDescription || data.og_image) {
    metadata.openGraph = {
      ...(ogTitle ? { title: ogTitle } : {}),
      ...(ogDescription ? { description: ogDescription } : {}),
      ...(data.og_image ? { images: [{ url: data.og_image }] } : {}),
    };
  }

  if (data.canonical_url) {
    metadata.alternates = { canonical: data.canonical_url };
  }

  if (data.robots) {
    const r = data.robots.toLowerCase();
    metadata.robots = {
      index: r.includes("index") && !r.includes("noindex"),
      follow: r.includes("follow") && !r.includes("nofollow"),
    };
  }

  return metadata;
}

/**
 * Fetch the H1 heading from CMS metadata.
 * Use this in page components to render a CMS-controlled H1.
 * Returns null if no metadata or no H1 set.
 */
export async function getSeoH1(path: string): Promise<string | null> {
  const data = await fetchSeoResource<SeoMetadataResponse>(
    `/public/seo/metadata?path=${encodeURIComponent(path)}`,
  );
  return data?.h1 ?? null;
}

/**
 * Fetch JSON-LD schema markup from CMS metadata.
 * Returns null if no schema markup configured.
 */
export async function getSeoSchemaMarkup(
  path: string,
): Promise<Record<string, unknown> | null> {
  const data = await fetchSeoResource<SeoMetadataResponse>(
    `/public/seo/metadata?path=${encodeURIComponent(path)}`,
  );
  return data?.schema_markup ?? null;
}

export async function getSeoContent(
  path: string,
  section_key: string,
): Promise<{ html: string | null; json: Record<string, unknown> | unknown[] | null } | null> {
  const data = await fetchSeoResource<SeoContentResponse>(
    `/public/seo/content?path=${encodeURIComponent(path)}&section_key=${encodeURIComponent(section_key)}`,
  );
  if (!data) return null;
  return {
    html: data.content_html,
    json: data.content_json,
  };
}

/**
 * Section layout from CMS — controls which sections appear on a page
 * and in what order. Returns null if the API is unavailable or no
 * sections are configured, so the caller can fall back to hardcoded order.
 */
export interface SeoSection {
  section_type: string;
  component_key: string;
  section_order: number;
  config: Record<string, unknown> | null;
  visible: boolean;
}

export async function getSeoSections(
  path: string,
  draft: boolean = false,
): Promise<SeoSection[] | null> {
  if (!API_URL) return null;

  const draftParam = draft ? '&draft=true' : '';
  const url = `/public/seo/sections?path=${encodeURIComponent(path)}${draftParam}`;

  if (draft) {
    // Draft mode: always fetch fresh data, never cache
    try {
      const res = await fetch(`${API_URL}${url}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data: SeoSection[] = await res.json();
      if (!data || data.length === 0) return null;
      return data;
    } catch {
      return null;
    }
  }

  const data = await fetchSeoResource<SeoSection[]>(url);
  if (!data || data.length === 0) return null;
  return data;
}
