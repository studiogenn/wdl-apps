import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFaqSchema, getServiceSchema } from "@/lib/schema";
import { AreaFAQ } from "../_components/area-faq";
import { ButtonLink, SectionHeader } from "@/components/shared";
import { CustomPlanBanner } from "@/components/home/CustomPlanBanner";

const NJ_FAQS = [
  {
    question: "Which New Jersey counties do you serve?",
    answer:
      "We serve Bergen, Essex, Hudson, Morris, Union, and Passaic Counties. This includes major towns like Jersey City, Hoboken, Newark, Montclair, Morristown, Westfield, and dozens more. Enter your zip code on our service areas page to confirm coverage.",
  },
  {
    question: "How much does laundry pickup and delivery cost in New Jersey?",
    answer:
      "We charge per pound with no delivery fees and no hidden charges. Pay As You Go is $2.99/lb, Biweekly Plan is $2.15/lb, and Weekly Plan is $1.95/lb. The minimum order is $40, which covers roughly 15–20 lbs.",
  },
  {
    question: "Do you pick up from houses and apartments?",
    answer:
      "Yes, we pick up from single-family homes, apartments, condos, and townhouses. Leave your laundry at the door, on the porch, or hand it off directly — whatever works for you.",
  },
  {
    question: "What's the turnaround time for laundry in New Jersey?",
    answer:
      "We guarantee 24-hour turnaround from pickup to delivery. You choose your delivery window when scheduling. Same-day pickup is available if you schedule before noon.",
  },
  {
    question: "Do you serve commercial and business customers in NJ?",
    answer:
      "Yes. We serve restaurants, salons, Airbnb hosts, gyms, and other businesses across New Jersey with custom volume pricing. Contact us at (855) 968-5511 or visit our commercial page for details.",
  },
  {
    question: "Is pickup and delivery really free?",
    answer:
      "Yes. We only charge per pound — there are no delivery fees, no pickup fees, and no surcharges. The price you see is the price you pay.",
  },
  {
    question: "Can I choose my detergent or request special handling?",
    answer:
      "Absolutely. We use hypoallergenic, commercial-grade detergent by default. You can request fragrance-free, specific brands, or cold-wash-only in your order notes.",
  },
  {
    question: "How do I schedule my first pickup?",
    answer:
      "Visit our website and click Schedule Pickup, download the We Deliver Laundry app, or text us at (855) 968-5511. Your first order comes with a free laundry bag.",
  },
] as const;

const njServiceSchema = getServiceSchema({
  serviceType: "Laundry Pickup and Delivery",
  description:
    "Professional laundry pickup and delivery service across New Jersey including Bergen, Essex, Hudson, Morris, Union, and Passaic Counties. 24-hour turnaround with free pickup and delivery.",
  url: "https://wedeliverlaundry.com/areas/new-jersey",
});

const njFaqSchema = getFaqSchema(NJ_FAQS);

export const metadata: Metadata = {
  title: "Laundry Pickup & Delivery in New Jersey | We Deliver Laundry",
  description:
    "New Jersey's trusted laundry pickup and delivery service. Serving Bergen, Essex, Hudson, Morris, Union, and Passaic Counties. 24-hour turnaround, from $1.95/lb, free delivery.",
  openGraph: {
    title: "New Jersey Laundry Pickup & Delivery | We Deliver Laundry",
    description:
      "Professional wash & fold across 6 NJ counties. 24-hour turnaround, free pickup and delivery. From $1.95/lb.",
  },
  alternates: {
    canonical: "https://wedeliverlaundry.com/areas/new-jersey",
  },
};

