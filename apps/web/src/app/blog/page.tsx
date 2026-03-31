import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/sections/blog-card";

export const metadata: Metadata = {
  title: "Blog | We Deliver Laundry",
  description:
    "Laundry tips, stain removal guides, and news from We Deliver Laundry.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-primary sm:text-4xl">
          We Deliver Laundry - Laundry Blog
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
