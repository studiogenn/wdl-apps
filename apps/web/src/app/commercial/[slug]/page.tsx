import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared";
import { ContactForm } from "./contact-form";
import { getCommercialPage, getAllCommercialSlugs } from "./data";

// ─── SSG ────────────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return getAllCommercialSlugs();
}

// ─── SEO ────────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getCommercialPage(slug);
  if (!data) return {};

  const url = `https://wedeliverlaundry.com/commercial/${data.slug}`;

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url,
      type: "website",
    },
  };
}

// ─── Icons ──────────────────────────────────────────────────────────────────
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-4 h-4"} viewBox="0 0 512 512" fill="currentColor">
      <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function SectionLabel({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "white" }) {
  return (
    <p
      className={`font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[2.5px] mb-3 ${
        color === "white" ? "text-white/45" : "text-primary"
      }`}
    >
      {children}
    </p>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function CommercialLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getCommercialPage(slug);
  if (!data) notFound();

  const phone = "+18559685511";

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Commercial Laundry Service",
            name: `We Deliver Laundry — ${data.vertical}`,
            description: data.metaDescription,
            url: `https://wedeliverlaundry.com/commercial/${data.slug}`,
            provider: {
              "@type": "DryCleaningOrLaundry",
              name: "We Deliver Laundry",
              url: "https://wedeliverlaundry.com",
              telephone: phone,
            },
            areaServed: [
              { "@type": "State", name: "New York" },
              { "@type": "State", name: "New Jersey" },
            ],
          }),
        }}
      />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden py-16 lg:py-24">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full border border-white/[0.08]" />
          <div className="absolute -top-20 -left-20 h-[450px] w-[450px] rounded-full border border-white/[0.06]" />
          <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-white/[0.04]" />
          <div className="absolute top-1/2 right-[15%] h-[350px] w-[350px] rounded-full border border-white/[0.06]" />
        </div>
        {/* Watermark monogram */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/monogram-white.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 h-[80%] w-auto opacity-[0.06] select-none"
        />

        <div className="container-site max-w-[1100px] relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
            {/* Left column */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-highlight" />
                <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[2.5px] text-white/60">
                  Commercial Laundry · NYC &amp; New Jersey
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 mb-8">
                <svg className="w-3.5 h-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span className="font-[family-name:var(--font-poppins)] text-[12px] font-medium text-white/80">
                  {data.vertical}
                </span>
              </div>

              <h1 className="text-[2.5rem] lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.05] mb-6 uppercase text-white">
                {data.h1}
              </h1>

              <p className="font-[family-name:var(--font-poppins)] text-[15px] leading-[25.5px] text-white/60 max-w-[520px] mb-8">
                {data.heroSubtitle}
              </p>

              {/* Pain point pills */}
              <div className="flex flex-wrap gap-2">
                {data.painPoints.map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3.5 py-1.5"
                  >
                    <CheckIcon className="w-3 h-3 text-highlight" />
                    <span className="font-[family-name:var(--font-poppins)] text-[12px] text-white/70">
                      {point}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — Get a Quote card */}
            <div className="w-full lg:w-[340px] shrink-0">
              <div className="rounded-2xl bg-primary border border-white/10 p-6">
                <p className="font-[family-name:var(--font-poppins)] text-[11px] font-bold uppercase tracking-[2px] text-white/70 mb-5">
                  Get a Quote
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { value: "24hr", label: "Turnaround" },
                    { value: "100%", label: "Local NYC & NJ" },
                    { value: "0", label: "Minimums" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <span className="font-[family-name:var(--font-inter)] inline-flex items-center justify-center h-8 min-w-[48px] rounded-md bg-white/10 px-2 text-[11px] font-bold text-white">
                        {stat.value}
                      </span>
                      <span className="font-[family-name:var(--font-poppins)] text-[13px] text-white/80">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="#contact"
                  className="font-[family-name:var(--font-inter)] block w-full rounded-full bg-highlight px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[1px] text-navy hover:bg-highlight/90 transition-colors"
                >
                  Get My {data.vertical.split(" ")[0]} Quote
                </Link>

                <p className="font-[family-name:var(--font-poppins)] text-[10px] text-white/35 text-center mt-3">
                  Free pickup · $1.95/lb weekly plan · No minimums
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAR ──────────────────────────────────────────────── */}
      <section className="bg-white border-b border-navy/10 py-8">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-0 sm:divide-x sm:divide-navy/10">
            {[
              { value: "24hr", label: "Turnaround" },
              { value: "$1.95", label: "Per lb (weekly)" },
              { value: "Free", label: "Pickup & Delivery" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-12 sm:px-16">
                <span className="text-[36px] font-bold text-primary leading-none">
                  {stat.value}
                </span>
                <span className="font-[family-name:var(--font-poppins)] text-[10px] uppercase tracking-[1.2px] text-navy/60 mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INTRO + PAIN POINTS ────────────────────────────────────── */}
      <section className="bg-cream py-[60px]">
        <div className="container-site max-w-[1100px]">
          <SectionLabel>About this service</SectionLabel>
          <h2 className="text-[28px] lg:text-[40px] font-bold text-navy leading-[44px] tracking-[0.3px] mb-6 uppercase">
            {data.vertical}
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-[15px] leading-[25.5px] text-navy/60 max-w-3xl mb-10">
            {data.introParagraph}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.painPoints.map((point) => (
              <div
                key={point}
                className="bg-white border-t-[3px] border-primary rounded-[10px] px-6 pt-[27px] pb-6"
              >
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="font-[family-name:var(--font-poppins)] text-[14px] font-bold text-navy leading-[22px]">
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="bg-white py-[60px]">
        <div className="container-site max-w-[1100px]">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-[28px] lg:text-[40px] font-bold text-navy leading-[44px] tracking-[0.3px] mb-10 uppercase">
            Simple. Reliable. Every Week.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "01", title: "Schedule your pickup", description: "Tell us your volume and preferred days. We build a recurring pickup route around your business." },
              { number: "02", title: "We pick up", description: "Our driver arrives on schedule and collects everything — linens, towels, uniforms, whatever you need washed." },
              { number: "03", title: "Professionally washed", description: "Every item cleaned without harsh chemicals, dried, and folded to a consistent commercial standard." },
              { number: "04", title: "Delivered back in 24hr", description: "Clean, folded, and ready for your next day of business. Same quality, every single time." },
            ].map((step) => (
              <div key={step.number} className="border-r border-navy/10 last:border-r-0 pr-6 last:pr-0">
                <span className="text-[36px] font-bold text-primary/10 leading-none">
                  {step.number}
                </span>
                <h3 className="font-[family-name:var(--font-poppins)] text-[15px] font-bold text-navy mt-3 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/60 leading-[21px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PRICING CTA ────────────────────────────────────────────── */}
      <section className="bg-cream py-[60px]">
        <div className="container-site max-w-[1100px] text-center">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="text-[28px] lg:text-[40px] font-bold text-navy leading-[44px] tracking-[0.3px] mb-6 uppercase">
            Custom Pricing for Your Business
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-[15px] text-navy/60 leading-relaxed max-w-xl mx-auto mb-8">
            {data.pricingCTA}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="#contact">
              Get a Custom Quote
            </ButtonLink>
            <ButtonLink href={`tel:${phone}`} variant="outline">
              Call 855.968.5511
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── 6. TESTIMONIAL ────────────────────────────────────────────── */}
      <section className="bg-white py-[60px]">
        <div className="container-site max-w-[1100px]">
          <SectionLabel>What our clients say</SectionLabel>
          <h2 className="text-[28px] lg:text-[40px] font-bold text-navy leading-[44px] tracking-[0.3px] mb-10 uppercase">
            Real Businesses. Real Results.
          </h2>
          <div className="max-w-2xl">
            <div className="bg-white border-t-[3px] border-primary rounded-[10px] p-8 border border-navy/10">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="font-[family-name:var(--font-poppins)] text-[15px] text-navy/60 leading-[25.5px] mb-6">
                &ldquo;{data.reviewQuote}&rdquo;
              </p>
              <div className="border-t border-navy/10 pt-4">
                <p className="font-[family-name:var(--font-poppins)] text-[13px] font-bold text-navy">
                  {data.reviewAuthor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-cream py-[60px]">
        <div className="container-site max-w-[1100px]">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-[28px] lg:text-[40px] font-bold text-navy leading-[44px] tracking-[0.3px] mb-10 uppercase">
            Frequently Asked
          </h2>
          <div className="max-w-2xl bg-white rounded-2xl p-8">
            <h3 className="font-[family-name:var(--font-poppins)] text-[15px] font-bold text-navy mb-3">
              {data.localFAQ_question}
            </h3>
            <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/60 leading-[21px]">
              {data.localFAQ_answer}
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. CONTACT FORM ───────────────────────────────────────────── */}
      <section id="contact" className="bg-primary py-[60px] lg:py-[80px]">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <SectionLabel color="white">Get started</SectionLabel>
              <h2 className="text-[28px] lg:text-[42px] font-bold text-white leading-[1.1] mb-4 uppercase">
                Tell Us About Your Business.
              </h2>
              <p className="font-[family-name:var(--font-poppins)] text-[15px] text-white/60 leading-[25.5px] max-w-md mb-8">
                Share details about your {data.vertical.toLowerCase()} operation and we&apos;ll build a custom laundry plan.
              </p>
              <ul className="space-y-3">
                {[
                  "Free, no-obligation quote",
                  "Response within 24 hours",
                  "Custom plan for your volume",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-[13px] text-white/70">
                    <CheckIcon className="w-4 h-4 text-highlight shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-[480px] shrink-0">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. COVERAGE ───────────────────────────────────────────────── */}
      <section className="bg-primary py-[60px] border-t border-white/10">
        <div className="container-site max-w-[1100px]">
          <SectionLabel color="white">Service area</SectionLabel>
          <h2 className="text-[28px] lg:text-[42px] font-bold text-white leading-[1.1] mb-4 uppercase">
            NYC &amp; NJ, Fully Covered.
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-[15px] text-white/60 leading-[25.5px] max-w-xl mb-8">
            {data.serviceArea}
          </p>
          <div className="flex flex-wrap gap-2">
            {["All NYC", "Bergen County", "Hudson County", "Essex County", "Morris County", "Union County", "Passaic County"].map((area, i) => (
              <span
                key={area}
                className={`font-[family-name:var(--font-poppins)] rounded-[14px] px-4 py-1.5 text-[12px] font-bold ${
                  i === 0
                    ? "bg-highlight text-primary"
                    : "bg-white/10 border border-white/[0.18] text-white/70"
                }`}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ─────────────────────────────────────────────── */}
      <section className="bg-cream py-[80px]">
        <div className="container-site max-w-[1100px] text-center">
          <h2 className="text-[28px] lg:text-[42px] font-bold text-navy leading-[1.1] mb-4 uppercase">
            {data.finalHeadline}
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-[15px] text-navy/60 leading-[25.5px] max-w-lg mx-auto mb-8">
            {data.finalSub}
          </p>
          <Link
            href="#contact"
            className="font-[family-name:var(--font-inter)] inline-flex items-center justify-center rounded-full bg-highlight px-8 py-3.5 text-[13px] font-bold uppercase tracking-[1px] text-navy hover:bg-highlight/90 transition-colors"
          >
            Schedule Your First Pickup
          </Link>
        </div>
      </section>
    </>
  );
}
