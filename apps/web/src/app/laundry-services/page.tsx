import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSeoMetadata } from "@/lib/seo";
import { SchemaRenderer } from "@/components/seo/schema-renderer";
import { getServiceSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/laundry-services");
}

export default function LaundryServicesPage() {
  return (
    <>
      <SchemaRenderer
        path="/laundry-services"
        defaultSchemas={[
          getServiceSchema({
            serviceType: "Laundry Service",
            description:
              "Professional laundry pickup and delivery services including wash & fold, dry cleaning, and commercial laundry with 24-hour turnaround.",
            url: "https://wedeliverlaundry.com/laundry-services",
          }),
        ]}
      />
      {/* Hero */}
      <section className="bg-light-blue py-16 lg:py-20">
        <div className="container-site max-w-[1100px] text-center">
          <h1 className="text-[2rem] lg:text-[2.625rem] font-medium text-navy mb-3 uppercase">
            Laundry Made Simple
          </h1>
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-2xl mx-auto">
            Easy scheduling, fast turnaround, and clean clothes delivered back,
            without the headache.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <h2 className="text-center text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] font-normal tracking-[0.84px] text-navy mb-3 uppercase">
            Choose the Laundry Service That Fits Your Needs
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-12">
            Compare our wash &amp; fold, dry cleaning, and commercial laundry
            services to find the right option for you.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ServiceCard
              icon="/images/commercial-icon.webp"
              title="Wash & Fold"
              description="We professionally clean, dry, and neatly fold your clothes. Priced by the pound with a $40 minimum order. 24 hour turnaround."
              stat1Label="Minimum Order"
              stat1Value="$40"
              stat2Label="Turnaround"
              stat2Value="24 Hours"
              primaryHref="/account/"
              primaryLabel="Schedule A Pickup"
              secondaryHref="/wash-fold"
              secondaryLabel="View Pricing & Details"
            />
            <ServiceCard
              icon="/images/wash-fold-icon.webp"
              title="Dry Cleaning"
              description="Professional dry cleaning services with free pickup and delivery. $50 minimum order. 3 day turnaround."
              stat1Label="Minimum Order"
              stat1Value="$50"
              stat2Label="Turnaround"
              stat2Value="3 Days"
              primaryHref="/account/"
              primaryLabel="Schedule A Pickup"
              secondaryHref="/dry-cleaning"
              secondaryLabel="View Pricing & Details"
            />
            <ServiceCard
              icon="/images/laundry-icon.webp"
              title="Commercial Laundry"
              description="Dependable commercial laundry solutions for businesses of all sizes."
              stat1Label="Pricing"
              stat1Value="Volume-based"
              stat2Label="Get Started"
              stat2Value="Request a Quote"
              primaryHref="/account/"
              primaryLabel="Schedule A Pickup"
              secondaryHref="/commercial-laundry"
              secondaryLabel="Request a Quote"
            />
          </div>
        </div>
      </section>

      {/* Explore Services */}
      <section className="bg-light-blue py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <h2 className="text-center text-[2rem] lg:text-[2.625rem] font-medium text-navy mb-14 uppercase">
            Explore Our Laundry Services
          </h2>

          <div className="bg-white rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10 mb-8">
            <div className="flex-1">
              <h3 className="text-[1.5rem] lg:text-[1.75rem] font-medium text-navy mb-2">
                Wash &amp; Fold Services
              </h3>
              <p className="text-lg text-navy/50 mb-3">
                Laundry pickup and delivery, done right.
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed mb-6">
                We professionally clean, dry, and neatly fold your clothes,
                ready within 24 hours.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/account/"
                  className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
                >
                  Schedule Pick-up
                </Link>
                <Link
                  href="/wash-fold"
                  className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-[350px] shrink-0 rounded-xl overflow-hidden">
              <Image
                src="/images/wash-fold-hero.png"
                alt="Professional wash and fold laundry service"
                width={940}
                height={517}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-[1.5rem] lg:text-[1.75rem] font-medium text-navy mb-2">
                Commercial Laundry Services
              </h3>
              <p className="text-lg text-navy/50 mb-3">
                Laundry solutions for your business.
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed mb-6">
                Dependable commercial laundry for businesses that need
                consistent, high-volume service.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/commercial-laundry/#get-a-quote"
                  className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/commercial-laundry"
                  className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-[350px] shrink-0 rounded-xl overflow-hidden">
              <Image
                src="/images/commercial-hero.png"
                alt="Commercial laundry service for businesses"
                width={940}
                height={517}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-light-blue py-14">
        <div className="container-site max-w-[1100px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-14 text-center max-w-[750px] mx-auto">
            <h2 className="text-[1.75rem] lg:text-[2.625rem] font-medium text-black mb-3">
              Ready to Get Started?
            </h2>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 max-w-md mx-auto mb-7 leading-relaxed">
              From easy scheduling to reliable 24-hour delivery, we&apos;ve
              built a laundry service that fits into your life instead of taking
              over it.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/account/"
                className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
              >
                Schedule Pick-up
              </Link>
              <Link
                href="/wash-fold"
                className="font-[family-name:var(--font-inter)] px-6 py-2.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  stat1Label,
  stat1Value,
  stat2Label,
  stat2Value,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  icon: string;
  title: string;
  description: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="bg-light-blue rounded-2xl p-7 lg:p-9">
      <div className="flex flex-row items-start gap-5 mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[1.5rem] lg:text-[1.75rem] font-medium text-navy mb-2">
            {title}
          </h3>
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="w-[100px] h-[100px] shrink-0">
          <Image
            src={icon}
            alt={title}
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="border-t border-divider my-4" />
      <div className="space-y-2.5 mb-5">
        <div className="flex justify-between items-center">
          <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/70">
            {stat1Label}
          </span>
          <span className="font-[family-name:var(--font-poppins)] text-sm font-semibold text-navy">
            {stat1Value}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/70">
            {stat2Label}
          </span>
          <span className="font-[family-name:var(--font-poppins)] text-sm font-semibold text-navy">
            {stat2Value}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="font-[family-name:var(--font-inter)] px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="font-[family-name:var(--font-inter)] px-5 py-2.5 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition-colors"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
