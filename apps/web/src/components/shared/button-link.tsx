import Link from "next/link";
import { buttonVariants, type ButtonVariant, type ButtonSize } from "./button-variants";

/**
 * A Next.js `<Link>` styled as a button. Use for navigation CTAs.
 * For form submit buttons, use `<Button>` instead.
 *
 * @example
 * <ButtonLink href="/account">Schedule Pick-up</ButtonLink>
 * <ButtonLink href="/wash-fold" variant="outline">View Pricing</ButtonLink>
 * <ButtonLink href="/contact" size="sm" className="mt-4">Contact Us</ButtonLink>
 */
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
