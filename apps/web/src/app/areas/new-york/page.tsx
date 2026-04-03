import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFaqSchema, getServiceSchema } from "@/lib/schema";
import { AreaFAQ } from "../_components/area-faq";
import { ButtonLink, SectionHeader } from "@/components/shared";

const NY_FAQS = [
  {
    question: "Which New York City neighborhoods do you serve?",
    answer:
      "We serve all of Manhattan — from the Financial District and Tribeca up through Midtown, the Upper East Side, Upper West Side, Harlem, Washington Heights, and Inwood. We also serve parts of Brooklyn and Queens. Enter your zip code on our service areas page to confirm coverage.",
  },
  {
    question: "How much does laundry pickup and delivery cost in NYC?",
    answer:
      "We charge per pound with no delivery fees and no hidden charges. Pay As You Go is $2.99/lb, Biweekly Plan is $2.15/lb, and Weekly Plan is $1.95/lb. The minimum order is $40, which covers roughly 15–20 lbs.",
  },
  {
    question: "I live in a walk-up apartment. Do I need to come downstairs?",
    answer:
      "No. As long as we can access your building and your door, our driver will come directly to you. Many of our NYC customers live in walk-ups — we're used to it.",
  },
  {
    question: "What's the turnaround time for laundry in New York?",
    answer:
      "We guarantee 24-hour turnaround from pickup to delivery. You choose your delivery window when scheduling. Same-day pickup is available if you schedule before noon.",
  },
  {
    question: "Can I leave my laundry with my doorman or concierge?",
    answer:
      "Yes. Many of our Manhattan customers leave their laundry with the doorman or front desk. Just add a note to your order with pickup instructions and we'll coordinate directly.",
  },
  {
    question: "Do you serve Brooklyn and Queens?",
    answer:
      "Yes. We serve major neighborhoods in Brooklyn including Williamsburg, DUMBO, Brooklyn Heights, Park Slope, and more. In Queens, we serve Astoria, Long Island City, Sunnyside, and surrounding areas. Check our Brooklyn and Queens pages for full coverage details.",
  },
  {
    question: "What detergents do you use? Can I request specific products?",
    answer:
      "We use commercial-grade, hypoallergenic detergent by default. You can request fragrance-free, specific brands, or other preferences in your order notes and we'll accommodate them.",
  },
  {
    question: "How do I schedule my first pickup?",
    answer:
      "Visit our website and click Schedule Pickup, download the We Deliver Laundry app, or text us at (855) 968-5511. Your first order comes with a free laundry bag.",
  },
] as const;

const nyServiceSchema = getServiceSchema({
  serviceType: "Laundry Pickup and Delivery",
  description:
    "Professional laundry pickup and delivery service across New York City including Manhattan, Brooklyn, and Queens. 24-hour turnaround with free pickup and delivery.",
  url: "https://wedeliverlaundry.com/areas/new-york",
});

const nyFaqSchema = getFaqSchema(NY_FAQS);

export const metadata: Metadata = {
  title: "Laundry Pickup & Delivery in New York City | We Deliver Laundry",
  description:
    "NYC's trusted laundry pickup and delivery service. Serving Manhattan, Brooklyn, and Queens with 24-hour turnaround. From $1.95/lb, free delivery, no hidden fees. Schedule your first pickup today.",
  openGraph: {
    title: "NYC Laundry Pickup & Delivery | We Deliver Laundry",
    description:
      "Professional wash & fold across Manhattan, Brooklyn, and Queens. 24-hour turnaround, free pickup and delivery. From $1.95/lb.",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/areas/new-york",
  },
};

