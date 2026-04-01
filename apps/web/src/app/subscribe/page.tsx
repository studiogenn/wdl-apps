import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SectionHeader } from "@/components/shared";
import { SubscribeButton } from "@/components/subscribe/subscribe-button";

export const dynamic = "force-dynamic";

const INCLUDED_FEATURES = [
  "Doorstep pickup",
  "Professional wash & fold",
  "Same-week delivery",
  "Eco-friendly detergents",
] as const;

export default async function SubscribePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/account");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <SectionHeader
        eyebrow="Subscription"
        heading="Unlimited Laundry Service"
        description="One flat monthly rate covers pickup, wash, fold, and delivery. Only pay extra if you go over the base weight."
        headingAs="h1"
      />

      <div className="rounded-xl border border-navy/10 bg-white p-6">
        {/* Pricing */}
        <div className="mb-6 text-center">
          <p className="text-4xl font-heading-medium text-navy">
            $100<span className="text-lg text-navy/60">/month</span>
          </p>
          <p className="mt-2 font-[family-name:var(--font-poppins)] text-sm text-navy/60">
            + $0.02/lb overage after base weight
          </p>
        </div>

        {/* Included features */}
        <ul className="mb-8 space-y-3">
          {INCLUDED_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 font-[family-name:var(--font-poppins)] text-sm text-navy"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                &#10003;
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <SubscribeButton />
      </div>
    </div>
  );
}
