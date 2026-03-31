import { cn } from "@/lib/cn";

const base = "inline-flex items-center justify-center rounded-full font-[family-name:var(--font-inter)] font-body-medium transition-colors";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  outline: "border border-primary text-primary hover:bg-primary hover:text-white",
} as const;

const sizes = {
  default: "px-6 py-2.5 text-sm",
  sm: "px-5 py-2.5 text-xs",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonVariants({
  variant = "primary",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
