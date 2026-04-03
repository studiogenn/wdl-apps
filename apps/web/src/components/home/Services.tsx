import Image from "next/image";
import type { ServicesConfig } from "@/lib/section-defaults";
import { ButtonLink } from "@/components/shared";

const DEFAULTS = {
  heading: "Laundry Services for Every Need in NYC & New Jersey",
  subheading:
    "From everyday wash & fold to professional dry cleaning and commercial laundry services — We Deliver Laundry takes care of it all, so you don't have to.",
};

export interface ServicesProps extends ServicesConfig {
  config?: ServicesConfig;
}

export function Services({
  title,
  heading,
  subheading,
  showPricing,
  config,
}: ServicesProps) {
  const resolvedTitle =
    title ?? heading ?? config?.title ?? config?.heading ?? DEFAULTS.heading;
  const resolvedSubheading =
    subheading ?? config?.subheading ?? DEFAULTS.subheading;
  const resolvedShowPricing = showPricing ?? config?.showPricing ?? true;

  return (
    <section className="bg-light-blue py-16 lg:py-24">
      <div className="container-site max-w-[1100px]">
        {/* Section header */}
        <h2 className="text-center text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] font-normal leading-[1.75rem] md:leading-[2rem] lg:leading-[2.25rem] tracking-[0.84px] text-navy mb-3 uppercase">
          {resolvedTitle}
        </h2>
        <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-12 lg:mb-16">
          {resolvedSubheading}
        </p>

        {/* ── Wash & Fold — Hero Card ── */}
        <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow mb-6 lg:mb-8">
          {/* Most Popular badge */}
          <div className="absolute -top-3 left-6 sm:left-8">
            <span className="inline-block bg-highlight text-navy text-xs font-body-medium tracking-wide uppercase px-4 py-1.5 rounded-full shadow-sm font-[family-name:var(--font-inter)]">
              Most Popular
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-2">
              {/* Left: description + value props */}
              <div className="flex-1">
                <div className="flex items-start gap-4 sm:gap-5 mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] font-heading-medium text-navy mb-2">
                      Wash &amp; Fold
                    </h3>
                    <p className="font-[family-name:var(--font-poppins)] text-sm sm:text-[15px] text-navy/70 leading-relaxed">
                      We pick up, professionally wash, dry, and neatly fold your
                      everyday laundry — then deliver it back to your door
                      within 24 hours.
                    </p>
                  </div>
                  <div className="w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] shrink-0">
                    <Image
                      src="/images/commercial-icon.webp"
                      alt="Wash & Fold"
                      width={100}
                      height={100}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/80 space-y-2 mb-6 pl-0 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">&#10003;</span>
                    Free pickup &amp; delivery on every order
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">&#10003;</span>
                    24-hour turnaround guaranteed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">&#10003;</span>
                    Save up to 30% with a weekly plan
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">&#10003;</span>
                    No subscription required — pay as you go
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <ButtonLink href="/account/">
                    Schedule Pickup
                  </ButtonLink>
                  {resolvedShowPricing ? (
                    <ButtonLink href="/wash-fold" variant="outline">
                      View Pricing &amp; Details
                    </ButtonLink>
                  ) : null}
                </div>
              </div>

              {/* Right: pricing table */}
              {resolvedShowPricing ? (
                <div className="lg:w-[320px] shrink-0">
                  <div className="bg-cream/60 rounded-xl p-5 sm:p-6">
                    <p className="font-[family-name:var(--font-poppins)] text-xs font-body-medium uppercase tracking-wider text-navy/50 mb-4">
                      Pricing
                    </p>
                    <div className="space-y-3">
                      <PricingRow label="Weekly Plan" value="$1.95/lb" highlight />
                      <PricingRow label="Biweekly Plan" value="$2.15/lb" />
                      <PricingRow label="Pay As You Go" value="$2.99/lb" />
                    </div>
                    <div className="border-t border-navy/10 mt-4 pt-3">
                      <PricingRow label="Minimum Order" value="$40" />
                    </div>
                    <p className="font-[family-name:var(--font-poppins)] text-[11px] text-navy/40 mt-3">
                      Free pickup and delivery on all plans.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Three Secondary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Add-On Services */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col">
            <h3 className="text-lg font-heading-medium text-navy mb-2">
              Add-On Services
            </h3>
            <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/60 leading-relaxed mb-4">
              Per-pound upcharges added to your wash &amp; fold base rate.
              Separate these items in a different bag.
            </p>

            {resolvedShowPricing ? (
              <div className="space-y-2.5 mb-5 flex-1">
                <AddonRow label="Premium Care (Delicates)" value="+$0.55/lb" />
                <AddonRow label="Family Sorted + Hypoallergenic" value="+$0.30/lb" />
                <AddonRow label="Deep Clean (Heavily Soiled)" value="+$0.45/lb" />
              </div>
            ) : null}

            <ButtonLink href="/wash-fold" variant="outline" size="sm" className="w-full mt-auto">
              View Full Price List
            </ButtonLink>
          </div>

          {/* Specialty Wash & Fold */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col">
            <h3 className="text-lg font-heading-medium text-navy mb-2">
              Specialty Wash &amp; Fold
            </h3>
            <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/60 leading-relaxed mb-4 flex-1">
              We wash and fold oversized and specialty items including bed sets,
              comforters, tablecloths, coats, rugs, and more. Priced
              individually by item.
            </p>

            {resolvedShowPricing ? (
              <div className="space-y-2.5 mb-5">
                <AddonRow label="Comforter (Queen)" value="$35" />
                <AddonRow label="Comforter (King)" value="$40" />
                <AddonRow label="Bed Sheet Set" value="$20" />
              </div>
            ) : null}

            <ButtonLink href="/wash-fold" variant="outline" size="sm" className="w-full mt-auto">
              View Full Price List
            </ButtonLink>
          </div>

          {/* Dry Cleaning */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col">
            <h3 className="text-lg font-heading-medium text-navy mb-2">
              Dry Cleaning
            </h3>
            <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/60 leading-relaxed mb-4">
              Professional dry cleaning for suits, dresses, coats, and delicate
              fabrics. Picked up and delivered on your schedule.
            </p>

            {resolvedShowPricing ? (
              <div className="space-y-2.5 mb-5 flex-1">
                <AddonRow label="Pay As You Go" value="By Item" />
                <AddonRow label="Turnaround" value="4 Days" />
              </div>
            ) : null}

            <ButtonLink href="/account/" size="sm" className="w-full mt-auto">
              Schedule Pickup
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Helper components ── */

function PricingRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/70">
        {label}
      </span>
      <span
        className={`font-[family-name:var(--font-poppins)] text-sm font-body-medium whitespace-nowrap ${
          highlight ? "text-primary" : "text-navy"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function AddonRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="font-[family-name:var(--font-poppins)] text-xs text-navy/60">
        {label}
      </span>
      <span
        className={`font-[family-name:var(--font-poppins)] text-xs font-body-medium whitespace-nowrap ${
          highlight ? "text-primary" : "text-navy/80"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
