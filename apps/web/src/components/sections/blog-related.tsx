import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

export function BlogRelated({
  posts,
}: {
  readonly posts: readonly PostMeta[];
}) {
  return (
    <div className="py-12">
      <h2 className="mb-8 text-center text-2xl font-heading-bold text-navy sm:text-3xl">
        Related Posts
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.slug} className="flex flex-col">
            {post.image && (
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Link>
            )}
            <div className="pt-4">
              <p className="text-base font-body-medium text-primary">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </p>
              <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-navy/50">
                {post.author}
              </p>
              <p className="mt-2 font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-navy/70">
                {post.excerpt.slice(0, 180)}
                {post.excerpt.length > 180 ? "..." : ""}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-block font-[family-name:var(--font-poppins)] text-sm font-body-medium text-primary hover:underline"
              >
                Read More &raquo;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
