import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS } from "@/content/locations/index";
import { ZipChecker } from "@/components/home/ZipChecker";
import { ButtonLink, SectionHeader } from "@/components/shared";

const TIER1_LINKS: Record<string, { slug: string; label: string }> = {
  manhattan: { slug: "downtown-manhattan", label: "Downtown Manhattan" },
  queens: { slug: "astoria", label: "Astoria" },
  "essex-county": { slug: "the-oranges", label: "The Oranges" },
  "morris-county": { slug: "morristown", label: "Morristown" },
};

function getLocation(slug: string) {
  return LOCATIONS.find((loc) => loc.slug === slug);
}

export function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  const url = `https://wedeliverlaundry.com/service-areas/${location.slug}`;
  const title = `Laundry Pickup & Delivery in ${location.name}, ${location.state} | We Deliver Laundry`;
  const description = `Laundry pickup and delivery serving ${location.neighborhoods.join(", ")} and more in ${location.name}, ${location.state}. 24-hour turnaround. Starting at $1.95/lb.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function Tier2Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  const tier1 = TIER1_LINKS[slug];
  const phone = "+18559685511";

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DryCleaningOrLaundry",
            name: `We Deliver Laundry — ${location.name}`,
            description: `Laundry pickup and delivery in ${location.name}, ${location.state}.`,
            url: `https://wedeliverlaundry.com/service-areas/${location.slug}`,
            telephone: phone,
            areaServed: {
              "@type": location.state === "NY" ? "City" : "AdministrativeArea",
              name: location.name,
            },
            priceRange: "$1.95 - $2.70/lb",
          }),
        }}
      />

      {/* Header */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[900px]">
          <SectionHeader
            heading={`${location.name}, ${location.state}`}
            headingAs="h1"
            align="left"
            headingClassName="mb-3"
          />
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-6 max-w-[600px]">
            We offer laundry pickup and delivery across {location.name}.
            Free pickup, professional wash &amp; fold, and {location.state === "NY" ? "24" : "24"}-hour
            turnaround. Starting at $1.95/lb on the weekly plan.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/account/">Schedule Pickup</ButtonLink>
            <ButtonLink href="#zip" variant="outline">Check Your Zip Code</ButtonLink>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-14 lg:py-18">
        <div className="container-site max-w-[900px]">
          <SectionHeader
            eyebrow="Neighborhoods"
            heading={`Areas We Serve in ${location.name}`}
            headingClassName="mb-8"
          />
          <div className="max-w-[600px] mx-auto">
            <div className="bg-white rounded-2xl px-8 py-6 shadow-sm border border-navy/5">
              <ul className="columns-2 gap-8 font-[family-name:var(--font-poppins)] text-[15px] text-navy font-light tracking-[-0.03em]">
                {location.neighborhoods.map((area) => (
                  <li
                    key={area}
                    className="py-2.5 border-b border-navy/10 break-inside-avoid"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {tier1 && (
            <div className="mt-8 text-center">
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60 mb-3">
                Looking for detailed service info?
              </p>
              <ButtonLink href={`/${tier1.slug}`} variant="outline">
                {tier1.label} Service Details →
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      {/* Zip checker */}
      <section id="zip" className="bg-cream py-14 lg:py-20">
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <SectionHeader heading="Check if We Deliver to You" headingClassName="mb-4" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              Enter your zip code to see if we offer pickup and delivery in your area.
            </p>
            <ZipChecker />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-20">
        <div className="container-site max-w-[700px] text-center">
          <SectionHeader heading="Ready to Get Started?" headingClassName="mb-4" />
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
            Free pickup and delivery across {location.name}. Professional wash &amp; fold,
            back at your door in 24 hours.
          </p>
          <ButtonLink href="/account/">Schedule Pickup</ButtonLink>
        </div>
      </section>
    </>
  );
}