export default function NewYorkAreaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nyServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nyFaqSchema) }}
      />

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <SectionHeader eyebrow="New York City, NY" heading="Laundry Pickup & Delivery Across New York City" headingAs="h1" align="left" headingClassName="mb-4 leading-tight" />
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-5">
                New Yorkers don&apos;t have time to sit in a laundromat — and you
                shouldn&apos;t have to. We Deliver Laundry picks up your dirty
                clothes, washes and folds everything, and delivers it back to
                your door within 24 hours. No delivery fees, no subscriptions
                required. We serve Manhattan, Brooklyn, and Queens.
              </p>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy space-y-2.5 mb-7">
                {[
                  "From $1.95/lb — No Delivery Fees",
                  "24-Hour Turnaround Guaranteed",
                  "Walk-Up Friendly — We Come to Your Door",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                      <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/account/">
                  Schedule Pickup
                </ButtonLink>
                <ButtonLink href="/membership" variant="outline">
                  Learn More
                </ButtonLink>
              </div>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/service-areas-hero.jpg"
                alt="We Deliver Laundry driver with branded laundry bag on a New York City street"
                width={918}
                height={750}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why NYC Residents Choose Us */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="Built for NYC" heading="Why New Yorkers Choose Us" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-14">
            Between small apartments with no in-unit laundry, crowded
            laundromats, and long work hours, doing laundry in NYC is a chore
            most people dread. We built our service around the way New Yorkers
            actually live.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Door-to-Door in Walk-Ups",
                desc: "No elevator? No problem. Our drivers pick up and deliver directly at your apartment door — no need to carry bags down five flights of stairs.",
              },
              {
                title: "Doorman & Concierge Coordination",
                desc: "If you're not home, we'll work with your building's front desk. Just add pickup instructions to your order and we'll handle the rest.",
              },
              {
                title: "Flexible Scheduling",
                desc: "Morning, evening, or weekend — pick the time window that works for your schedule. Same-day pickup available before noon.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-cream rounded-xl px-6 py-8">
                <h3 className="text-lg font-heading-medium text-navy mb-3">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="Simple Pricing" heading="How Much Does It Cost?" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-10">
            We charge by the pound. No delivery fees, no hidden charges, no
            tipping required. Your price depends on how often you use us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            {[
              { plan: "Pay As You Go", price: "$2.99", unit: "/lb", note: "No commitment required" },
              { plan: "Biweekly Plan", price: "$2.15", unit: "/lb", note: "Pickup every 2 weeks" },
              { plan: "Weekly Plan", price: "$1.95", unit: "/lb", note: "Best value — weekly pickup" },
            ].map((tier) => (
              <div key={tier.plan} className="bg-white rounded-xl px-6 py-8 text-center shadow-sm">
                <p className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy/50 mb-2">
                  {tier.plan}
                </p>
                <p className="text-[2rem] font-body-medium text-navy mb-1">
                  {tier.price}
                  <span className="text-base font-normal text-navy/50">{tier.unit}</span>
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-xs text-navy/40">
                  {tier.note}
                </p>
              </div>
            ))}
          </div>
          <p className="font-[family-name:var(--font-poppins)] text-center text-xs text-navy/40 mt-6">
            $40 minimum order. Free pickup and delivery on all plans.
          </p>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader heading="NYC Neighborhoods We Serve" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-10">
            We cover Manhattan end to end, plus growing coverage in Brooklyn and
            Queens. Not sure if we reach you?{" "}
            <Link href="/service-areas" className="text-primary underline">
              Check your zip code
            </Link>
            .
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeighborhoodCard
              borough="Manhattan"
              areas={[
                "Financial District", "Tribeca", "SoHo", "Greenwich Village",
                "West Village", "Chelsea", "Flatiron", "Gramercy Park",
                "Midtown", "Hell\u2019s Kitchen", "Upper East Side",
                "Upper West Side", "Harlem", "Washington Heights", "Inwood",
              ]}
            />
            <NeighborhoodCard
              borough="Brooklyn"
              link="/brooklyn-laundry"
              areas={[
                "Williamsburg", "DUMBO", "Brooklyn Heights", "Park Slope",
                "Fort Greene", "Cobble Hill", "Greenpoint",
                "Bedford-Stuyvesant", "Crown Heights", "Downtown Brooklyn",
              ]}
            />
            <NeighborhoodCard
              borough="Queens"
              link="/queens-laundry"
              areas={[
                "Astoria", "Long Island City", "Sunnyside", "Woodside",
                "Jackson Heights", "Ridgewood",
              ]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="How It Works" heading="Three Steps, Clean Laundry" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-14">
            Schedule online, hand off your bag, and get everything back washed,
            folded, and ready to put away — within 24 hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "Step 1",
                image: "/images/step-1-schedule.jpg",
                alt: "Customer scheduling laundry pickup on a phone in a New York apartment",
                title: "Schedule Pickup",
                desc: "Choose a pickup and delivery window that fits your day. Available 7 days a week.",
              },
              {
                step: "Step 2",
                image: "/images/step-2-pickup.jpg",
                alt: "We Deliver Laundry branded bag at an NYC apartment door ready for pickup",
                title: "We Pick Up",
                desc: "Our driver comes to your door — walk-up, doorman building, or lobby drop-off. Your call.",
              },
              {
                step: "Step 3",
                image: "/images/step-3-deliver.jpg",
                alt: "We Deliver Laundry van delivering clean laundry in New York City",
                title: "We Deliver",
                desc: "Your laundry is washed, folded, and returned within 24 hours. Track your driver in real time.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <span className="inline-block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/50 mb-4">
                  {s.step}
                </span>
                <div className="mb-5 rounded-xl overflow-hidden">
                  <Image src={s.image} alt={s.alt} width={1200} height={660} className="w-full h-auto object-cover" />
                </div>
                <h3 className="text-xl font-heading-medium text-navy mb-2">{s.title}</h3>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[780px]">
          <SectionHeader heading="NYC Laundry Service FAQ" />
          <AreaFAQ faqs={NY_FAQS} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-14 lg:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}
      >
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <SectionHeader heading="Stop Wasting Your Weekends" headingClassName="mb-4" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              Thousands of New Yorkers already use We Deliver Laundry to get
              their time back. Schedule your first pickup and see why they
              never went back to the laundromat.
            </p>
            <ButtonLink href="/account/">
              Schedule Pickup
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function NeighborhoodCard({
  borough,
  link,
  areas,
}: {
  borough: string;
  link?: string;
  areas: string[];
}) {
  return (
    <div className="bg-cream rounded-xl px-6 py-6">
      <h3 className="text-lg font-heading-medium text-navy mb-4">{borough}</h3>
      <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 space-y-1.5 mb-4">
        {areas.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      {link && (
        <Link
          href={link}
          className="font-[family-name:var(--font-poppins)] text-sm text-primary font-body-medium hover:underline"
        >
          View {borough} details
        </Link>
      )}
    </div>
  );
}
