import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const API_URL = process.env.BEHEMOUTH_API_URL || "";

type BlogCategory = {
  id: number;
  name: string;
  slug: string;
};

type PublicBlogPostResponse = {
  slug: string;
  title: string;
  excerpt: string | null;
  author: string | null;
  featured_image_url: string | null;
  content_html: string;
  content_json: Record<string, unknown> | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  categories: BlogCategory[];
};

type PublicBlogPostsResponse = {
  items: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    author: string | null;
    featured_image_url: string | null;
    status: "draft" | "published";
    seo_title: string | null;
    seo_description: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    updated_by: string | null;
    categories: BlogCategory[];
  }>;
};

export type PostMeta = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags: string[];
  image?: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type Post = PostMeta & {
  content: string;
  contentHtml?: string;
  contentJson?: Record<string, unknown> | null;
};

function extractFirstImage(content: string): string | undefined {
  const match = content.match(/!\[.*?\]\((.*?)\s*(?:".*?")?\)/);
  return match?.[1];
}

function extractSource(contentJson: Record<string, unknown> | null | undefined): string {
  if (!contentJson || contentJson.type !== "mdx") return "";
  return typeof contentJson.source === "string" ? contentJson.source : "";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export { formatDate };

function mapApiPost(post: PublicBlogPostResponse): Post {
  const content = extractSource(post.content_json);
  return {
    title: post.title,
    date: post.published_at ?? new Date().toISOString(),
    excerpt: post.excerpt ?? "",
    slug: post.slug,
    tags: post.categories.map((category) => category.slug),
    image: post.featured_image_url ?? undefined,
    author: post.author ?? "Betsy",
    seoTitle: post.seo_title ?? undefined,
    seoDescription: post.seo_description ?? undefined,
    content,
    contentHtml: post.content_html,
    contentJson: post.content_json,
  };
}

function mapApiListPost(post: PublicBlogPostsResponse["items"][number]): PostMeta {
  return {
    title: post.title,
    date: post.published_at ?? post.updated_at,
    excerpt: post.excerpt ?? "",
    slug: post.slug,
    tags: post.categories.map((category) => category.slug),
    image: post.featured_image_url ?? undefined,
    author: post.author ?? "Betsy",
    seoTitle: post.seo_title ?? undefined,
    seoDescription: post.seo_description ?? undefined,
  };
}

async function fetchPublicPosts(): Promise<PostMeta[]> {
  if (!API_URL) return [];

  try {
    const response = await fetch(`${API_URL}/public/blog/posts`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const data: PublicBlogPostsResponse = await response.json();
    return data.items.map(mapApiListPost);
  } catch {
    return [];
  }
}

async function fetchPublicPostBySlug(slug: string): Promise<Post | undefined> {
  if (!API_URL) return undefined;

  try {
    const response = await fetch(`${API_URL}/public/blog/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return undefined;

    const data: PublicBlogPostResponse = await response.json();
    return mapApiPost(data);
  } catch {
    return undefined;
  }
}

function getLocalPosts(): PostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);

    return {
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      slug,
      tags: data.tags ?? [],
      image: data.image ?? extractFirstImage(content),
      author: data.author ?? "Betsy",
    } as PostMeta;
  });
}

function getLocalPost(slug: string): Post | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    slug,
    tags: data.tags ?? [],
    image: data.image ?? extractFirstImage(content),
    author: data.author ?? "Betsy",
    content,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const [apiPosts, localPosts] = await Promise.all([fetchPublicPosts(), Promise.resolve(getLocalPosts())]);
  const merged = new Map<string, PostMeta>();

  apiPosts.forEach((post) => merged.set(post.slug, post));
  localPosts.forEach((post) => {
    if (!merged.has(post.slug)) {
      merged.set(post.slug, post);
    }
  });

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const apiPost = await fetchPublicPostBySlug(slug);
  if (apiPost) return apiPost;
  return getLocalPost(slug);
}
