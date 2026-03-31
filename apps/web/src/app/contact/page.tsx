"use client";

import { useState } from "react";
import { trackContactFormSubmit, identifyWithEmail } from "@/lib/tracking";
import { StatCard, Button, SectionHeader } from "@/components/shared";

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact We Deliver Laundry",
  url: "https://wedeliverlaundry.com/contact",
  mainEntity: {
    "@type": "DryCleaningOrLaundry",
    name: "We Deliver Laundry",
    telephone: "+18559685511",
    email: "start@wedeliverlaundry.com",
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {/* Hero */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="container-site max-w-[900px] text-center">
          <SectionHeader heading="If you still have any questions, our team is ready to help." headingAs="h1" headingClassName="mb-4 leading-tight" />
          <p className="font-body text-navy/70 text-[15px] max-w-xl mx-auto">
            Have a question or need help getting started? Our team is happy to
            walk you through your options and make sure everything runs smoothly.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-site max-w-[1000px]">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="bg-primary text-white rounded-full px-8 py-6 text-center min-w-[280px]">
              <h2 className="font-body text-base font-heading-medium mb-1">
                Phone Number:
              </h2>
              <a
                href="tel:8559685511"
                className="font-body text-sm hover:underline"
              >
                (855) 968-5511
              </a>
            </div>
            <div className="bg-primary text-white rounded-full px-8 py-6 text-center min-w-[280px]">
              <h2 className="font-body text-base font-heading-medium mb-1">
                Email
              </h2>
              <a
                href="mailto:start@wedeliverlaundry.com"
                className="font-body text-sm hover:underline"
              >
                start@wedeliverlaundry.com
              </a>
            </div>
            <div className="bg-primary text-white rounded-full px-8 py-6 text-center min-w-[280px]">
              <h2 className="font-body text-base font-heading-medium mb-1">
                Address
              </h2>
              <a
                href="https://www.google.com/maps/search/?api=1&query=33+W+60th+St,+New+York,+NY+10023"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm hover:underline"
              >
                33 W 60th St. New York – HQ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="container-site max-w-[700px]">
          <SectionHeader heading="Contact Us" />
          <ContactForm />
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-site max-w-[1100px]">
          <SectionHeader eyebrow="By The Numbers" heading="Trust Building Success Metrics" description="We don&apos;t love bragging, but the numbers don&apos;t lie — quick delivery, thousands of happy customers, and more clean laundry than we can count." headingClassName="mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <span className="text-4xl">⏰</span>, value: "24 Hour", label: "Delivery Guarantee" },
              { icon: <span className="text-4xl">😊</span>, value: "9,000+", label: "Happy Customers" },
              { icon: <span className="text-4xl">👕</span>, value: "1,000,000+", label: "Lbs of Laundry Cleaned" },
            ].map((stat) => (
              <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} className="py-10" />
            ))}
          </div>
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
      form_type: "contact",
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
        <p className="font-body text-sm text-navy/70">
          We&apos;ve received your message and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 lg:p-10 space-y-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name*"
          required
          className="font-body px-4 py-3 text-sm bg-neutral-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name*"
          required
          className="font-body px-4 py-3 text-sm bg-neutral-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email*"
          required
          className="font-body px-4 py-3 text-sm bg-neutral-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="font-body px-4 py-3 text-sm bg-neutral-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <input
        type="text"
        name="location"
        placeholder="Location"
        className="font-body w-full px-4 py-3 text-sm bg-neutral-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <textarea
        name="message"
        placeholder="Please enter your questions, comments, or concerns in this field"
        rows={5}
        className="font-body w-full px-4 py-3 text-sm bg-neutral-200 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
      <label className="flex items-start gap-3">
        <input type="checkbox" required className="mt-1" />
        <span className="font-body text-xs text-navy/60 leading-relaxed">
          I agree to receive marketing and informational SMS messages from We
          Deliver Laundry (WEDELA LLC) related to promotions, updates, and
          customer support. Message frequency varies. Msg &amp; data rates may
          apply. Reply HELP for help or STOP to opt out. Consent is not a
          condition of purchase.
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
      <p className="text-center font-body text-xs text-navy/50 mt-4">
        <a href="/privacy" className="underline hover:text-navy">
          Privacy Policy
        </a>
        {" | "}
        <a href="/terms" className="underline hover:text-navy">
          Terms & Conditions
        </a>
      </p>
    </form>
  );
}
