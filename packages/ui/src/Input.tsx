import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./cn";

type InputSize = "lg" | "sm";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  readonly inputSize?: InputSize;
  readonly error?: string;
};

const sizeStyles: Record<InputSize, string> = {
  lg: "h-14 text-body-s",
  sm: "h-12 text-body-xs",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = "lg", error, className, ...props }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          className={cn(
            "w-full rounded-md border-2 px-4 font-body-light transition-colors",
            "bg-neutral-200 text-detergent-700 placeholder:text-neutral-400",
            "focus:bg-neutral-100 focus:border-detergent-400 focus:outline-none",
            error ? "border-destructive-200" : "border-neutral-300",
            sizeStyles[inputSize],
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[12px] font-body text-destructive-200">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
