import { type HTMLAttributes } from "react";
import { cn } from "./cn";

type CardVariant = "default" | "stat" | "service";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  readonly variant?: CardVariant;
};

const variantStyles: Record<CardVariant, string> = {
  default: "rounded-card bg-neutral-100 border border-neutral-300 p-8",
  stat: "rounded-card bg-detergent-100 p-8 text-center",
  service: "rounded-card-lg bg-neutral-100 border border-neutral-300 px-8 pt-10 pb-8",
};

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
}

type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h4 className={cn("font-heading-medium text-subhead-s text-detergent-700", className)} {...props}>
      {children}
    </h4>
  );
}

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("font-body-light text-body-xs tracking-tight text-neutral-500", className)} {...props}>
      {children}
    </p>
  );
}
