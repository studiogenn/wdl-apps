import fs from "fs";
import path from "path";
import TurndownService from "turndown";

const WP_API = "https://wedeliverlaundry.com/wp-json/wp/v2";
const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const IMAGE_DIR = path.join(process.cwd(), "public/blog");

type WPPost = {
  readonly id: number;
  readonly slug: string;
  readonly date: string;
  readonly title: { readonly rendered: string };
  readonly excerpt: { readonly rendered: string };
  readonly content: { readonly rendered: string };
  readonly featured_media: number;
};

type WPMedia = {
  readonly source_url: string;
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function inferTags(slug: string, title: string): readonly string[] {
  const tags: string[] = [];
  const text = `${slug} ${title}`.toLowerCase();

  if (text.includes("stain") || text.includes("remove")) tags.push("stain-removal");
  if (text.includes("spring")) tags.push("seasonal");
  if (text.includes("tip") || text.includes("guide") || text.includes("how-to"))
    tags.push("laundry-tips");
  if (text.includes("dry-clean") || text.includes("tumble-dry") || text.includes("wash"))
    tags.push("fabric-care");
  if (text.includes("east-orange") || text.includes("nj") || text.includes("ny"))
    tags.push("locations");
  if (text.includes("coronavirus") || text.includes("sanitizer") || text.includes("safe"))
    tags.push("hygiene");
  if (text.includes("memorial") || text.includes("off")) tags.push("promotions");
  if (text.includes("college") || text.includes("student")) tags.push("laundry-tips");
  if (text.includes("wedding")) tags.push("special-care");
  if (text.includes("sustainab") || text.includes("green")) tags.push("sustainability");

  if (tags.length === 0) tags.push("laundry-tips");

  return [...new Set(tags)];
}

async function fetchAllPosts(): Promise<readonly WPPost[]> {
  const allPosts: WPPost[] = [];
  let page = 1;
  const perPage = 25;

  // Fetch with pagination
  while (true) {
    const url = `${WP_API}/posts?per_page=${perPage}&page=${page}&_fields=id,slug,title,date,excerpt,content,featured_media`;
    console.log(`Fetching page ${page}...`);

    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 400) break; // No more pages
      throw new Error(`WP API error: ${response.status} ${response.statusText}`);
    }

    const posts = (await response.json()) as WPPost[];
    if (posts.length === 0) break;

    allPosts.push(...posts);

    const totalPages = Number(response.headers.get("x-wp-totalpages") ?? 1);
    if (page >= totalPages) break;
    page++;
  }

  return allPosts;
}

async function fetchFeaturedImage(mediaId: number): Promise<string | null> {
  if (mediaId === 0) return null;

  try {
    const response = await fetch(`${WP_API}/media/${mediaId}?_fields=source_url`);
    if (!response.ok) return null;

    const media = (await response.json()) as WPMedia;
    return media.source_url;
  } catch {
    return null;
  }
}

async function downloadImage(url: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) return false;

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const filepath = path.join(IMAGE_DIR, `${filename}${ext}`);
    fs.writeFileSync(filepath, buffer);
    console.log(`  Downloaded image: ${filepath}`);
    return true;
  } catch {
    console.warn(`  Failed to download image: ${url}`);
    return false;
  }
}

function convertHtmlToMarkdown(html: string): string {
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  // Remove Elementor artifacts and empty divs
  const cleaned = html
    .replace(/<div[^>]*class="[^"]*elementor[^"]*"[^>]*>/gi, "")
    .replace(/<\/div>/gi, "")
    .replace(/<section[^>]*class="[^"]*elementor[^"]*"[^>]*>/gi, "")
    .replace(/<\/section>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\n{3,}/g, "\n\n");

  let markdown = turndown.turndown(cleaned);

  // Clean up excessive whitespace
  markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();

  // Decode any remaining HTML entities
  markdown = decodeHtmlEntities(markdown);

  return markdown;
}

function escapeYamlString(str: string): string {
  // If string contains special chars, wrap in double quotes with escaping
  if (str.includes('"') || str.includes(":") || str.includes("'")) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return `"${str}"`;
}

async function main(): Promise<void> {
  console.log("Starting WordPress blog migration...\n");

  // Ensure directories exist
  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.mkdirSync(IMAGE_DIR, { recursive: true });

  const posts = await fetchAllPosts();
  console.log(`\nFetched ${posts.length} posts from WordPress.\n`);

  for (const post of posts) {
    const title = decodeHtmlEntities(post.title.rendered);
    const slug = post.slug;
    const date = post.date.split("T")[0]; // YYYY-MM-DD
    const excerpt = decodeHtmlEntities(stripHtmlTags(post.excerpt.rendered));
    const tags = inferTags(slug, title);

    console.log(`Processing: ${title} (${slug})`);

    // Convert content
    const markdown = convertHtmlToMarkdown(post.content.rendered);

    // Download featured image if available
    if (post.featured_media > 0) {
      const imageUrl = await fetchFeaturedImage(post.featured_media);
      if (imageUrl) {
        await downloadImage(imageUrl, slug);
      }
    }

    // Build MDX file
    const truncatedExcerpt =
      excerpt.length > 200 ? `${excerpt.substring(0, 197)}...` : excerpt;

    const mdx = `---
title: ${escapeYamlString(title)}
date: "${date}"
excerpt: ${escapeYamlString(truncatedExcerpt)}
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
---

${markdown}
`;

    const filepath = path.join(BLOG_DIR, `${slug}.mdx`);
    fs.writeFileSync(filepath, mdx, "utf-8");
    console.log(`  Written: ${filepath}\n`);
  }

  console.log(`\nMigration complete! ${posts.length} posts migrated.`);
}

main().catch(console.error);
