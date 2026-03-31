import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

export function BlogSidebar({
  posts,
}: {
  readonly posts: readonly PostMeta[];
}) {
  return (
    <aside className="space-y-6">
      <h4 className="text-lg font-heading-bold text-primary">Featured Posts</h4>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug} className="flex gap-3">
            {post.image && (
              <Link
                href={`/blog/${post.slug}`}
                className="relative block h-16 w-20 shrink-0 overflow-hidden rounded"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </Link>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy hover:text-primary"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="rounded-lg bg-primary px-4 py-3 text-center">
        <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-white">
          Laundry Pickup &amp; Delivery
        </p>
      </div>
    </aside>
  );
}
