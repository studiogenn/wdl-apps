import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "lg" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-detergent-400 text-neutral-100 hover:bg-detergent-500 focus:ring-2 focus:ring-detergent-400 focus:ring-offset-2",
  secondary: "bg-fresh-lemon-200 text-detergent-700 hover:bg-fresh-lemon-300 focus:ring-2 focus:ring-detergent-400 focus:ring-offset-2",
  outline: "bg-transparent text-detergent-400 border-2 border-detergent-400 hover:bg-detergent-100 focus:ring-2 focus:ring-detergent-400 focus:ring-offset-2",
  ghost: "bg-transparent text-detergent-400 hover:bg-detergent-100 focus:ring-2 focus:ring-detergent-400 focus:ring-offset-2",
  destructive: "bg-destructive-200 text-neutral-100 hover:bg-destructive-300 focus:ring-2 focus:ring-destructive-200 focus:ring-offset-2",
};

const sizeStyles: Record<ButtonSize, string> = {
  lg: "px-8 py-3 text-body-s",
  sm: "px-6 py-2 text-body-xs",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "lg", className, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-btn font-body-medium transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
