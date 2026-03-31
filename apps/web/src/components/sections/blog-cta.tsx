import Link from "next/link";

export function BlogCta() {
  return (
    <div className="flex items-center justify-between rounded-lg bg-cream px-8 py-8 sm:px-12">
      <div>
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">
          Never Do Your Laundry Again
        </h2>
        <h3 className="mt-1 font-[family-name:var(--font-poppins)] text-base text-navy/70">
          We Pickup, Wash, Fold &amp; Deliver
        </h3>
      </div>
      <Link
        href="/account"
        className="shrink-0 rounded-full bg-primary px-6 py-3 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        Try it Now!
      </Link>
    </div>
  );
}
