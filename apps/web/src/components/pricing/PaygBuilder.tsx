import { cn } from "@/lib/cn";
import {
  PAYG_RATE,
  PAYG_RUSH_RATE,
  PAYG_FEE,
  PAYG_MIN,
  BEDDING_PRICE,
  DEEP_CLEAN_PAYG_ITEM_PRICE,
  careUpgrades,
  specialtyItems,
  fmt,
  type PaygState,
  type PageView,
} from "./pricing-data";
import { SummaryCard } from "./SummaryCard";
import { AddressInput } from "@/components/account/address-input";

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

function QtyControl({ count, onMinus, onPlus }: { count: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onMinus}
        className="flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-[#e8e5d0] bg-white text-base font-bold text-[#6b7db3] transition-transform hover:scale-110"
      >
        −
      </button>
      <span className="min-w-[18px] text-center text-sm font-bold text-primary">{count}</span>
      <button
        onClick={onPlus}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-base font-bold text-white transition-transform hover:scale-110"
      >
        +
      </button>
    </div>
  );
}

interface PaygBuilderProps {
  state: PaygState;
  onChange: (next: PaygState) => void;
  onNavigate: (page: PageView) => void;
  onCheckout: () => void;
  checkoutLoading: boolean;
  checkoutError: string | null;
}

