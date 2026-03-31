import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  readonly heading: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly align?: "center" | "left";
  readonly size?: "lg" | "default";
  readonly headingAs?: "h1" | "h2" | "h3";
  readonly className?: string;
  readonly headingClassName?: string;
}

export function SectionHeader({
  heading,
  eyebrow,
  description,
  align = "center",
  size = "default",
  headingAs: Tag = "h2",
  className,
  headingClassName,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={className}>
      {eyebrow ? (
        <p
          className={cn(
            "text-sm uppercase tracking-[0.15em] font-[family-name:var(--font-poppins)] font-body-medium text-navy/50 mb-2",
            centered && "text-center",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={cn(
          "font-heading-medium text-navy uppercase",
          size === "lg"
            ? "text-[2rem] lg:text-[2.625rem]"
            : "text-[1.75rem] lg:text-[2.25rem]",
          centered && "text-center",
          description ? "mb-3" : "mb-10",
          headingClassName,
        )}
      >
        {heading}
      </Tag>
      {description ? (
        <p
          className={cn(
            "font-[family-name:var(--font-poppins)] text-navy/70 text-[15px] leading-relaxed",
            centered && "text-center max-w-2xl mx-auto",
            "mb-12",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
