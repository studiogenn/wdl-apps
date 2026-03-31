import Image from "next/image";
import type { HowItWorksConfig } from "@/lib/section-defaults";

const STEPS = [
  {
    step: "Step 1",
    title: "Schedule Pick-up",
    description:
      "Choose a pickup and drop-off time that works for you. Schedule online in minutes and leave your laundry at your door, no waiting around required.",
    image: "/images/step-1.webp",
  },
  {
    step: "Step 2",
    title: "We Pick Up",
    description:
      "Our professional drivers pick up your laundry at the scheduled time and carefully follow any special instructions.",
    image: "/images/step-2.webp",
  },
  {
    step: "Step 3",
    title: "We Wash, Fold & Deliver",
    description:
      "Your clothes are professionally washed, dried, neatly folded, and delivered back to you within 24 hours, fresh, clean, and ready to wear.",
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
        <p className="text-center text-sm uppercase tracking-[0.15em] font-[family-name:var(--font-poppins)] font-medium text-navy/50 mb-2">
          {eyebrow}
        </p>
        <h2 className="text-center text-[2rem] lg:text-[2.625rem] font-normal leading-[3.375rem] tracking-[0.84px] text-navy mb-3 uppercase">
          {heading}
        </h2>
        <p className="font-[family-name:var(--font-poppins)] text-center text-navy/70 text-[15px] max-w-2xl mx-auto mb-14">
          {subheading}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.step} className="text-center">
              <span className="inline-block bg-highlight text-navy font-[family-name:var(--font-poppins)] text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                {step.step}
              </span>
              <div className="mb-5 overflow-hidden rounded-xl">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={260}
                  className="w-full h-[200px] object-cover"
                />
              </div>
              <h3 className="text-xl lg:text-[1.5rem] font-medium text-navy mb-2">
                {step.title}
              </h3>
              <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
