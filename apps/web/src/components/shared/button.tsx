import { type ButtonHTMLAttributes, forwardRef } from "react";
import { buttonVariants, type ButtonVariant, type ButtonSize } from "./button-variants";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "default", className, children, ...props }, ref) => {
    return (
      <button ref={ref} className={buttonVariants({ variant, size, className })} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
