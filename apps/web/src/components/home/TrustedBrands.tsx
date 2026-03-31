"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { TrustedBrandsConfig } from "@/lib/section-defaults";

type LogoItem = { src: string; alt: string };
type Slot = LogoItem | [LogoItem, LogoItem];

const SLOTS: Slot[] = [
  { src: "/images/brands/brand-1.svg", alt: "Aēsop" },
  { src: "/images/brands/brand-2.svg", alt: "Macy's" },
  { src: "/images/brands/brand-3.svg", alt: "Barry's" },
  { src: "/images/brands/brand-4.svg", alt: "Schwartz" },
  { src: "/images/brands/brand-5.webp", alt: "Wonder" },
  { src: "/images/brands/brand-7.webp", alt: "Partner brand" },
  [
    { src: "/images/brands/brand-8.webp", alt: "Angle" },
    { src: "/images/brands/brand-9.webp", alt: "Enso Sauna Studio" },
  ],
  [
    { src: "/images/brands/brand-10.webp", alt: "Apollo Bagels" },
    { src: "/images/brands/brand-14.webp", alt: "Partner brand" },
  ],
  { src: "/images/brands/brand-11.webp", alt: "Partner brand" },
  { src: "/images/brands/brand-12.webp", alt: "Partner brand" },
  [
    { src: "/images/brands/brand-13.webp", alt: "Partner brand" },
    { src: "/images/brands/brand-16.webp", alt: "Partner brand" },
  ],
  { src: "/images/brands/brand-15.webp", alt: "Partner brand" },
];

const SLOT_WIDTH = 144;
const GAP = 48;
const STEP = SLOT_WIDTH + GAP;
const SLIDE_MS = 600;
const PAUSE_MS = 2000;

function LogoImage({ logo }: { logo: LogoItem }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={144}
      height={48}
      className="h-7 w-auto max-w-full brightness-0 invert opacity-80 object-contain"
    />
  );
}

export function TrustedBrands({ config }: { config?: TrustedBrandsConfig }) {
  const heading = config?.heading ?? "Trusted by Brands Across the City";
  const [offset, setOffset] = useState(0);
  const [animated, setAnimated] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const tick = () => {
      setAnimated(true);
      setOffset((prev) => prev + 1);
      timerRef.current = setTimeout(tick, SLIDE_MS + PAUSE_MS);
    };

    timerRef.current = setTimeout(tick, PAUSE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTransitionEnd = () => {
    if (offset >= SLOTS.length) {
      setAnimated(false);
      setOffset(0);
    }
  };

  const allSlots = [...SLOTS, ...SLOTS];

  return (
    <section className="bg-primary py-8">
      <p className="text-center text-white/80 text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-poppins)] font-body-medium mb-6">
        {heading}
      </p>
      <div className="overflow-hidden w-full">
        <div
          className="flex items-center"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(-${offset * STEP}px)`,
            transition: animated ? `transform ${SLIDE_MS}ms ease-in-out` : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {allSlots.map((slot, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: `${SLOT_WIDTH}px`, height: 28 }}
            >
              {Array.isArray(slot) ? (
                <div className="flex items-center justify-center gap-4">
                  {slot.map((logo, j) => (
                    <LogoImage key={j} logo={logo} />
                  ))}
                </div>
              ) : (
                <LogoImage logo={slot} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
