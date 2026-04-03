import { ButtonLink } from "@/components/shared";

const steps = [
  {
    number: "1",
    heading: "Tell us about your laundry",
    body: "How often, how much, and your household size",
  },
  {
    number: "2",
    heading: "We build your plan",
    body: "Weekly or biweekly, number of bags, any add-ons",
  },
  {
    number: "3",
    heading: "Get your price instantly",
    body: "No surprises — just a clear monthly cost",
  },
];

export function CustomPlanBanner() {
  return (
    <section className="bg-cream py-12 lg:py-16">
      <div className="container-site max-w-[1100px]">
        <div className="relative bg-primary rounded-3xl overflow-hidden px-8 py-12 lg:px-14 lg:py-14">
          {/* Decorative swoosh */}
          <svg
            className="absolute top-0 right-0 w-[280px] lg:w-[380px] opacity-20 pointer-events-none z-0"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M380 20 Q260 80 200 180 Q160 240 100 280" stroke="white" strokeWidth="28" strokeLinecap="round" fill="none" />
            <path d="M420 60 Q300 120 240 220 Q200 270 140 300" stroke="white" strokeWidth="20" strokeLinecap="round" fill="none" />
            <path d="M440 110 Q340 160 280 250 Q250 290 200 310" stroke="white" strokeWidth="14" strokeLinecap="round" fill="none" />
          </svg>

          {/* Content */}
          <div className="relative z-10 text-center">
            <p className="text-xs uppercase tracking-[0.18em] font-[family-name:var(--font-poppins)] font-body-medium text-white/60 mb-4">
              Your Custom Laundry Plan
            </p>
            <h2 className="font-heading-medium text-white uppercase text-[2rem] lg:text-[2.75rem] leading-tight mb-5">
              Laundry that fits your routine
            </h2>
            <p className="font-[family-name:var(--font-poppins)] text-white/80 text-[15px] leading-relaxed mb-8 max-w-[520px] mx-auto">
              Answer a few quick questions and we&apos;ll build your perfect plan — pricing
              included. Free pickup. Next-day delivery. No guesswork.
            </p>
          </div>

          {/* Divider */}
          <div className="relative z-10 border-t border-white/20 mb-8" />

          {/* How It Works */}
          <div className="relative z-10 text-center">
            <p className="text-xs uppercase tracking-[0.18em] font-[family-name:var(--font-poppins)] font-body-medium text-white/60 mb-6">
              How It Works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <span className="font-[family-name:var(--font-poppins)] font-body-medium text-white text-sm">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-poppins)] font-body-medium text-white text-[15px] mb-1">
                    {step.heading}
                  </h3>
                  <p className="font-[family-name:var(--font-poppins)] text-white/60 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            <ButtonLink href="/pricing" className="bg-white text-navy hover:bg-white/90 uppercase tracking-wider text-sm font-body-medium px-8 py-3.5">
              Get my plan →
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
