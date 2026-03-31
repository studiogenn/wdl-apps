import { createElement } from "react";
import { ByTheNumbers } from "@/components/home/ByTheNumbers";
import { CTABanner } from "@/components/home/CTABanner";
import { FAQ } from "@/components/home/FAQ";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Services } from "@/components/home/Services";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustedBrands } from "@/components/home/TrustedBrands";

type RegisteredComponent =
  | typeof Hero
  | typeof TrustedBrands
  | typeof Services
  | typeof HowItWorks
  | typeof ByTheNumbers
  | typeof Testimonials
  | typeof CTABanner
  | typeof FAQ;

export const componentRegistry: Record<string, RegisteredComponent> = {
  hero: Hero,
  trusted_brands: TrustedBrands,
  services: Services,
  how_it_works: HowItWorks,
  by_the_numbers: ByTheNumbers,
  testimonials: Testimonials,
  cta: CTABanner,
  cta_banner: CTABanner,
  faq: FAQ,
};

export function getComponent(key: string): RegisteredComponent | null {
  return componentRegistry[key] ?? null;
}

export function renderRegisteredComponent(
  key: string,
  props: Record<string, unknown> = {},
  reactKey?: string,
) {
  const Component = getComponent(key);
  if (!Component) return null;

  return createElement(Component as React.ComponentType<Record<string, unknown>>, {
    ...props,
    ...(reactKey ? { key: reactKey } : {}),
  });
}
