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

        {/* ── Wash & Fold ── */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 lg:mb-8 p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <h3 className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] font-heading-medium text-navy mb-2">
              Wash &amp; Fold
            </h3>
            <p className="font-[family-name:var(--font-poppins)] text-sm sm:text-[15px] text-navy/70 leading-relaxed max-w-2xl">
              We pick up, professionally wash, dry, and neatly fold your
              everyday laundry — then deliver it back to your door within 24 hours.
            </p>
          </div>

          <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/80 flex flex-wrap gap-x-6 gap-y-2 mb-8 pl-0 list-none">
            <li className="flex items-center gap-2">
              <span className="text-primary shrink-0" aria-hidden="true">&#10003;</span>
              Free pickup &amp; delivery
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary shrink-0" aria-hidden="true">&#10003;</span>
              24-hour turnaround
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary shrink-0" aria-hidden="true">&#10003;</span>
              Save over 40% with membership
            </li>
          </ul>

          {/* ── Membership plan cards ── */}
          {resolvedShowPricing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Weekly */}
                <div className="relative border-2 border-primary rounded-xl p-5 sm:p-6">
                  <div className="absolute -top-3 left-5">
                    <span className="inline-block bg-primary text-white text-[11px] font-body-medium tracking-wide uppercase px-3 py-1 rounded-full">
                      Best Value
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-poppins)] text-xs font-body-medium uppercase tracking-wider text-navy/50 mb-3 mt-1">
                    Weekly Plan
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[2rem] font-heading-medium text-navy leading-none">$139</span>
                    <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/50">/mo</span>
                  </div>
                  <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/60 mb-4">
                    Up to 4 pickups · 80 lbs included
                  </p>
                  <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/40 mb-4">
                    Overage at $1.95/lb · Effective rate $1.74/lb
                  </p>
                  <ButtonLink href="/join" className="w-full">
                    Get Started
                  </ButtonLink>
                </div>

                {/* Family */}
                <div className="border border-navy/10 rounded-xl p-5 sm:p-6">
                  <p className="font-[family-name:var(--font-poppins)] text-xs font-body-medium uppercase tracking-wider text-navy/50 mb-3 mt-1">
                    Family Plan
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[2rem] font-heading-medium text-navy leading-none">$189</span>
                    <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/50">/mo</span>
                  </div>
                  <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/60 mb-4">
                    Up to 4 pickups · 120 lbs included
                  </p>
                  <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/40 mb-4">
                    Overage at $1.95/lb · Effective rate $1.58/lb
                  </p>
                  <ButtonLink href="/join" variant="outline" className="w-full">
                    Get Started
                  </ButtonLink>
                </div>
              </div>

              {/* PAYG */}
              <div className="border border-dashed border-navy/15 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                    Pay As You Go
                  </p>
                  <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/60">
                    No commitment — just $2.95/lb when you need it
                  </p>
                  <p className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/40 mt-1">
                    Deep Clean available +$0.45/lb
                  </p>
                </div>
                <ButtonLink href="/account/" variant="outline" className="shrink-0">
                  Schedule Pickup
                </ButtonLink>
              </div>
            </>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/account/">Schedule Pickup</ButtonLink>
              <ButtonLink href="/pricing" variant="outline">View Pricing</ButtonLink>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

