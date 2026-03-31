"use client";

import Image from "next/image";
import { useState } from "react";
import { trackContactFormSubmit, identifyWithEmail } from "@/lib/tracking";
import { FAQAccordion, ButtonLink, Button, SectionHeader } from "@/components/shared";

const commercialSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Commercial Laundry Service",
  description: "Professional commercial laundry service for businesses. Reliable pickup and delivery with custom pricing based on volume.",
  url: "https://wedeliverlaundry.com/commercial-laundry",
  provider: {
    "@type": "DryCleaningOrLaundry",
    name: "We Deliver Laundry",
    url: "https://wedeliverlaundry.com",
    telephone: "+18559685511",
  },
  areaServed: [{ "@type": "State", name: "New York" }, { "@type": "State", name: "New Jersey" }],
};

export default function CommercialLaundryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(commercialSchema) }}
      />
      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[1100px]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <SectionHeader heading="Laundry Service Designed for Your Business" align="left" headingClassName="mb-4 leading-tight" />
              <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed mb-5">
                Reliable, professional laundry service that saves time, cuts
                costs, and keeps your business running smoothly.
              </p>
              <ul className="font-[family-name:var(--font-poppins)] text-sm text-navy space-y-2.5 mb-7">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Professionally cleaned linens and garments
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Fast, reliable turnaround times
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-navy shrink-0" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                  Delivered back to you within 24 hours
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/account/">
                  Schedule Pick-up
                </ButtonLink>
                <ButtonLink href="#contact" variant="outline">
                  Check Zip Code
                </ButtonLink>
              </div>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/commercial-hero.png"
                alt="We Deliver Laundry commercial service - branded laundry bag"
                width={940}
                height={517}
                className="w-full h-auto rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="How it Works" heading="Pick-up and Drop-off Explained" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-xl mx-auto mb-14">
            Our commercial laundry service is built around consistency and
            timing—scheduled pickups, clear communication, and reliable
            turnaround that keeps your business running smoothly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 1
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-1-weigh.png"
                  alt="Schedule commercial laundry pickup"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                Schedule a Pickup
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Set a pickup schedule that fits your operation, whether
                it&apos;s daily, weekly, or on a custom cadence that works for
                your business.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 2
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-2-priced.png"
                  alt="Professional commercial laundry pickup"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                We Pick Up
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Our drivers arrive on time, handle your items with care, and
                follow any special instructions to keep your operation running
                smoothly.
              </p>
            </div>
            <div className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-5">
                Step 3
              </span>
              <div className="mb-5 rounded-xl overflow-hidden">
                <Image
                  src="/images/step-3-cleaned.png"
                  alt="Commercial laundry delivered on schedule"
                  width={940}
                  height={517}
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-xl font-heading-medium text-navy mb-2">
                We Deliver
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                Your laundry is professionally cleaned, quality-checked, and
                delivered back on schedule—ready for immediate use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[700px]">
          <SectionHeader heading="Contact Us" headingClassName="mb-8" />
          <div className="bg-white rounded-2xl p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-10 h-10 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <div>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy">
                  A member of our team will reach out.
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy">
                  We look forward to working with you.
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px] text-center">
          <SectionHeader heading="Industries We Serve" align="left" headingClassName="mb-4" />
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-2xl mx-auto mb-12">
            From hospitality to fitness and everything in between, we support
            businesses with dependable commercial laundry that fits their pace
            and priorities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: (
                  <svg className="w-7 h-7 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                  </svg>
                ),
                title: "Restaurants & Cafes",
                description: "Tablecloths, napkins, chef coats, aprons",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V17a2 2 0 012-2h0a2 2 0 012 2v4M3 7l9-4 9 4" />
                  </svg>
                ),
                title: "Hotels & Hospitality",
                description: "Sheets, towels, robes, table linens",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 5a3 3 0 11-6 0 3 3 0 016 0zM15 10c-3.5 0-6 2-6 5h12c0-3-2.5-5-6-5zM4 15l3-3M4 12l3 3" />
                  </svg>
                ),
                title: "Gyms & Fitness Studios",
                description: "Towels, mats, uniforms",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15a6 6 0 100-12 6 6 0 000 12zM12 15v7M8 18h8" />
                  </svg>
                ),
                title: "Salons & Spas",
                description: "Towels, capes, robes, sheets",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                ),
                title: "Offices & Co-working",
                description: "Towels, kitchen linens, uniforms",
              },
              {
                icon: (
                  <svg className="w-7 h-7 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                ),
                title: "Healthcare & Clinics",
                description: "Scrubs, lab coats, linens, towels",
              },
            ].map((industry) => (
              <div
                key={industry.title}
                className="bg-cream rounded-xl p-6"
              >
                <div className="mb-3">{industry.icon}</div>
                <h3 className="text-base font-heading-medium text-navy mb-1">
                  {industry.title}
                </h3>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70">
                  {industry.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[1100px] text-center">
          <SectionHeader eyebrow="Client Testimonials" heading="A Word From Our Customers" headingAs="h1" align="left" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-xl mx-auto mb-10">
            Straight from customers who rely on We Deliver Laundry every week
            for fast, reliable laundry pickup and delivery across New York City
            and New Jersey.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              {
                name: "Michele M",
                text: "Always a quick, seamless experience. I love that you can choose which products you'd like use on your clothes that's...",
              },
              {
                name: "betina",
                text: "Best laundry service I've tried. Super clean, perfectly folded, sorted by person, and delivered right to my door. I...",
              },
              {
                name: "Moises sanabria",
                text: "I've used We Deliver Laundry a few times now, and every experience has been smooth and professional. Their picku...",
              },
              {
                name: "Daniela Parada Alzate",
                text: "We Deliver Laundry has completely transformed the way I handle laundry! Pickup and drop-off are always on...",
              },
              {
                name: "Lynn Quach",
                text: "This laundry company was incredibly responsive and delivered excellent service with great attention to detail...",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="flex-shrink-0 w-[260px] bg-white rounded-xl border border-navy/10 p-5 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-navy/10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-body-medium text-navy">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-[family-name:var(--font-poppins)] text-sm font-body-medium text-navy">
                    {review.name}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="By The Numbers" heading="Trust Building Success Metrics" headingClassName="mb-3" />
          <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-12">
            We don&apos;t love bragging, but the numbers don&apos;t lie — quick
            delivery, thousands of happy customers, and more clean laundry than
            we can count.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "⏰", value: "24 Hour", label: "Delivery Guarantee" },
              { icon: "😊", value: "9,000+", label: "Happy Customers" },
              { icon: "👕", value: "1,000,000+", label: "Lbs of Laundry Cleaned" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-cream rounded-xl px-6 py-10 text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-[1.75rem] font-body-medium text-navy mb-1">
                  {stat.value}
                </p>
                <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-16 lg:py-20"
        style={{
          background:
            "linear-gradient(135deg, #E7E9F8 0%, #d4d8f5 50%, #E7E9F8 100%)",
        }}
      >
        <div className="container-site max-w-[780px]">
          <SectionHeader heading="Frequently Asked Questions" />
          <FAQAccordion items={COMMERCIAL_FAQ} />
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: { preventDefault: () => void; currentTarget: HTMLFormElement }) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const body = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || undefined,
      location: formData.get("location") as string || undefined,
      message: formData.get("message") as string || undefined,
      form_type: "commercial_inquiry",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setStatus("success");
        trackContactFormSubmit();
        identifyWithEmail(body.email, { name: `${body.first_name} ${body.last_name}`, phone: body.phone });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 lg:p-10 text-center">
        <h3 className="text-xl font-heading-medium text-navy mb-3">Thank You!</h3>
        <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70">
          We&apos;ve received your message and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          required
          className="font-[family-name:var(--font-poppins)] px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          required
          className="font-[family-name:var(--font-poppins)] px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="font-[family-name:var(--font-poppins)] px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="font-[family-name:var(--font-poppins)] px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>
      <input
        type="text"
        name="location"
        placeholder="Location"
        className="font-[family-name:var(--font-poppins)] w-full px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary"
      />
      <textarea
        name="message"
        placeholder="Please enter your questions, comments, or concerns in this field"
        rows={4}
        className="font-[family-name:var(--font-poppins)] w-full px-4 py-3 text-sm border border-navy/10 rounded-lg focus:outline-none focus:border-primary resize-none"
      />
      <label className="flex items-start gap-3">
        <input type="checkbox" required className="mt-1" />
        <span className="font-[family-name:var(--font-poppins)] text-xs text-navy/60 leading-relaxed">
          By submitting this form, you agree to receive recurring automated
          marketing and informational text messages from We Deliver Laundry
          related to promotions, updates, and customer support. Message
          frequency varies. Msg &amp; data rates may apply. Reply HELP for help
          or STOP to opt out.
        </span>
      </label>
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="w-full disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Contact Our Team"}
      </Button>
      {status === "error" && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

const COMMERCIAL_FAQ = [
  {
    question: "How much is the service?",
    answer:
      "Commercial pricing is customized based on your volume and schedule. Contact us for a personalized quote.",
  },
  {
    question: "How much is the delivery fee?",
    answer:
      "There is no delivery fee for commercial accounts! We only charge based on volume.",
  },
  {
    question: "Is there a limit on how much I can send?",
    answer:
      "No limit! We handle businesses of all sizes, from small operations to high-volume accounts.",
  },
  {
    question: "Do you have discounts available?",
    answer:
      "Yes! We offer volume discounts and custom pricing for regular commercial accounts.",
  },
];

