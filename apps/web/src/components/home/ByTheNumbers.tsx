import type { ByTheNumbersConfig } from "@/lib/section-defaults";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHeader } from "@/components/shared/section-header";

const DEFAULTS = {
  heading: "Proven Laundry Pickup & Delivery You Can Trust",
  subheading:
    "We don't love bragging, but the numbers speak for themselves. Fast turnaround times, thousands of happy customers, and mountains of laundry cleaned and delivered across New York City and New Jersey.",
  eyebrow: "By The Numbers",
};

export function ByTheNumbers({ config }: { config?: ByTheNumbersConfig }) {
  const heading = config?.heading ?? DEFAULTS.heading;
  const subheading = config?.subheading ?? DEFAULTS.subheading;
  const eyebrow = config?.eyebrow ?? DEFAULTS.eyebrow;

  return (
    <section className="bg-cream py-16 lg:py-20">
      <div className="container-site max-w-[1100px]">
        <SectionHeader eyebrow={eyebrow} heading={heading} description={subheading} size="lg" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            icon={<ClockIcon />}
            value="24 Hour"
            label="Delivery Guarantee"
          />
          <StatCard
            icon={<SmileIcon />}
            value="9,000+"
            label="Happy Customers"
          />
          <StatCard
            icon={<LaundryIcon />}
            value="1,000,000+"
            label="Lbs of Laundry Cleaned"
          />
        </div>
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function LaundryIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="12" cy="13" r="5" />
      <path d="M12 8c1.5 1 2.5 2.5 2.5 5s-1 4-2.5 5" />
      <line x1="6" y1="5" x2="6.01" y2="5" />
      <line x1="10" y1="5" x2="10.01" y2="5" />
    </svg>
  );
}
