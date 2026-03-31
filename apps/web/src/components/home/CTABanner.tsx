import Link from "next/link";
import type { CtaConfig } from "@/lib/section-defaults";

const DEFAULTS = {
  heading: "Ready to Get Started?",
  subheading:
    "From easy scheduling to reliable 24-hour delivery, we've built a laundry service that fits into your life instead of taking over it.",
  ctaText: "Schedule Pick-up",
  ctaLink: "/account/",
  secondaryCtaText: "View Pricing",
  secondaryCtaLink: "/wash-fold",
};

export function CTABanner({ config }: { config?: CtaConfig }) {
  const heading = config?.heading ?? DEFAULTS.heading;
  const subheading = config?.subheading ?? DEFAULTS.subheading;
  const ctaText = config?.ctaText ?? DEFAULTS.ctaText;
  const ctaLink = config?.ctaLink ?? DEFAULTS.ctaLink;
  const secondaryCtaText = config?.secondaryCtaText ?? DEFAULTS.secondaryCtaText;
  const secondaryCtaLink = config?.secondaryCtaLink ?? DEFAULTS.secondaryCtaLink;

  return (
    <section className="bg-light-blue py-14">
      <div className="container-site max-w-[1100px]">
        <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-14 text-center max-w-[750px] mx-auto">
          <h2 className="text-[1.75rem] lg:text-[2.625rem] font-medium text-black mb-3">
            {heading}
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 max-w-md mx-auto mb-7 leading-relaxed">
            {subheading}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={ctaLink}
              className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
            >
              {ctaText}
            </Link>
            <Link
              href={secondaryCtaLink}
              className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              {secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
