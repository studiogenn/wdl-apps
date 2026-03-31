import Link from "next/link";
import { buttonVariants, type ButtonVariant, type ButtonSize } from "./button-variants";

interface ButtonLinkProps {
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
  readonly children: React.ReactNode;
}

export function ButtonLink({ href, variant = "primary", size = "default", className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonVariants({ variant, size, className })}>
      {children}
    </Link>
  );
}
