import { type HTMLAttributes } from "react";
import { cn } from "./cn";

type BadgeVariant = "step" | "savings" | "active" | "processing" | "pending" | "error" | "disabled" | "section";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  readonly variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  step: "bg-fresh-lemon-200 text-detergent-700",
  savings: "bg-fresh-lemon-100 text-detergent-700",
  active: "bg-detergent-100 text-detergent-400",
  processing: "bg-detergent-100 text-detergent-300",
  pending: "bg-fresh-lemon-100 text-fresh-lemon-300",
  error: "bg-destructive-100 text-neutral-100",
  disabled: "bg-neutral-200 text-neutral-500",
  section: "bg-transparent text-detergent-400",
};

export function Badge({ variant = "active", className, children, ...props }: BadgeProps) {
  const isSection = variant === "section";

  return (
    <span
      className={cn(
        "inline-block font-body-medium uppercase tracking-cta",
        isSection ? "text-subtext-s" : "rounded-full px-3 py-1 text-subtext-xs",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
