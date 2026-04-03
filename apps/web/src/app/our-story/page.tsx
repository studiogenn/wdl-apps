"use client";

import Image from "next/image";

import { ZipChecker } from "@/components/home/ZipChecker";
import { ButtonLink, SectionHeader } from "@/components/shared";

export default function OurStoryPage() {
  return (
    <>
      <style jsx global>{`
        .wfo-county-dds {
          display: flex;
          gap: 24px;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: flex-start;
          margin-top: 12px;
        }
        .wfo-county-dd {
          flex: 1 1 0;
          max-width: 564px;
          min-width: 280px;
          position: relative;
        }
        .wfo-county-dd summary {
          list-style: none;
        }
        .wfo-county-dd summary::-webkit-details-marker {
          display: none;
        }
        .wfo-county-dd summary {
          background: #e7e9f8;
          color: #050b39;
          border-radius: 100px;
          padding: 24px;
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-family: "DM Sans", system-ui, -apple-system, Segoe UI, Roboto,
            Arial, sans-serif;
          font-size: 18px;
          line-height: 1.5;
          font-weight: 600;
        }
        .wfo-county-dd .chev {
          width: 20px;
          height: 20px;
          flex: 0 0 20px;
          transition: transform 0.2s ease;
          color: #050b39;
        }
        .wfo-county-dd[open] .chev {
          transform: rotate(180deg);
        }
        .wfo-county-dd .panel {
          margin-top: 12px;
          background: #ffffff;
          border-radius: 16px;
          padding: 16px 22px;
          box-shadow: 0 12px 30px rgba(5, 11, 57, 0.1);
          font-family: "DM Sans", system-ui, -apple-system, Segoe UI, Roboto,
            Arial, sans-serif;
          font-size: 18px;
          line-height: 1.5;
          font-weight: 300;
          letter-spacing: -0.54px;
          color: #050b39;
        }
        .wfo-county-dd .panel ul {
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
          columns: 2;
          column-gap: 32px;
        }
        .wfo-county-dd .panel li {
          break-inside: avoid;
          padding: 10px 0 !important;
          margin: 0 !important;
          border-bottom: 1px solid rgba(5, 11, 57, 0.1);
          list-style: none !important;
          padding-left: 0 !important;
          margin-left: 0 !important;
          text-indent: 0 !important;
          background: none !important;
          background-image: none !important;
        }
        .wfo-county-dd .panel li::marker {
          content: "" !important;
        }
        .wfo-county-dd .panel li::before,
        .wfo-county-dd .panel li::after {
          content: "" !important;
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          background: none !important;
          border: 0 !important;
        }
        @media (max-width: 767px) {
          .wfo-county-dds {
            flex-wrap: wrap;
            gap: 14px;
          }
          .wfo-county-dd {
            flex: 1 1 100%;
            max-width: 100%;
            min-width: 0;
          }
          .wfo-county-dd summary {
            padding: 18px 20px;
            font-size: 16px;
          }
          .wfo-county-dd .panel {
            font-size: 16px;
            letter-spacing: -0.4px;
          }
          .wfo-county-dd .panel ul {
            columns: 1;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <SectionHeader eyebrow="Our Story" heading="Built to Make Laundry Effortless" align="left" headingClassName="mb-4 leading-tight" />
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-7">
                We Deliver Laundry started with a simple idea: take laundry off
                people&apos;s plates without making it complicated. From easy
                scheduling to fast turnaround and reliable delivery, we built a
                service designed around real life, so clean clothes show up on
                time, every time.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/account/">
                  Schedule Pickup
                </ButtonLink>
                <ButtonLink href="#zipcode" variant="outline">
                  Check Your Zip Code
                </ButtonLink>
              </div>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/our-story-hero.jpg"
                alt="We Deliver Laundry delivery driver inside a branded van during laundry pickup and delivery service."
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
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px] text-center">
          <SectionHeader eyebrow="Locations" heading="Counties We Serve" headingAs="h1" align="left" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto mb-1">
            We provide laundry pickup and delivery in select counties across New
            York and New Jersey, with service areas optimized for reliable,
            on-time pickups.
          </p>

          <div className="wfo-county-dds">
            <details className="wfo-county-dd">
              <summary>
                New Jersey
                <svg
                  className="chev"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="panel">
                <ul>
                  <li>Bergen</li>
                  <li>Essex</li>
                  <li>Hudson</li>
                  <li>Morris</li>
                  <li>Union</li>
                  <li>Passaic</li>
                </ul>
              </div>
            </details>
            <details className="wfo-county-dd">
              <summary>
                New York
                <svg
                  className="chev"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="panel">
                <ul>
                  <li>Alphabet City</li>
                  <li>Battery Park City</li>
                  <li>Bowery</li>
                  <li>Carnegie Hill</li>
                  <li>Central Harlem</li>
                  <li>Chelsea</li>
                  <li>Chinatown</li>
                  <li>Civic Center</li>
                  <li>Columbus Circle</li>
                  <li>East Harlem</li>
                  <li>East Village</li>
                  <li>Financial District</li>
                  <li>Flatiron District</li>
                  <li>Gramercy Park</li>
                  <li>Greenwich Village</li>
                  <li>Hamilton Heights</li>
                  <li>Harlem</li>
                  <li>Hell&apos;s Kitchen</li>
                  <li>Hudson Square</li>
                  <li>Inwood</li>
                  <li>Kips Bay</li>
                  <li>Lenox Hill</li>
                  <li>Lincoln Square</li>
                  <li>Little Italy</li>
                  <li>Lower East Side</li>
                  <li>Manhattan Valley</li>
                  <li>Marble Hill</li>
                  <li>Meatpacking District</li>
                  <li>Midtown</li>
                  <li>Midtown East</li>
                  <li>Midtown West</li>
                  <li>Morningside Heights</li>
                  <li>Murray Hill</li>
                  <li>NoHo</li>
                  <li>Nolita</li>
                  <li>Roosevelt Island</li>
                  <li>SoHo</li>
                  <li>South Harlem</li>
                  <li>South Street Seaport</li>
                  <li>Stuyvesant Town</li>
                  <li>Sugar Hill</li>
                  <li>Theater District</li>
                  <li>Tribeca</li>
                  <li>Two Bridges</li>
                  <li>Upper East Side</li>
                  <li>Upper West Side</li>
                  <li>Washington Heights</li>
                  <li>West Village</li>
                  <li>Yorkville</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px] text-center">
          <SectionHeader eyebrow="Our Values" heading="What We Stand For" align="left" headingClassName="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-7 text-center">
              <h3 className="text-lg font-heading-medium text-navy mb-2">Reliability</h3>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px]">
                On-time pickups and deliveries you can count on, every single time.
              </p>
            </div>
            <div className="bg-white rounded-xl p-7 text-center">
              <h3 className="text-lg font-heading-medium text-navy mb-2">Quality</h3>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px]">
                Professionally cleaned, carefully folded, and ready to wear within 24 hours.
              </p>
            </div>
            <div className="bg-white rounded-xl p-7 text-center">
              <h3 className="text-lg font-heading-medium text-navy mb-2">Transparency</h3>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px]">
                Simple per-pound pricing with no hidden fees, no subscriptions required.
              </p>
            </div>
            <div className="bg-white rounded-xl p-7 text-center">
              <h3 className="text-lg font-heading-medium text-navy mb-2">Care</h3>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px]">
                Your clothes handled with the same care you&apos;d give them yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Service */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px] text-center">
          <SectionHeader heading="Choose the Laundry Service That Fits Your Needs" headingAs="h1" align="left" headingClassName="mb-4" />
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto mb-8">
            From wash &amp; fold to commercial laundry, we&apos;ve got the dirty
            work covered.
            <br />
            Let us take a load off your shoulders!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-blue rounded-xl p-8">
              <h3 className="text-lg font-heading-medium text-navy mb-2">Wash &amp; Fold</h3>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] mb-5">
                Professional wash, dry &amp; fold with 24-hour turnaround. Starting at $1.95/lb.
              </p>
              <ButtonLink href="/wash-fold" variant="outline">
                Learn More
              </ButtonLink>
            </div>
            <div className="bg-light-blue rounded-xl p-8">
              <h3 className="text-lg font-heading-medium text-navy mb-2">Commercial Laundry</h3>
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] mb-5">
                Dependable high-volume laundry for businesses of all sizes.
              </p>
              <ButtonLink href="/commercial-laundry" variant="outline">
                Learn More
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Check if We Deliver */}
      <section
        id="zipcode"
        className="py-14 lg:py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)",
        }}
      >
        <div className="container-site max-w-[700px]">
          <div className="bg-white rounded-2xl px-8 py-12 lg:px-14 lg:py-16 text-center shadow-sm">
            <SectionHeader heading="Check if We Deliver to You" align="left" headingClassName="mb-4" />
            <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
              We currently offer pickup and delivery across select counties in
              New York and New Jersey, with reliable service areas designed to
              keep pickups fast and on schedule.
            </p>
            <ZipChecker />
          </div>
        </div>
      </section>
    </>
  );
}
