type ServicesProps = {
  title?: string;
  heading?: string;
  subheading?: string;
  showPricing?: boolean;
  config?: Record<string, unknown>;
};

export function Services(_props: ServicesProps = {}) {
  return (
    <section style={{ background: "#F7F5E6" }} className="py-14 px-6 box-border">
      <div className="max-w-[1100px] mx-auto">
        <div
          className="relative overflow-hidden rounded-[20px] px-12 py-10 sm:px-20 sm:py-12"
          style={{ background: "#1227BE" }}
        >
          {/* Decorative supergraphic */}
          <svg
            className="absolute top-[-30px] right-[-40px] w-[300px] h-[300px] opacity-10 pointer-events-none"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20 240 Q80 100 160 70 Q230 40 290 120" stroke="white" strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M0 280 Q90 180 190 160 Q250 140 300 190" stroke="white" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M40 310 Q110 240 200 220 Q260 200 310 250" stroke="white" strokeWidth="11" strokeLinecap="round" fill="none" />
          </svg>

          {/* Label */}
          <p
            className="relative z-10 text-[11px] font-medium tracking-[0.14em] uppercase mb-4"
            style={{ color: "rgba(162,213,230,0.9)" }}
          >
            Your custom laundry plan
          </p>

          {/* Headline */}
          <h2
            className="relative z-10 font-heading-medium text-white uppercase leading-[1.1] mb-3"
            style={{ fontSize: "clamp(28px, 5vw, 42px)", letterSpacing: "0.06em" }}
          >
            Laundry that fits<br />your routine
          </h2>

          {/* Subtext */}
          <p
            className="relative z-10 text-[17px] leading-relaxed mb-10 max-w-[500px]"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            Answer a few quick questions and we&apos;ll build your perfect plan — pricing included. Free pickup. Next-day delivery. No guesswork.
          </p>

          {/* Divider */}
          <hr className="relative z-10 border-0 border-t mb-9" style={{ borderColor: "rgba(255,255,255,0.15)" }} />

          {/* How it works */}
          <p
            className="relative z-10 text-[11px] font-medium tracking-[0.14em] uppercase mb-6"
            style={{ color: "rgba(162,213,230,0.9)" }}
          >
            How it works
          </p>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-7 mb-11">
            {[
              { num: "1", title: "Tell us about your laundry", desc: "How often, how much, and your household size" },
              { num: "2", title: "We build your plan", desc: "Weekly or biweekly, number of bags, any add-ons" },
              { num: "3", title: "Get your price instantly", desc: "No surprises — just a clear monthly cost" },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-heading-medium shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  {step.num}
                </div>
                <div>
                  <strong className="block text-white text-sm font-medium mb-1">{step.title}</strong>
                  <span className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="/subscriptions"
            className="wdl-hero-cta relative z-10 inline-block text-sm font-medium tracking-[0.1em] uppercase rounded-full px-8 py-4 transition-transform hover:-translate-y-px"
            style={{
              fontFamily: "inherit",
              color: "#1227BE",
              background: "#fff",
              textDecoration: "none",
            }}
          >
            Get my plan &rarr;
          </a>
          <style>{`.wdl-hero-cta:hover { background: #F9EBAA !important; }`}</style>
        </div>
      </div>
    </section>
  );
}
