import Link from "next/link";
import { type ReactNode } from "react";

const SVG_PROPS = {
  width: 64,
  height: 64,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STEPS: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Log Into Your Account or Create a New Account",
    description:
      "Your online account is always attached to your phone number and address. To log in or create a new account, visit wedeliverlaundry.com/account and follow the prompts.",
    icon: (
      <svg {...SVG_PROPS}>
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
  },
  {
    title: "Verifying Your Phone Number",
    description:
      "Since your account is attached to your mobile number, have your phone nearby. Add your phone number, click Send Verification Code, and enter the code you receive.",
    icon: (
      <svg {...SVG_PROPS}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="m9.5 13 1.5 1.5 3.5-3.5" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>
    ),
  },
  {
    title: "Scheduling Your Pickup",
    description:
      "Click on the New Order button, choose Dry Cleaning, Laundry, or both and click Select. Pick your pickup day and click Schedule pickup & delivery. You can opt in or out of recurring orders.",
    icon: (
      <svg {...SVG_PROPS}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <rect x="7" y="13" width="3" height="3" rx="0.5" />
      </svg>
    ),
  },
  {
    title: "Pickup Details",
    description:
      "Set up your pickup and laundry preferences. Confirm your service selection, choose Pay as You Go or Weekly, select the number of bags, and set your care preferences.",
    icon: (
      <svg {...SVG_PROPS}>
        <path d="M16 3H8a2 2 0 0 0-2 2v16l2-1.5L10 21l2-1.5L14 21l2-1.5 2 1.5V5a2 2 0 0 0-2-2z" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="12" y2="16" />
      </svg>
    ),
  },
  {
    title: "Review and Submit Your Order",
    description:
      "Review your details, add your payment method (and promo code if you have one!), then click Submit Order. You'll receive a confirmation message with your pickup details.",
    icon: (
      <svg {...SVG_PROPS}>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Managing Your Recurring Pickups",
    description:
      "You can easily manage recurring pickup orders with full flexibility to change dates, skip weeks you're out of town, and edit laundry preferences. Access your account menu after logging in.",
    icon: (
      <svg {...SVG_PROPS}>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    ),
  },
];

export default function HowToOrderPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-light-blue py-16 lg:py-20">
        <div className="container-site max-w-[1100px] text-center">
          <h1 className="text-[2rem] lg:text-[2.625rem] font-heading-medium text-navy mb-4 uppercase">
            How To Schedule A Pickup
          </h1>
          <p className="font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] max-w-2xl mx-auto">
            We strive for a better and easier user experience for all our
            clients. We have prepared the following guide to explain how to log
            into our platform, manage your account, update your payment
            information, and place orders.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-20">
        <div className="container-site max-w-[900px]">
          <div className="space-y-8">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="bg-light-blue rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-start gap-8"
              >
                <div className="flex-1">
                  <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-body-medium px-4 py-1.5 rounded-full mb-4">
                    Step {index + 1}
                  </span>
                  <h3 className="text-xl lg:text-[1.5rem] font-heading-medium text-navy mb-3">
                    {step.title}
                  </h3>
                  <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="w-full lg:w-[280px] h-[180px] bg-light-blue rounded-xl shrink-0 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/account/"
              className="font-[family-name:var(--font-inter)] px-8 py-3 text-sm font-body-medium text-white bg-primary rounded-full hover:bg-primary-hover transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
