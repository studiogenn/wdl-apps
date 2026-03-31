import { type ButtonHTMLAttributes, forwardRef } from "react";
import { buttonVariants, type ButtonVariant, type ButtonSize } from "./button-variants";

/**
 * A styled `<button>` element. Use for form submissions and interactive actions.
 * For navigation links styled as buttons, use `<ButtonLink>` instead.
 *
 * @example
 * <Button type="submit">Submit</Button>
 * <Button variant="outline" onClick={handleClick}>Cancel</Button>
 * <Button className="w-full" disabled={isLoading}>Save</Button>
 */
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