export function PaygBuilder({ state, onChange, onNavigate, onCheckout, checkoutLoading, checkoutError }: PaygBuilderProps) {
  const p = state;
  const update = (partial: Partial<PaygState>) => onChange({ ...p, ...partial });

  const rate = p.rush ? PAYG_RUSH_RATE : PAYG_RATE;

  const toggleCare = (id: string) => {
    const idx = p.selectedCare.indexOf(id);
    const next = [...p.selectedCare];
    if (idx >= 0) next.splice(idx, 1);
    else next.push(id);
    update({ selectedCare: next });
  };

  const updateSpec = (name: string, delta: number) => {
    const cur = p.specialtyQty[name] || 0;
    const next = Math.max(0, cur + delta);
    const qty = { ...p.specialtyQty };
    if (next === 0) delete qty[name];
    else qty[name] = next;
    update({ specialtyQty: qty });
  };

  /* ---- Computed totals ---- */
  const laundryTotal = Math.max(PAYG_MIN, p.lbs * rate) + PAYG_FEE;
  const careTotal = p.selectedCare.reduce((s, id) => {
    const c = careUpgrades.find((x) => x.id === id);
    return s + (c ? c.price : 0);
  }, 0);
  const deepTotal = p.deepItems * DEEP_CLEAN_PAYG_ITEM_PRICE;
  const specTotal = Object.entries(p.specialtyQty).reduce((s, [name, qty]) => {
    const item = specialtyItems.find((i) => i.name === name);
    return s + (item ? item.price * qty : 0);
  }, 0);
  const beddingTotal = p.addBedding ? BEDDING_PRICE : 0;
  const orderTotal = laundryTotal + careTotal + deepTotal + specTotal + beddingTotal;

  const summaryLines = [
    { label: `Laundry (${p.lbs} lbs est. · ${p.rush ? "$3.50" : "$2.75"}/lb + pickup)`, value: fmt(laundryTotal) },
    ...(p.addBedding ? [{ label: "Bed Refresh", value: fmt(beddingTotal) }] : []),
    ...(careTotal > 0 ? [{ label: "Care upgrades", value: fmt(careTotal) }] : []),
    ...(p.deepItems > 0 ? [{ label: `Deep clean items (${p.deepItems})`, value: fmt(deepTotal) }] : []),
    ...(specTotal > 0 ? [{ label: "Specialty items", value: fmt(specTotal) }] : []),
  ];

  return (
    <div>
      <PageHeroSmall title="One-time order" subtitle="No subscription · Schedule when you want" />

      <div className="mx-auto max-w-[500px] px-4 pb-24">
        {/* Address */}
        <span className="mt-6 block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          Pickup address
        </span>
        <div className="mt-2.5">
          <AddressInput
            value={p.address}
            onChange={(addr) => update({ address: addr, routeID: null })}
            onValidated={(id) => update({ routeID: id })}
            onInvalid={() => update({ routeID: null })}
          />
        </div>

        <div className="my-5 h-px bg-[#e8e5d0]" />

        {/* Laundry slider */}
        <span className="block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          Laundry (wash and fold)
        </span>
        <div className="mt-2.5 rounded-[14px] border-[1.5px] border-[#e8e5d0] bg-white p-[18px]">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-base font-bold text-primary">{p.rush ? "$3.50/lb" : "$2.75/lb"}</div>
              <div className="mt-0.5 text-xs text-[#6b7db3]">
                {p.rush ? "Rush — 24hr turnaround" : "Standard — 48hr turnaround"} · +{fmt(PAYG_FEE)} pickup · ${PAYG_MIN} min
              </div>
            </div>
            <button
              onClick={() => update({ rush: !p.rush })}
              className={cn(
                "rounded-full border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition-all",
                p.rush
                  ? "border-[#d4b93c] bg-[#F9EBAA] text-[#0a158a]"
                  : "border-[#e8e5d0] bg-white text-[#6b7db3]",
              )}
            >
              ⚡ {p.rush ? "Rush on" : "Rush"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-[13px] text-[#6b7db3]">Est. lbs</span>
            <input
              type="range"
              min={5}
              max={60}
              step={1}
              value={p.lbs}
              onChange={(e) => update({ lbs: Number(e.target.value) })}
              className="flex-1 accent-primary"
            />
            <span className="min-w-[50px] text-right text-[15px] font-bold text-primary">{p.lbs} lbs</span>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-[#6b7db3]">
            Not sure? An average bag is ~15-18 lbs. You&apos;re only charged for actual weight at pickup.
          </p>
        </div>

        {/* Bed Refresh */}
        <span className="mt-6 block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          Bed Refresh (optional)
        </span>
        <button
          onClick={() => update({ addBedding: !p.addBedding })}
          className={cn(
            "mt-2.5 flex w-full items-center gap-3 rounded-[14px] border-[1.5px] bg-[#F9EBAA] px-4 py-3.5 text-left transition-all",
            p.addBedding ? "border-[#d4b93c]" : "border-[#e8e5d0]",
          )}
        >
          <span className="text-2xl">🛏️</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-[#0a158a]">Bed Refresh — $58.99</div>
            <div className="mt-0.5 text-xs text-[#6b7db3]">Sheets, comforters, duvets, pillowcases</div>
          </div>
          <RadioDot checked={p.addBedding} />
        </button>

        {/* Care upgrades */}
        <span className="mt-6 block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          Care upgrades (optional)
        </span>
        <div className="mt-2.5 flex flex-col gap-2.5">
          {careUpgrades.map((c) => {
            const isOn = p.selectedCare.includes(c.id);
            return (
              <div key={c.id}>
                <button
                  onClick={() => toggleCare(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 border-[1.5px] px-4 py-3.5 text-left transition-all",
                    isOn ? "border-primary bg-[#f0f3ff]" : "border-[#e8e5d0] bg-white",
                    c.id === "deepclean" && isOn
                      ? "rounded-t-[14px] border-b-0"
                      : "rounded-[14px]",
                  )}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <div className="flex-1">
                    <div className={cn("text-[13px] font-semibold", isOn ? "text-primary" : "text-[#0a1580]")}>
                      {c.name} <span className="font-normal text-[#6b7db3]">+${c.price}/{c.unit}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-[#6b7db3]">{c.note}</div>
                  </div>
                  <RadioDot checked={isOn} />
                </button>
                {/* Deep clean expand */}
                {c.id === "deepclean" && isOn && (
                  <div className="rounded-b-[14px] border-[2px] border-t-0 border-primary bg-[#f0f3ff] px-4 py-3">
                    <div className="mb-2 text-xs text-[#6b7db3]">Or add individual items at $1.99/item in a separate disposable bag</div>
                    <div className="flex items-center gap-2.5">
                      <span className="flex-1 text-[13px] font-semibold text-primary">Individual items</span>
                      <QtyControl
                        count={p.deepItems}
                        onMinus={() => update({ deepItems: Math.max(0, p.deepItems - 1) })}
                        onPlus={() => update({ deepItems: p.deepItems + 1 })}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Specialty items */}
        <span className="mt-6 block text-[10px] font-semibold uppercase tracking-[2px] text-[#6b7db3]">
          Specialty items (optional)
        </span>
        <div className="mt-2.5">
          <button
            onClick={() => update({ showSpecialty: !p.showSpecialty })}
            className={cn(
              "flex w-full items-center gap-3 border-[1.5px] border-[#e8e5d0] bg-white px-4 py-3.5 text-left transition-all",
              p.showSpecialty ? "rounded-t-[14px] border-b-0" : "rounded-[14px]",
            )}
          >
            <span className="text-xl">👔</span>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-[#0a1580]">Specialty wash and fold</div>
              <div className="text-xs text-[#6b7db3]">Rugs, coats, duvets, tablecloths, sneakers & more</div>
            </div>
            <span className="text-lg font-bold text-primary">{p.showSpecialty ? "−" : "+"}</span>
          </button>
          {p.showSpecialty && (
            <div className="overflow-hidden rounded-b-[14px] border-[1.5px] border-t-0 border-[#e8e5d0] bg-white">
              {specialtyItems.map((item, i) => (
                <div
                  key={item.name}
                  className={cn(
                    "flex items-center px-4 py-2.5",
                    i < specialtyItems.length - 1 && "border-b border-cream",
                    i % 2 === 1 && "bg-cream",
                  )}
                >
                  <span className="flex-1 text-[13px] text-[#0a1580]">{item.name}</span>
                  <span className="mr-3.5 text-[13px] text-[#6b7db3]">{fmt(item.price)}</span>
                  <QtyControl
                    count={p.specialtyQty[item.name] || 0}
                    onMinus={() => updateSpec(item.name, -1)}
                    onPlus={() => updateSpec(item.name, 1)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4">
          <SummaryCard
            planLabel="Order summary"
            lines={summaryLines}
            totalLabel="Estimated total"
            totalValue={fmt(orderTotal)}
            ctaLabel={checkoutLoading ? "LOADING…" : "SCHEDULE PICKUP"}
            ctaVariant="softner"
            ctaDisabled={checkoutLoading || !p.routeID}
            error={checkoutError ?? undefined}
            finePrint="Charged by actual weight at pickup · $30 minimum"
            onCta={onCheckout}
          />
        </div>

        <button onClick={() => onNavigate("home")} className="mt-4 w-full py-2 text-center text-[13px] text-[#6b7db3] hover:text-primary">
          ← Back to home
        </button>
      </div>
    </div>
  );
}