export default function NewJerseyAreaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(njServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(njFaqSchema) }}
      />

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <SectionHeader eyebrow="New Jersey" heading="Laundry Pickup & Delivery Across New Jersey" headingAs="h1" align="left" headingClassName="mb-4 leading-tight" />
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-5">
                Whether you&apos;re in a Jersey City high-rise, a Montclair
                colonial, or a Morristown townhouse — we pick up your laundry,
                wash and fold everything, and deliver it back within 24 hours.
                We serve six counties across North and Central Jersey with no
                delivery fees and no subscription required.
              </p>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy space-y-2.5 mb-7">
                {[
                  "From $1.95/lb — No Delivery Fees",
                  "24-Hour Turnaround Guaranteed",
                  "Houses, Apartments, Condos — We Come to You",
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
                alt="We Deliver Laundry driver with branded laundry bag in a New Jersey neighborhood"
                width={918}
                height={750}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why NJ Residents Choose Us */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="Built for New Jersey" heading="Why New Jersey Residents Choose Us" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-14">
            Between commuting into the city and running a household, the last
            thing you need is another errand. We handle the laundry so you can
            spend your evenings and weekends on what matters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Porch & Door Pickup",
                desc: "Leave your bag on the porch, at the side door, or in the garage — whatever's easiest. Our drivers follow your instructions exactly.",
              },
              {
                title: "Family-Sized Loads Welcome",
                desc: "No cap on how much you can send. Families across Bergen, Morris, and Essex Counties use us weekly to handle the whole household's laundry in one pickup.",
              },
              {
                title: "Fits the Commuter Schedule",
                desc: "Schedule pickup for after you leave in the morning and delivery for when you get home. We work around the NJ Transit schedule, not the other way around.",
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

      <CustomPlanBanner />

      {/* Counties We Serve */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader heading="New Jersey Counties We Serve" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-10">
            Coverage across six counties and growing. Not sure if we reach you?{" "}
            <Link href="/service-areas" className="text-primary underline">
              Check your zip code
            </Link>
            .
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CountyCard
              county="Hudson County"
              link="/north-jersey-laundry"
              towns={["Jersey City", "Hoboken", "Union City", "West New York", "Bayonne", "North Bergen", "Secaucus", "Weehawken"]}
            />
            <CountyCard
              county="Bergen County"
              link="/north-jersey-laundry"
              towns={["Hackensack", "Fort Lee", "Teaneck", "Englewood", "Paramus", "Ridgewood", "Fair Lawn", "Bergenfield"]}
            />
            <CountyCard
              county="Essex County"
              link="/north-jersey-laundry"
              towns={["Newark", "Montclair", "Bloomfield", "East Orange", "West Orange", "Orange", "Irvington", "Nutley"]}
            />
            <CountyCard
              county="Morris County"
              link="/morris-county-laundry"
              towns={["Morristown", "Parsippany", "Denville", "Randolph", "Dover", "Madison", "Chatham", "Florham Park"]}
            />
            <CountyCard
              county="Union County"
              towns={["Elizabeth", "Union", "Cranford", "Westfield", "Summit", "Linden", "Rahway", "Plainfield"]}
            />
            <CountyCard
              county="Passaic County"
              towns={["Paterson", "Passaic", "Clifton", "Wayne", "Totowa", "Little Falls", "Woodland Park", "Pompton Lakes"]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="How It Works" heading="Three Steps, Clean Laundry" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-14">
            Schedule online, leave your bag out, and get everything back washed,
            folded, and ready to put away — within 24 hours.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "Step 1",
                image: "/images/step-1-schedule.jpg",
                alt: "Customer scheduling laundry pickup on a phone in a New Jersey home",
                title: "Schedule Pickup",
                desc: "Choose a pickup and delivery window that fits your day. Available 7 days a week across all six counties.",
              },
              {
                step: "Step 2",
                image: "/images/step-2-pickup.jpg",
                alt: "We Deliver Laundry branded bag on a New Jersey front porch ready for pickup",
                title: "We Pick Up",
                desc: "Leave your bag at the door, porch, or garage. Our driver picks it up and follows your instructions.",
              },
              {
                step: "Step 3",
                image: "/images/step-3-deliver.jpg",
                alt: "We Deliver Laundry van delivering clean laundry in a New Jersey neighborhood",
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
          <SectionHeader heading="New Jersey Laundry Service FAQ" />
          <AreaFAQ faqs={NJ_FAQS} />
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-14 lg:py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}
      >
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <SectionHeader heading="Reclaim Your Weekends" headingClassName="mb-4" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              Families and professionals across New Jersey already use We
              Deliver Laundry to take laundry off their plate. Schedule your
              first pickup and see why they never went back.
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

function CountyCard({
  county,
  link,
  towns,
}: {
  county: string;
  link?: string;
  towns: string[];
}) {
  return (
    <div className="bg-cream rounded-xl px-6 py-6">
      <h3 className="text-lg font-heading-medium text-navy mb-4">{county}</h3>
      <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 space-y-1.5 mb-4">
        {towns.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {link && (
        <Link
          href={link}
          className="font-[family-name:var(--font-poppins)] text-sm text-primary font-body-medium hover:underline"
        >
          View {county} details
        </Link>
      )}
    </div>
  );
}
