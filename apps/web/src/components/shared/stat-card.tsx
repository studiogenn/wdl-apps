import { cn } from "@/lib/cn";

/**
 * Metric display card with optional icon, large value, and label.
 * Default background is `bg-light-blue` — override via `className`.
 *
 * @example
 * <StatCard icon={<ClockIcon />} value="24 Hour" label="Delivery Guarantee" />
 * <StatCard value="9,000+" label="Happy Customers" className="bg-cream py-10" />
 */
interface StatCardProps {
  readonly icon?: React.ReactNode;
  readonly value: string;
  readonly label: string;
  readonly className?: string;
}

export function StatCard({ icon, value, label, className }: StatCardProps) {
  return (
    <div className={cn("bg-light-blue rounded-xl px-6 py-8 text-center", className)}>
      {icon ? <div className="flex justify-center mb-3 text-primary">{icon}</div> : null}
      <p className="font-[family-name:var(--font-poppins)] text-xl font-body-medium text-navy mb-0.5">
        {value}
      </p>
      <p className="font-[family-name:var(--font-poppins)] text-sm text-navy/60">
        {label}
      </p>
    </div>
  );
}
