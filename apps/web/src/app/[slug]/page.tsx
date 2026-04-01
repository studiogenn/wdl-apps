import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocationPage, getAllLocationSlugs } from "./data";
import { LocationForm } from "./location-form";
import { ButtonLink } from "@/components/shared";

// ─── SSG ────────────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return getAllLocationSlugs();
}

// ─── SEO ────────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getLocationPage(slug);
  if (!data) return {};

  const url = `https://wedeliverlaundry.com/${data.slug}`;

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
function CheckSvg() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
      <polyline points="2,6 5,9 10,3" stroke="var(--color-highlight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarSvg() {
  return <span className="text-[13px] text-amber-500">★</span>;
}

function PinSvg() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3.2-4.5 8.5-4.5 8.5S3.5 9.2 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="var(--color-highlight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="1.4" fill="var(--color-highlight)" />
    </svg>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function LocationLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getLocationPage(slug);
  if (!data) notFound();

  const scheduleUrl = "/account/";
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
            name: `We Deliver Laundry — ${data.location}`,
            description: data.metaDescription,
            url: `https://wedeliverlaundry.com/${data.slug}`,
            telephone: phone,
            areaServed: {
              "@type": data.pageType === "nj" ? "AdministrativeArea" : "City",
              name: data.location,
            },
            priceRange: "$1.95 - $2.70/lb",
          }),
        }}
      />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden">
        {/* BG decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[100px] -right-[120px] w-[500px] h-[500px] rounded-full bg-light-blue/[0.09]" />
          <div className="absolute -bottom-[140px] -left-[80px] w-[400px] h-[400px] rounded-full bg-highlight/[0.05]" />
        </div>
        {/* Watermark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/monogram-white.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-[40%] object-contain object-right opacity-[0.05] select-none"
        />

        <div className="container-site max-w-[1200px] relative z-10 py-[60px] lg:py-[100px]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_480px] gap-12 items-center">
            {/* Left */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-highlight" />
                <span className="font-[family-name:var(--font-poppins)] text-[10px] font-semibold uppercase tracking-[2.5px] text-light-blue">
                  Serving {data.location}, {data.state === "NYC" ? "NY" : data.state}
                </span>
              </div>

              {/* Location badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/[0.18] rounded-full px-3.5 py-1.5 mb-5">
                <PinSvg />
                <span className="font-[family-name:var(--font-poppins)] text-[11px] font-medium text-white">
                  {data.location} · {data.pageType === "nyc" ? "New York" : "New Jersey"}
                </span>
              </div>

              {/* H1 */}
              <h1 className="text-[40px] md:text-[48px] lg:text-[58px] xl:text-[64px] font-bold text-white leading-[1.02] uppercase tracking-[0.3px] mb-[18px]">
                {data.h1.includes("—") ? (
                  <>
                    {data.h1.split("—")[0]}—<br />
                    <span className="text-highlight">{data.h1.split("—")[1]}</span>
                  </>
                ) : data.h1.includes(".") && data.h1.split(".").length > 2 ? (
                  <>
                    {data.h1.split(".").slice(0, -2).join(".") + "."}<br />
                    <span className="text-highlight">{data.h1.split(".").slice(-2).join(".").trim()}</span>
                  </>
                ) : (
                  <>{data.h1}</>
                )}
              </h1>

              {/* Subtitle */}
              <p className="font-[family-name:var(--font-poppins)] text-[15px] md:text-[17px] text-white/75 leading-[1.7] mb-7 max-w-[520px]">
                {data.heroSubtitle}
              </p>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-7">
                {["Free pickup & delivery", "24-hour turnaround", "No harsh chemicals", "$1.95/lb weekly plan"].map((pill) => (
                  <span key={pill} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/[0.18] rounded-[14px] px-3.5 py-1.5">
                    <CheckSvg />
                    <span className="font-[family-name:var(--font-poppins)] text-[12px] text-white">{pill}</span>
                  </span>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="md:hidden">
                <ButtonLink href={scheduleUrl} className="block w-full bg-highlight text-primary text-center font-bold text-[14px] uppercase tracking-[1.8px] py-[17px] rounded-[4px] mb-2.5 hover:bg-highlight">
                  Schedule My First Pickup
                </ButtonLink>
                <a href="#how-it-works" className="block w-full text-center border border-white/[0.22] text-white/65 text-[14px] py-[13px] rounded-[4px] mb-3">
                  See how it works →
                </a>
                <p className="font-[family-name:var(--font-poppins)] text-[11px] text-white/[0.42] text-center">
                  Starting at <strong className="text-white/85">$1.95/lb</strong> · Weekly plan · Save 28%
                </p>
              </div>
            </div>

            {/* Right — Hero card (desktop) */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-full max-w-[400px] bg-white/[0.07] border border-white/[0.14] rounded-2xl p-7 backdrop-blur-sm">
                <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[2px] text-light-blue mb-4">
                  How it works
                </p>
                <div className="flex flex-col gap-3.5 mb-5">
                  {[
                    { n: "1", bold: "Schedule pickup", text: "Book online — takes 2 minutes." },
                    { n: "2", bold: "We pick up", text: `From your building in ${data.location}.` },
                    { n: "3", bold: "We wash & fold", text: "No harsh chemicals. Perfect folds." },
                    { n: "4", bold: "Back in 24 hours", text: "Delivered to your door." },
                  ].map((s) => (
                    <div key={s.n} className="flex items-start gap-3">
                      <span className="w-[26px] h-[26px] rounded-full bg-highlight text-primary text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {s.n}
                      </span>
                      <p className="font-[family-name:var(--font-poppins)] text-[13px] text-white/80 leading-[1.5]">
                        <strong className="text-white font-semibold">{s.bold}</strong>
                        <br />{s.text}
                      </p>
                    </div>
                  ))}
                </div>
                <ButtonLink
                  href={scheduleUrl}
                  className="block w-full bg-highlight text-primary text-center font-bold text-[13px] uppercase tracking-[1.5px] py-[15px] rounded-[4px] hover:bg-highlight"
                >
                  Schedule My First Pickup
                </ButtonLink>
                <p className="font-[family-name:var(--font-poppins)] text-[10px] text-white/35 text-center mt-2.5">
                  Starting at $1.95/lb · Free pickup &amp; delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF BAR ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-navy/10 py-4">
        <div className="container-site max-w-[1200px] flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <StarSvg key={i} />)}
          </div>
          <span className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/60 font-medium">4.9 · 200+ happy customers</span>
          <div className="hidden sm:block w-px h-[22px] bg-navy/10" />
          <span className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/60 font-medium">24-hour turnaround</span>
          <div className="hidden sm:block w-px h-[22px] bg-navy/10" />
          <span className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/60 font-medium">Free pickup &amp; delivery</span>
          <div className="hidden sm:block w-px h-[22px] bg-navy/10" />
          <span className="font-[family-name:var(--font-poppins)] text-[12px] text-navy/60 font-medium">100% local NYC &amp; NJ</span>
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white py-[60px]">
        <div className="container-site max-w-[1200px]">
          <span className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-primary uppercase tracking-[2.5px] block mb-2">How it works</span>
          <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-bold text-navy uppercase tracking-[0.3px] leading-[1.1] mb-7">
            Three steps.<br />Zero hassle.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              { n: "01", title: "Schedule your pickup", body: `Book online or via the app. We pick up right from your building in ${data.location} — at your door, on your schedule.` },
              { n: "02", title: "We handle everything", body: "Professional wash, dry & fold. Gentle detergents — no harsh chemicals. Every item treated with care." },
              { n: "03", title: "Delivered back in 24 hours", body: `Perfectly folded, back at your ${data.location} door the next day. Repeat weekly and save 28%.` },
              { n: "04", title: "Sit back & relax", body: "Seriously. That's it. Your laundry is done. Your time is yours again." },
            ].map((step, i) => (
              <div key={step.n} className={`py-7 lg:py-0 lg:pr-10 ${i < 3 ? "border-b lg:border-b-0 lg:border-r border-navy/10 lg:mr-10" : ""}`}>
                <div className="text-[36px] font-bold leading-none mb-3" style={{ color: "transparent", WebkitTextStroke: "1.5px var(--color-primary)" }}>
                  {step.n}
                </div>
                <h3 className="font-[family-name:var(--font-poppins)] text-[15px] font-bold text-navy mb-1.5">{step.title}</h3>
                <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/60 leading-[1.6]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-cream py-[60px]">
        <div className="container-site max-w-[1200px]">
          <span className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-primary uppercase tracking-[2.5px] block mb-2 text-center">Pricing</span>
          <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-bold text-navy uppercase tracking-[0.3px] leading-[1.1] mb-7 text-center">
            Simple.<br />Per-pound.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Weekly */}
            <div className="relative bg-white border-2 border-primary rounded-[10px] p-7">
              <div className="absolute -top-px right-5 bg-primary text-white font-[family-name:var(--font-poppins)] text-[9px] font-bold uppercase tracking-[1.2px] px-3.5 py-1.5 rounded-b-lg">
                Most popular
              </div>
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[1.8px] text-navy/50 mb-2.5">Weekly Plan</p>
              <p className="text-[48px] font-bold text-primary leading-none">$1.95</p>
              <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/50 mt-1.5 mb-5">per pound · recurring weekly pickup</p>
              <div className="flex flex-col gap-2.5">
                {["Free pickup & delivery", "Priority scheduling", "Consistent weekly driver", "Save 28% vs pay-as-you-go", "Cancel anytime"].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-[12px] text-navy/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
            {/* Pay as you go */}
            <div className="bg-white border-[1.5px] border-navy/10 rounded-[10px] p-7">
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[1.8px] text-navy/60 mb-2.5">Pay as you go</p>
              <p className="text-[48px] font-bold text-navy leading-none">$2.70</p>
              <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/50 mt-1.5 mb-5">per pound · no commitment required</p>
              <div className="flex flex-col gap-2.5">
                {["Free pickup & delivery", "Schedule anytime", "No subscription required", "Same 24-hr turnaround"].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-[12px] text-navy/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy/50 shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
            {/* Subscription Plan */}
            <div className="bg-white border-[1.5px] border-navy/10 rounded-[10px] p-7">
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold uppercase tracking-[1.8px] text-navy/60 mb-2.5">Subscription Plan</p>
              <p className="text-[48px] font-bold text-navy leading-none">$30.99</p>
              <p className="font-[family-name:var(--font-poppins)] text-[13px] text-navy/50 mt-1.5 mb-5">starting per bag · personalized weekly or biweekly service</p>
              <div className="flex flex-col gap-2.5">
                {["Customized to your laundry needs", "Weekly or biweekly pickup options", "Lower price per bag vs pay-as-you-go", "Free pickup & delivery", "24-hour turnaround", "Cancel or adjust anytime"].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 font-[family-name:var(--font-poppins)] text-[12px] text-navy/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy/50 shrink-0" />
                    {perk}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <ButtonLink
                  href="/subscription"
                  className="block text-center font-bold text-[11px] uppercase tracking-[1.4px] py-3 px-6 rounded-[4px] hover:scale-105 transition-transform duration-300"
                >
                  Get My Plan
                </ButtonLink>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <ButtonLink
              href={scheduleUrl}
              className="group relative inline-block overflow-hidden font-bold text-[13px] uppercase tracking-[1.6px] py-4 px-10 rounded-[4px] animate-pulse-glow hover:scale-105 transition-transform duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-btn" />
              <span className="relative">Schedule My Pickup →</span>
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────────────── */}
      <section className="bg-white py-[60px]">
        <div className="container-site max-w-[1200px]">
          <span className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-primary uppercase tracking-[2.5px] block mb-2">What people say</span>
          <h2 className="text-[28px] md:text-[34px] lg:text-[40px] font-bold text-navy uppercase tracking-[0.3px] leading-[1.1] mb-7">
            Real people.<br />Real results.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <article className="bg-white border border-navy/10 rounded-[10px] p-6 flex flex-col">
              <div className="flex gap-0.5 mb-2.5">{Array.from({ length: 5 }).map((_, i) => <StarSvg key={i} />)}</div>
              <p className="font-[family-name:var(--font-poppins)] text-[14px] text-navy leading-[1.7] italic mb-3.5 flex-1">
                &ldquo;{data.reviewQuote}&rdquo;
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-primary uppercase tracking-[0.8px]">
                — {data.reviewAuthor}
              </p>
            </article>
            <article className="bg-white border border-navy/10 rounded-[10px] p-6 flex flex-col">
              <div className="flex gap-0.5 mb-2.5">{Array.from({ length: 5 }).map((_, i) => <StarSvg key={i} />)}</div>
              <p className="font-[family-name:var(--font-poppins)] text-[14px] text-navy leading-[1.7] italic mb-3.5 flex-1">
                &ldquo;The weekly plan is a game changer. Same time every week, always on time, always perfect folds. My whole building has signed up.&rdquo;
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-primary uppercase tracking-[0.8px]">
                — Happy Customer, {data.location}
              </p>
            </article>
            <article className="bg-white border border-navy/10 rounded-[10px] p-6 flex flex-col">
              <div className="flex gap-0.5 mb-2.5">{Array.from({ length: 5 }).map((_, i) => <StarSvg key={i} />)}</div>
              <p className="font-[family-name:var(--font-poppins)] text-[14px] text-navy leading-[1.7] italic mb-3.5 flex-1">
                &ldquo;I was spending every Sunday at the laundromat. Now I schedule a pickup and it comes back perfectly folded the next day. Best decision I&apos;ve made all year.&rdquo;
              </p>
              <p className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-primary uppercase tracking-[0.8px]">
                — Weekly Subscriber, {data.state}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── ZONE / SERVICE AREA ────────────────────────────────────────── */}
      <section className="bg-primary">
        <div className="container-site max-w-[1200px] py-[70px] lg:py-[80px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="font-[family-name:var(--font-poppins)] text-[10px] font-bold text-white/45 uppercase tracking-[2.5px] block mb-2.5">Service area</span>
              <h2 className="text-[30px] md:text-[36px] lg:text-[42px] font-bold text-white uppercase leading-[1.1] mb-3.5">
                We pick up right<br />from your block.
              </h2>
              <p className="font-[family-name:var(--font-poppins)] text-[15px] text-white/60 leading-[1.7] mb-6">
                {data.zoneCopy}
              </p>
              <div className="flex flex-wrap gap-2">
                {data.neighborhoods.map((n, i) => (
                  <span
                    key={n}
                    className={`font-[family-name:var(--font-poppins)] text-[12px] rounded-[14px] px-3.5 py-1.5 ${
                      i === 0
                        ? "bg-highlight text-primary font-bold border border-highlight"
                        : "bg-white/10 border border-white/[0.18] text-white/70"
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <LocationForm location={data.location} slug={data.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="bg-white py-[90px]">
        <div className="container-site max-w-[1200px] text-center">
          <h2 className="text-[36px] md:text-[44px] lg:text-[56px] font-bold text-primary uppercase tracking-[0.3px] leading-[1.08] mb-3.5">
            {data.finalHeadline}
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-[15px] md:text-[17px] text-navy/60 leading-[1.7] max-w-[560px] mx-auto mb-9">
            {data.finalSub}
          </p>
          <ButtonLink
            href={scheduleUrl}
            className="inline-block font-bold text-[14px] uppercase tracking-[2px] py-[18px] px-[44px] rounded-[4px] mb-6"
          >
            Schedule My First Pickup
          </ButtonLink>
          <div className="flex justify-center flex-wrap gap-5">
            {["No commitment", "Free pickup", "24-hr turnaround", "100% local"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 font-[family-name:var(--font-poppins)] text-[11px] text-navy/40">
                <span className="w-[3px] h-[3px] rounded-full bg-primary/35" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
