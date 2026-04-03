import Image from "next/image";
import type { HowItWorksConfig } from "@/lib/section-defaults";
import { SectionHeader } from "@/components/shared";

const STEPS = [
  {
    num: 1,
    title: "Schedule Your Pickup",
    description:
      "Pick a day and time window that works for you. Members get recurring weekly pickups — or schedule one-off pickups anytime.",
    image: "/images/step-1.webp",
  },
  {
    num: 2,
    title: "Leave It at Your Door",
    description:
      "Bag your laundry and set it outside. Our driver picks it up at your scheduled time — no waiting around.",
    image: "/images/step-2.webp",
  },
  {
    num: 3,
    title: "Clean Clothes, Delivered",
    description:
      "We wash, dry, and neatly fold everything — then deliver it back within 24 hours, fresh and ready to wear.",
    image: "/images/step-3.webp",
  },
];

const DEFAULTS = {
  heading: "Laundry Pickup & Drop-Off, Explained",
  subheading:
    "From pickup to drop-off, We Deliver Laundry makes laundry pickup and delivery easy, reliable, and painless — so you can focus on what matters most.",
  eyebrow: "How it Works",
};

export function HowItWorks({ config }: { config?: HowItWorksConfig }) {
  const heading = config?.heading ?? DEFAULTS.heading;
  const subheading = config?.subheading ?? DEFAULTS.subheading;
  const eyebrow = config?.eyebrow ?? DEFAULTS.eyebrow;

  return (
    <section className="py-16 lg:py-20">
      <div className="container-site max-w-[1100px]">
        <SectionHeader eyebrow={eyebrow} heading={heading} description={subheading} size="lg" headingClassName="font-normal leading-[3.375rem] tracking-[0.84px]" />

        <div className="space-y-10 lg:space-y-16">
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 1;
            return (
              <div
                key={step.num}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-14 ${
                  isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2 overflow-hidden rounded-2xl">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={560}
                    height={380}
                    className="w-full h-[240px] sm:h-[300px] lg:h-[340px] object-cover"
                  />
                </div>

                {/* Text */}
                <div className="w-full lg:w-1/2">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-[family-name:var(--font-poppins)] text-sm font-body-medium mb-4">
                    {step.num}
                  </span>
                  <h3 className="text-xl lg:text-[1.75rem] font-heading-medium text-navy mb-3">
                    {step.title}
                  </h3>
                  <p className="font-[family-name:var(--font-poppins)] text-sm sm:text-[15px] text-navy/70 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
