"use client";

import { useRef, useState, useEffect } from "react";
import type { TestimonialsConfig } from "@/lib/section-defaults";

const REVIEWS = [
  {
    name: "Michele M",
    initial: "M",
    timeAgo: "3 months ago",
    rating: 5,
    text: "Always a quick, seamless experience. I love that you can choose which products you\u2019d like use on your clothes that\u2019s...",
  },
  {
    name: "betina",
    initial: "B",
    timeAgo: "5 months ago",
    rating: 5,
    text: "Best laundry service I\u2019ve tried. Super clean, perfectly folded, sorted by person, and delivered right to my door. I...",
  },
  {
    name: "Moises sanabria",
    initial: "M",
    timeAgo: "5 months ago",
    rating: 5,
    text: "I\u2019ve used We Deliver Laundry a few times now, and every experience has been smooth and professional. Their picku...",
  },
  {
    name: "Daniela Parada Alzate",
    initial: "D",
    timeAgo: "8 months ago",
    rating: 5,
    text: "We Deliver Laundry has completely transformed the way I handle laundry! Pickup and drop-off are always on...",
  },
  {
    name: "Lynn Quach",
    initial: "L",
    timeAgo: "9 months ago",
    rating: 5,
    text: "This laundry company was incredibly responsive and delivered excellent service with great attention to detail...",
  },
];

const DEFAULTS = {
  heading: "A Word From Our Customers",
  subheading:
    "Straight from customers who rely on We Deliver Laundry every week for fast, reliable laundry pickup and delivery across NYC and New Jersey.",
  eyebrow: "Client Testimonials",
};

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11.96 11.96 0 0 0 .96 12c0 1.94.46 3.77 1.22 5.33l3.66-3.24Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.99 14.97.96 12 .96 7.7.96 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1A73E8" />
      <path d="M9.5 12.5l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <div className="flex-shrink-0 w-[260px] bg-white rounded-xl border border-navy/10 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-sm font-body-medium text-navy">
            {review.initial}
          </div>
          <div>
            <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy leading-tight">
              {review.name}
            </p>
            <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/40">
              {review.timeAgo}
            </p>
          </div>
        </div>
        <GoogleIcon />
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <StarIcon key={i} />
        ))}
        <span className="ml-1"><VerifiedBadge /></span>
      </div>

      <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/80 leading-relaxed line-clamp-4">
        {review.text}
      </p>
    </div>
  );
}

export function Testimonials({ config }: { config?: TestimonialsConfig }) {
  const heading = config?.heading ?? DEFAULTS.heading;
  const subheading = config?.subheading ?? DEFAULTS.subheading;
  const eyebrow = config?.eyebrow ?? DEFAULTS.eyebrow;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -280 : 280;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="container-site max-w-[1100px]">
        <p className="font-[family-name:var(--font-poppins)] text-center text-navy/50 text-xs uppercase tracking-[0.2em] mb-2">
          {eyebrow}
        </p>
        <h2 className="text-center text-[2rem] lg:text-[2.625rem] font-heading-medium text-navy mb-3 uppercase">
          {heading}
        </h2>
        <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-12">
          {subheading}
        </p>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/60 hover:text-navy transition-colors"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
          >
            {REVIEWS.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-navy/10 shadow-sm flex items-center justify-center text-navy/60 hover:text-navy transition-colors"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <GoogleIcon />
          <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
            5.0 rating on Google
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
