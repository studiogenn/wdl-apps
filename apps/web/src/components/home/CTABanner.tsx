import type { CtaConfig } from "@/lib/section-defaults";
import { ButtonLink } from "@/components/shared";

const DEFAULTS = {
  heading: "Ready to Get Started?",
  subheading:
    "From easy scheduling to reliable 24-hour delivery, we've built a laundry service that fits into your life instead of taking over it.",
  ctaText: "Schedule Pickup",
  ctaLink: "/account/",
  secondaryCtaText: "View Memberships",
  secondaryCtaLink: "/membership",
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
          <h2 className="text-[1.75rem] lg:text-[2.625rem] font-heading-medium text-black mb-3">
            {heading}
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 max-w-md mx-auto mb-7 leading-relaxed">
            {subheading}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href={ctaLink}>
              {ctaText}
            </ButtonLink>
            <ButtonLink href={secondaryCtaLink} variant="outline">
              {secondaryCtaText}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
