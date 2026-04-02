import { cn } from "@/lib/cn";
import {
  getBagPrice,
  BEDDING_PRICE,
  freqOptions,
  careUpgrades,
  fmt,
  type SubState,
  type PageView,
} from "./pricing-data";
import { SummaryCard } from "./SummaryCard";

function PageHeroSmall({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative overflow-hidden bg-primary px-5 pb-9 pt-7 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none" fill="none" className="h-full w-full opacity-[0.08]">
          <path d="M-50 140 Q100 60 200 120 Q300 180 450 100" stroke="#fff" strokeWidth="20" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="relative z-10">
        <h2 className="text-2xl font-normal uppercase tracking-[1.5px] text-white">{title}</h2>
        <p className="mt-1.5 text-[13px] text-white/65">{subtitle}</p>
      </div>
    </div>
  );
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
        checked ? "border-primary bg-primary" : "border-[#e8e5d0] bg-transparent",
      )}
    >
      {checked && (
        <svg viewBox="0 0 10 10" fill="none" className="h-2 w-2">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

interface SubscriptionBuilderProps {
  state: SubState;
  onChange: (next: SubState) => void;
  onNavigate: (page: PageView) => void;
  onCheckout: () => void;
  checkoutLoading: boolean;
  checkoutError: string | null;
}

export function SubscriptionBuilder({ state, onChange, onNavigate, onCheckout, checkoutLoading, checkoutError }: SubscriptionBuilderProps) {
  const s = state;

  const update = (partial: Partial<SubState>) => {
    let next = { ...s, ...partial };
    // Biweekly requires minimum 2 bags
    if (next.freq === "biweekly" && next.bags < 2) next = { ...next, bags: 2 };
    onChange(next);
  };

  const setFreq = (freq: SubState["freq"]) => {
    update({ freq, bags: freq === "biweekly" && s.bags < 2 ? 2 : s.bags });
  };

  const toggleCare = (id: string) => {
    const idx = s.selectedCare.indexOf(id);
    const next = [...s.selectedCare];
    if (idx >= 0) next.splice(idx, 1);
    else next.push(id);
    update({ selectedCare: next });
  };

  /* ---- Computed values ---- */
  const freqObj = freqOptions.find((f) => f.value === s.freq)!;
  const bagPrice = getBagPrice(s.freq, s.bags);
  const monthlyBags = s.bags * freqObj.pickups;
  const monthlyBase = bagPrice * monthlyBags;
  const beddingPickups = s.beddingFreq === "monthly" ? 1 : 2;
  const beddingTotal = s.addBedding ? BEDDING_PRICE * beddingPickups : 0;
  const careMonthly = s.selectedCare.reduce((sum, id) => {
    const c = careUpgrades.find((x) => x.id === id);
    return sum + (c ? c.price * monthlyBags : 0);
  }, 0);
  const monthlyTotal = monthlyBase + beddingTotal + careMonthly;
  const perPickup =
    bagPrice * s.bags +
    s.selectedCare.reduce((sum, id) => {
      const c = careUpgrades.find((x) => x.id === id);
      return sum + (c ? c.price * s.bags : 0);
    }, 0);

  /* ---- Care to show (sub only shows family + premium) ---- */
  const careToShow = careUpgrades.filter((c) => c.id === "family" || c.id === "premium");

  /* ---- Summary lines ---- */
  const lines = [
    { label: `Laundry (${monthlyBags} bag${monthlyBags > 1 ? "s" : ""}/month)`, value: `${fmt(monthlyBase)}/mo` },
    ...(s.addBedding ? [{ label: `Bed Refresh (${beddingPickups}x/month)`, value: `${fmt(beddingTotal)}/mo` }] : []),
    ...(careMonthly > 0 ? [{ label: "Care preferences", value: `${fmt(careMonthly)}/mo` }] : []),
  ];

  return (
    <div>
      <PageHeroSmall
        title={s.suggestion ? "Your suggested plan" : "Choose your plan"}
        subtitle="From $1.95/lb · Free pickup & delivery"
      />

      <div className="mx-auto max-w-[500px] px-4 pb-24">
        {/* Suggestion banner */}
        {s.suggestion && s.quizAnswers && (
          <div className="mt-5 rounded-[14px] border-[1.5px] border-[#A2D5E6] bg-[#d4eef6] px-4 py-3 text-[13px] leading-relaxed text-[#0a158a]">
            Based on your answers:{" "}
            <strong>
              {s.bags} bag{s.bags > 1 ? "s" : ""} {freqObj.label.toLowerCase()}
            </strong>
            .
            {(s.quizAnswers.baby === "yes" || s.quizAnswers.pets === "yes") && (
              <>
                {" "}We&apos;ve pre-selected <strong>Family Sort + Hypoallergenic</strong> — ideal for{" "}
                {s.quizAnswers.baby === "yes" && s.quizAnswers.pets === "yes"
                  ? "households with babies and pets"
                  : s.quizAnswers.baby === "yes"
                    ? "households with babies"
                    : "pet households"}
                .
              </>
            )}
          </div>
        )}

        {/* Bags */}
        <span className="mt-6 block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          How many bags per pickup?
        </span>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((n) => {
            const disabled = n === 1 && s.freq === "biweekly";
            return (
              <button
                key={n}
                onClick={() => !disabled && update({ bags: n })}
                disabled={disabled}
                className={cn(
                  "rounded-[14px] border-[1.5px] px-1.5 py-3.5 text-center text-[15px] font-semibold transition-all",
                  disabled
                    ? "cursor-not-allowed border-[#e8e5d0] bg-[#f5f5f5] text-[#c0c0c0]"
                    : s.bags === n
                      ? "border-primary bg-primary text-white"
                      : "border-[#e8e5d0] bg-white text-[#0a1580] hover:border-primary hover:bg-[#f0f3ff]",
                )}
              >
                {n} {n === 1 ? "bag" : "bags"}
                <span className={cn("mt-1 block text-[10px] font-normal", disabled ? "text-[#c0c0c0]" : s.bags === n ? "text-white/65" : "text-[#6b7db3]")}>
                  {disabled ? "weekly only" : `${n * 15}-${n * 18} lbs`}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 mb-4 text-center text-[11px] leading-relaxed text-[#6b7db3]">
          Each bag holds ~15-18 lbs. Bag zipper must close. Overages billed at $1.99/lb.
        </p>

        {/* Frequency */}
        <span className="block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">How often?</span>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {freqOptions.map((f) => (
            <button
              key={f.value}
              onClick={() => setFreq(f.value)}
              className={cn(
                "rounded-[14px] border-[1.5px] px-1.5 py-3.5 text-center text-[15px] font-semibold transition-all",
                s.freq === f.value
                  ? "border-primary bg-primary text-white"
                  : "border-[#e8e5d0] bg-white text-[#0a1580] hover:border-primary hover:bg-[#f0f3ff]",
              )}
            >
              {f.value === "weekly" && (
                <span className="mb-1 inline-block rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-[1.5px] text-white">
                  Most popular
                </span>
              )}
              <span className="block">{f.label}</span>
              <span className={cn("mt-1 block text-[10px] font-normal", s.freq === f.value ? "text-white/65" : "text-[#6b7db3]")}>
                {f.note}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-1.5 mb-4 text-center text-[11px] text-[#6b7db3]">Most popular: every week at $1.95/lb</p>

        <div className="my-5 h-px bg-[#e8e5d0]" />

        {/* Care preferences */}
        <span className="block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          Care preferences (optional)
        </span>
        <div className="mt-2.5 flex flex-col gap-2.5">
          {careToShow.map((c) => {
            const isOn = s.selectedCare.includes(c.id);
            const isSuggested = c.id === "family" && s.quizAnswers && (s.quizAnswers.baby === "yes" || s.quizAnswers.pets === "yes");
            return (
              <button
                key={c.id}
                onClick={() => toggleCare(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[14px] border-[1.5px] px-4 py-3.5 text-left transition-all",
                  isOn ? "border-primary bg-[#f0f3ff]" : "border-[#e8e5d0] bg-white",
                )}
              >
                <span className="text-xl">{c.emoji}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className={cn("text-[13px] font-semibold", isOn ? "text-primary" : "text-[#0a1580]")}>{c.name}</span>
                    <span className="text-xs text-[#6b7db3]">+${c.price}/bag</span>
                    {isSuggested && (
                      <span className="rounded-full border border-[#A2D5E6] bg-[#d4eef6] px-2 py-0.5 text-[10px] font-bold text-[#0a158a]">
                        Suggested
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-[#6b7db3]">{c.note}</div>
                </div>
                <RadioDot checked={isOn} />
              </button>
            );
          })}
        </div>
        <div className="mt-2 rounded-[14px] border border-[#A2D5E6] bg-[#d4eef6] px-4 py-3 text-xs leading-relaxed text-[#0a158a]">
          <strong>Got heavily soiled items?</strong> Leave them in a separate disposable bag with your regular pickup.
          We&apos;ll deep clean them at <strong>$1.49/item</strong> — billed after pickup.
        </div>

        <div className="my-5 h-px bg-[#e8e5d0]" />

        {/* Bedding */}
        <span className="block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          Add Bed Refresh to your plan?
        </span>
        <div
          className={cn(
            "mt-2.5 overflow-hidden rounded-[14px] border-[1.5px] bg-[#F9EBAA] transition-all",
            s.addBedding ? "border-[#d4b93c]" : "border-[#e8e5d0]",
          )}
        >
          <button onClick={() => update({ addBedding: !s.addBedding })} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
            <span className="text-2xl">🛏️</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-[#0a158a]">Bed Refresh — $58.99/order</div>
              <div className="mt-0.5 text-xs text-[#6b7db3]">Sheets, comforters, duvets, pillowcases</div>
            </div>
            <RadioDot checked={s.addBedding} />
          </button>
          {s.addBedding && (
            <div className="border-t border-black/[0.08] px-4 pb-3.5">
              <div className="mb-2 mt-2.5 text-xs text-[#6b7db3]">How often?</div>
              <div className="grid grid-cols-2 gap-2">
                {(["monthly", "bimonthly"] as const).map((val) => (
                  <button
                    key={val}
                    onClick={() => update({ beddingFreq: val })}
                    className={cn(
                      "rounded-[10px] border-[1.5px] bg-white/60 py-2 text-[13px] font-semibold text-[#0a158a] transition-all",
                      s.beddingFreq === val ? "border-[#d4b93c] bg-white" : "border-black/10",
                    )}
                  >
                    {val === "monthly" ? "Once a month" : "Twice a month"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="mt-1.5 mb-6 text-center text-[11px] text-[#6b7db3]">
          Also available as a one-time order — no subscription needed.
        </p>

        {/* Summary */}
        <SummaryCard
          planLabel="Your plan"
          planName={`${s.bags} bag${s.bags > 1 ? "s" : ""} · ${freqObj.label.toLowerCase()}`}
          priceLabel="per pickup"
          priceBig={fmt(perPickup)}
          priceNote={`${fmt(monthlyTotal)}/month`}
          lines={lines}
          totalLabel="Total/month"
          totalValue={fmt(monthlyTotal)}
          perkText="Before any scheduled pickup, add specialty items, care upgrades, or a Bed Refresh. No extra trip needed — just add it to your next pickup."
          ctaLabel={checkoutLoading ? "LOADING…" : "START MY PLAN"}
          ctaVariant="yellow"
          ctaDisabled={checkoutLoading}
          error={checkoutError ?? undefined}
          finePrint="No contracts · Cancel anytime · Free pickup and delivery"
          onCta={onCheckout}
        />

        <button onClick={() => onNavigate("home")} className="mt-4 w-full py-2 text-center text-[13px] text-[#6b7db3] hover:text-primary">
          ← Back to home
        </button>
      </div>
    </div>
  );
}
