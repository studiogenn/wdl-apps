import Image from "next/image";
import type { HeroConfig } from "@/lib/section-defaults";
import { ButtonLink } from "@/components/shared";

const DEFAULTS = {
  heading: "Laundry Pickup & Delivery in NYC & New Jersey",
  subheading:
    "Schedule a pickup, and get your clothes professionally washed, folded, and returned within 24 hours.",
  ctaText: "Schedule Pickup",
  ctaLink: "/account/",
  secondaryCtaText: "View Memberships",
  secondaryCtaLink: "/membership",
  bulletPoints: [
    "24-Hour Turnaround",
    "Reliable Delivery Service",
    "No Harsh Chemicals",
  ],
};

export interface HeroProps extends HeroConfig {
  config?: HeroConfig;
}

export function Hero({
  heading,
  subheading,
  ctaText,
  ctaLink,
  backgroundColor,
  secondaryCtaText,
  secondaryCtaLink,
  bulletPoints,
  config,
}: HeroProps) {
  const resolvedHeading = heading ?? config?.heading ?? DEFAULTS.heading;
  const resolvedSubheading = subheading ?? config?.subheading ?? DEFAULTS.subheading;
  const resolvedCtaText = ctaText ?? config?.ctaText ?? DEFAULTS.ctaText;
  const resolvedCtaLink = ctaLink ?? config?.ctaLink ?? DEFAULTS.ctaLink;
  const resolvedBackgroundColor = backgroundColor ?? config?.backgroundColor;
  const resolvedSecondaryCtaText =
    secondaryCtaText ?? config?.secondaryCtaText ?? DEFAULTS.secondaryCtaText;
  const resolvedSecondaryCtaLink =
    secondaryCtaLink ?? config?.secondaryCtaLink ?? DEFAULTS.secondaryCtaLink;
  const resolvedBulletPoints = bulletPoints ?? config?.bulletPoints ?? DEFAULTS.bulletPoints;

  return (
    <section
      className="bg-cream relative overflow-hidden"
      style={resolvedBackgroundColor ? { backgroundColor: resolvedBackgroundColor } : undefined}
    >
      <div className="container-site py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 max-w-xl relative z-10">
            <h1 className="text-3xl lg:text-[36px] font-normal leading-[3.375rem] tracking-[0.84px] text-black mb-5 uppercase">
              {resolvedHeading}
            </h1>
            <p className="font-[family-name:var(--font-poppins)] text-[15px] text-black/80 mb-6 leading-relaxed">
              {resolvedSubheading}
            </p>
            <ul className="font-[family-name:var(--font-poppins)] text-[14px] text-navy space-y-2.5 mb-8">
              {resolvedBulletPoints.map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={resolvedCtaLink}>
                {resolvedCtaText}
              </ButtonLink>
              <ButtonLink href={resolvedSecondaryCtaLink} variant="outline">
                {resolvedSecondaryCtaText}
              </ButtonLink>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <Image
              src="/images/hero.webp"
              alt="Laundry pickup and delivery service"
              width={550}
              height={670}
              className="rounded-2xl object-cover w-full max-w-[480px] h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1227BE"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
