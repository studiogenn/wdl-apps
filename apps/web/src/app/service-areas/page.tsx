"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ZipChecker } from "@/components/home/ZipChecker";

const serviceAreasSchema = {
  "@context": "https://schema.org",
  "@type": "DryCleaningOrLaundry",
  name: "We Deliver Laundry",
  url: "https://wedeliverlaundry.com",
  telephone: "+18559685511",
  email: "start@wedeliverlaundry.com",
  areaServed: [{ "@type": "State", name: "New York" }, { "@type": "State", name: "New Jersey" }],
};

export default function ServiceAreasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreasSchema) }}
      />
      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-[1.75rem] lg:text-[2.25rem] font-heading-medium text-navy leading-tight mb-4 uppercase">
                Our Laundry Service Areas
              </h2>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-5">
                We offer fast, reliable laundry pickup and delivery across New
                York City and New Jersey, with convenient scheduling and 24-hour
                turnaround.
              </p>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy space-y-2.5 mb-7">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  24-Hour Turnaround
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Reliable Delivery Service
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  No Harsh Chemicals
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/account/"
                  className="font-[family-name:var(--font-inter)] px-6 py-3 text-sm font-body-medium text-white bg-navy rounded-full hover:bg-navy/90 transition-colors"
                >
                  Schedule Pick-up
                </Link>
                <Link
                  href="#zipcode"
                  className="font-[family-name:var(--font-inter)] px-6 py-3 text-sm font-body-medium text-navy border border-navy rounded-full hover:bg-navy hover:text-white transition-colors"
                >
                  Check Your Zip Code
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/service-areas-hero.jpg"
                alt="We Deliver Laundry team member carrying a blue Wash & Fold laundry bag inside a professional laundry facility."
                width={918}
                height={750}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Counties We Serve */}
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-[1100px] text-center">
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-2">
            Locations
          </p>
          <h1 className="text-[1.75rem] lg:text-[2.25rem] font-heading-medium text-navy mb-3 uppercase">
            Counties We Serve
          </h1>
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto mb-10">
            We provide laundry pickup and delivery in select counties across New
            York and New Jersey, with service areas optimized for reliable,
            on-time pickups.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-[700px] mx-auto">
            <CountyDropdown
              label="New Jersey"
              areas={[
                "Bergen", "Essex", "Hudson", "Morris", "Union", "Passaic",
              ]}
            />
            <CountyDropdown
              label="New York"
              areas={[
                "Alphabet City", "Battery Park City", "Bowery", "Carnegie Hill",
                "Central Harlem", "Chelsea", "Chinatown", "Civic Center",
                "Columbus Circle", "East Harlem", "East Village",
                "Financial District", "Flatiron District", "Gramercy Park",
                "Greenwich Village", "Hamilton Heights", "Harlem",
                "Hell\u2019s Kitchen", "Hudson Square", "Inwood", "Kips Bay",
                "Lenox Hill", "Lincoln Square", "Little Italy",
                "Lower East Side", "Manhattan Valley", "Marble Hill",
                "Meatpacking District", "Midtown", "Midtown East",
                "Midtown West", "Morningside Heights", "Murray Hill", "NoHo",
                "Nolita", "Roosevelt Island", "SoHo", "South Harlem",
                "South Street Seaport", "Stuyvesant Town", "Sugar Hill",
                "Theater District", "Tribeca", "Two Bridges",
                "Upper East Side", "Upper West Side", "Washington Heights",
                "West Village", "Yorkville",
              ]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px]">
          <p className="text-center font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-2">
            How it Works
          </p>
          <h2 className="text-center text-[1.75rem] lg:text-[2.25rem] font-heading-medium text-navy mb-3 uppercase">
            Pick-up and Drop-off Explained
          </h2>
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-14">
            No complicated steps here — just easy scheduling, smooth pickup,
            professional cleaning, and fast delivery back to your door.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="inline-block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/50 mb-4">
                Step 1
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-1-schedule.jpg"
                  alt="Customer smiling while scheduling a laundry pickup on a mobile phone at home."
                  width={1200}
                  height={660}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                Schedule Pick-up
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Choose a pick up and drop off time most convenient for you.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/50 mb-4">
                Step 2
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-2-pickup.jpg"
                  alt="Wash and fold laundry pickup service by We Deliver Laundry, featuring branded laundry bag ready for delivery."
                  width={1200}
                  height={660}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                We Pick Up
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                A driver will coordinate pickup of your order. Any special
                instructions you provide us will be followed.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block font-[family-name:var(--font-poppins)] text-xs font-body-medium text-navy/50 mb-4">
                Step 3
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-3-deliver.jpg"
                  alt="We Deliver Laundry pickup and delivery van used for wash and fold laundry service in NYC and New Jersey."
                  width={1200}
                  height={660}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                We Deliver
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Your laundry is professionally cleaned, quality-checked, and
                delivered back on schedule — ready for immediate use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-[1100px] text-center">
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/50 mb-2">
            Client Testimonials
          </p>
          <h1 className="text-[1.75rem] lg:text-[2.25rem] font-heading-medium text-navy mb-3 uppercase">
            A Word From Our Customers
          </h1>
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto mb-10">
            Straight from customers who rely on We Deliver Laundry every week
            for fast, reliable laundry pickup and delivery across New York City
            and New Jersey.
          </p>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { name: "Michele M", initial: "M", text: "Always a quick, seamless experience. I love that you can choose which products you\u2019d like use on your clothes that\u2019s..." },
              { name: "betina", initial: "B", text: "Best laundry service I\u2019ve tried. Super clean, perfectly folded, sorted by person, and delivered right to my door. I..." },
              { name: "Moises sanabria", initial: "M", text: "I\u2019ve used We Deliver Laundry a few times now, and every experience has been smooth and professional. Their picku..." },
              { name: "Daniela Parada Alzate", initial: "D", text: "We Deliver Laundry has completely transformed the way I handle laundry! Pickup and drop-off are always on..." },
              { name: "Lynn Quach", initial: "L", text: "This laundry company was incredibly responsive and delivered excellent service with great attention to detail..." },
            ].map((review) => (
              <div key={review.name} className="flex-shrink-0 w-[260px] bg-white rounded-xl border border-navy/10 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-sm font-body-medium text-navy">
                    {review.initial}
                  </div>
                  <span className="text-sm font-body-medium text-navy">{review.name}</span>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-navy/80 leading-relaxed line-clamp-4">{review.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.77-4.59l-7.98-6.19A23.99 23.99 0 000 24c0 3.77.9 7.35 2.56 10.56l7.97-5.97z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">5.0 rating on Google</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Check Zip Code */}
      <section id="zipcode" className="bg-cream py-14 lg:py-20">
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-heading-medium text-navy mb-4 uppercase">
              Check if We Deliver to You
            </h2>
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              Enter your zip code to see if we offer pickup and delivery in your area.
            </p>
            <ZipChecker />
          </div>
        </div>
      </section>

      {/* Ready to Get Started */}
      <section className="py-14 lg:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)" }}>
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <h2 className="text-[1.75rem] lg:text-[2.25rem] font-heading-medium text-navy mb-4 uppercase">
              Ready to Get Started?
            </h2>
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              From easy scheduling to reliable 24-hour delivery, we&apos;ve built
              a laundry service that fits into your life instead of taking it
              over.
            </p>
            <Link
              href="/account/"
              className="font-[family-name:var(--font-inter)] inline-block px-8 py-3 text-sm font-body-medium text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
            >
              Schedule Pick-up
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-[780px]">
          <h2 className="text-center text-[1.75rem] lg:text-[2.25rem] font-heading-medium text-navy mb-10 uppercase">
            Frequently Asked Questions
          </h2>
          <div className="border-t border-navy/10">
            <FAQItem
              question="How can I check if you service my area?"
              answer={'You may check by clicking on "Check Your Zip Code" above and entering your zip code. You can also browse our service area lists for New York and New Jersey.'}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function CountyDropdown({ label, areas }: { label: string; areas: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-1 min-w-[280px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-light-blue text-navy rounded-full px-6 py-5 flex items-center justify-between font-[family-name:var(--font-poppins)] text-lg font-body-medium cursor-pointer"
      >
        {label}
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="mt-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
          <ul className="columns-2 gap-8 font-[family-name:var(--font-poppins)] text-[15px] text-navy font-light tracking-[-0.03em]">
            {areas.map((area) => (
              <li key={area} className="py-2.5 border-b border-navy/10 break-inside-avoid">
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-navy/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-[family-name:var(--font-poppins)] text-[15px] font-body-medium text-navy pr-6">
          {question}
        </span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center text-navy/40 group-hover:text-navy transition-colors">
          {isOpen ? (
            <svg width="14" height="2" viewBox="0 0 14 2" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="0" y1="1" x2="14" y2="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="7" y1="0" x2="7" y2="14" />
              <line x1="0" y1="7" x2="14" y2="7" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
