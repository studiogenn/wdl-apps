import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BlogSidebar } from "@/components/sections/blog-sidebar";
import { BlogShare } from "@/components/sections/blog-share";
import { BlogCta } from "@/components/sections/blog-cta";
import { BlogRelated } from "@/components/sections/blog-related";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.seoTitle ?? post.title} | We Deliver Laundry`,
    description: post.seoDescription ?? post.excerpt,
    openGraph: {
      title: post.title,
      description: post.seoDescription ?? post.excerpt,
      type: "article",
      publishedTime: post.date,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

function JsonLd({ post }: { readonly post: { title: string; date: string; excerpt: string; author: string; image?: string } }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    ...(post.image ? { image: post.image } : {}),
  };

  // JSON.stringify produces safe output for script tags - no user HTML is injected
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const featuredPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 6);
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd post={post} />

      {/* Hero Banner */}
      <div className="bg-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 sm:flex-row sm:py-16">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {post.title}
            </h1>
          </div>
          {post.image && (
            <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg sm:h-56 sm:w-80">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* Content + Sidebar */}
      <article className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-primary">
            {post.content ? (
              <MDXRemote source={post.content} />
            ) : post.contentHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <BlogSidebar posts={featuredPosts} />
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="mx-auto mt-12 max-w-6xl">
          <BlogShare title={post.title} slug={slug} />
        </div>
      </article>

      {/* CTA Banner */}
      <div className="px-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <BlogCta />
        </div>
      </div>

      {/* Related Posts */}
      <div className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <BlogRelated posts={relatedPosts} />
        </div>
      </div>
    </>
  );
}
