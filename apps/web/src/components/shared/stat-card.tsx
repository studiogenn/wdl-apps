import { cn } from "@/lib/cn";

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
