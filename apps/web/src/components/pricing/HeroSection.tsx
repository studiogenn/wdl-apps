import type { PageView } from "./pricing-data";

function SuperBgSvg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" fill="none" className="h-full w-full opacity-[0.08]">
        <path d="M-50 200 Q100 120 200 180 Q300 240 450 160" stroke="#fff" strokeWidth="28" fill="none" strokeLinecap="round" />
        <path d="M-50 260 Q100 180 200 240 Q300 300 450 220" stroke="#fff" strokeWidth="20" fill="none" strokeLinecap="round" />
        <path d="M-50 140 Q100 60 200 120 Q300 180 450 100" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CheckBadge() {
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
      <svg viewBox="0 0 10 10" fill="none" className="h-2.5 w-2.5">
        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const features = [
  "Wash, dry and fold",
  "Free pickup and delivery",
  "No harsh chemicals — ever",
  "Lights and darks separated",
  "Pocket check + paired socks",
  "24-hour turnaround",
  "Cancel or pause anytime",
];

interface HeroSectionProps {
  onNavigate: (page: PageView) => void;
  onStartQuiz: () => void;
}

export function HeroSection({ onNavigate, onStartQuiz }: HeroSectionProps) {
  return (
    <div>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-primary px-6 pb-12 pt-10 text-center">
        <SuperBgSvg />
        <div className="relative z-10 mx-auto max-w-[360px]">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[2.5px] text-white/90">
            NYC & New Jersey
          </span>
          <h1 className="mb-2.5 text-[30px] font-normal uppercase leading-[1.15] tracking-[1.5px] text-white">
            Laundry done right.
            <br />
            From $30.99/bag.
          </h1>
          <p className="mx-auto mb-8 max-w-[320px] text-sm leading-relaxed text-white/70">
            15-18 lbs per bag · Free pickup & delivery · No contracts
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onStartQuiz}
              className="rounded-full bg-[#F9EBAA] px-6 py-4 font-[family-name:var(--font-zilla-slab)] text-[15px] font-semibold tracking-[0.5px] text-[#0a158a] transition-all hover:-translate-y-px hover:bg-[#f5e080]"
            >
              HELP ME PICK A PLAN →
            </button>
            <button
              onClick={() => onNavigate("subscription")}
              className="rounded-full border-[1.5px] border-white/30 bg-white/[0.12] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Build my own plan
            </button>
            <button
              onClick={() => onNavigate("payg")}
              className="rounded-full bg-[#d4eef6] px-6 py-3.5 text-sm font-semibold text-[#0a158a] transition-colors hover:bg-[#A2D5E6]"
            >
              One-time order — no subscription
            </button>
          </div>
        </div>
      </section>

      {/* Features card */}
      <div className="mx-auto max-w-[500px] px-4 pt-6">
        <div className="rounded-2xl border-[1.5px] border-[#e8e5d0] bg-white p-5">
          <div className="mb-3.5 text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
            Everything included in every order
          </div>
          {features.map((feature, i) => (
            <div
              key={feature}
              className={`flex items-center gap-2.5 py-1.5 text-sm text-[#333] ${
                i < features.length - 1 ? "border-b border-cream" : ""
              }`}
            >
              <CheckBadge />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
