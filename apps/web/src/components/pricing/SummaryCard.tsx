import { cn } from "@/lib/cn";

interface SummaryLine {
  label: string;
  value: string;
}

interface SummaryCardProps {
  planLabel?: string;
  planName?: string;
  priceLabel?: string;
  priceBig?: string;
  priceNote?: string;
  lines: SummaryLine[];
  totalLabel: string;
  totalValue: string;
  perkText?: string;
  ctaLabel: string;
  ctaVariant?: "yellow" | "softner";
  ctaDisabled?: boolean;
  finePrint?: string;
  error?: string;
  onCta?: () => void;
}

function SuperBgSvg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" fill="none" className="h-full w-full opacity-[0.08]">
        <path d="M-50 140 Q100 60 200 120 Q300 180 450 100" stroke="#fff" strokeWidth="30" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function SummaryCard({
  planLabel,
  planName,
  priceLabel,
  priceBig,
  priceNote,
  lines,
  totalLabel,
  totalValue,
  perkText,
  ctaLabel,
  ctaVariant = "yellow",
  ctaDisabled = false,
  finePrint,
  error,
  onCta,
}: SummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6">
      <SuperBgSvg />
      <div className="relative z-10">
        {/* Top row: plan info + price */}
        {(planName || priceBig) && (
          <div className="mb-5 flex items-start justify-between">
            {planName && (
              <div>
                {planLabel && (
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-white/50">
                    {planLabel}
                  </div>
                )}
                <div className="text-[15px] font-semibold leading-snug text-white">{planName}</div>
              </div>
            )}
            {priceBig && (
              <div className="text-right">
                {priceLabel && (
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-white/50">
                    {priceLabel}
                  </div>
                )}
                <div className="font-[family-name:var(--font-zilla-slab)] text-[38px] font-normal leading-none text-[#F9EBAA]">
                  {priceBig}
                </div>
                {priceNote && (
                  <div className="mt-1 text-[11px] text-white/40">{priceNote}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Line items */}
        <div className="mb-4 border-t border-white/10 pt-3.5 text-[13px]">
          {lines.map((line) => (
            <div key={line.label} className="mb-1.5 flex justify-between text-white/65">
              <span>{line.label}</span>
              <span>{line.value}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-white/[0.12] pt-2.5 text-sm font-semibold text-white">
            <span>{totalLabel}</span>
            <span>{totalValue}</span>
          </div>
        </div>

        {/* Perk box */}
        {perkText && (
          <div className="mb-4 rounded-[10px] border-l-[3px] border-[#F9EBAA] bg-white/[0.08] px-3 py-2.5 text-xs leading-relaxed text-white/70">
            <span className="font-bold text-[#F9EBAA]">★ Subscriber perk:</span> {perkText}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-[10px] bg-red-500/10 px-3 py-2.5 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onCta}
          disabled={ctaDisabled}
          className={cn(
            "w-full rounded-full py-4 text-[15px] font-semibold font-[family-name:var(--font-zilla-slab)] tracking-[0.5px] transition-all",
            ctaDisabled
              ? "cursor-not-allowed opacity-50"
              : "hover:-translate-y-px",
            ctaVariant === "yellow"
              ? "bg-[#F9EBAA] text-[#0a158a] hover:bg-[#f5e080]"
              : "bg-[#A2D5E6] text-[#0a158a] hover:bg-[#84c8de]",
          )}
        >
          {ctaLabel}
        </button>

        {/* Fine print */}
        {finePrint && (
          <div className="mt-3 text-center text-[11px] text-white/30">{finePrint}</div>
        )}
      </div>
    </div>
  );
}
