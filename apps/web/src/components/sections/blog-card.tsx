import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/blog";

export function BlogCard({ post }: { readonly post: PostMeta }) {
  return (
    <div className="flex flex-col">
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
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-lg font-semibold leading-snug text-primary">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="mt-1 font-[family-name:var(--font-poppins)] text-xs text-navy/50">
          {post.author} // {formatDate(post.date)}
        </p>
        <p className="mt-3 flex-1 font-[family-name:var(--font-poppins)] text-sm leading-relaxed text-navy/70">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-block font-[family-name:var(--font-poppins)] text-sm font-semibold text-primary hover:underline"
        >
          Read More &raquo;
        </Link>
      </div>
    </div>
  );
}
