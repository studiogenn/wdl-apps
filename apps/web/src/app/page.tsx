import type { Metadata } from "next";
import { SchemaRenderer } from "@/components/seo/schema-renderer";
import { getSeoMetadata } from "@/lib/seo";
import { getLocalBusinessSchema, getFaqSchema, HOME_FAQ } from "@/lib/schema";
import { Hero } from "@/components/home/Hero";
import { TrustedBrands } from "@/components/home/TrustedBrands";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ByTheNumbers } from "@/components/home/ByTheNumbers";
import { Testimonials } from "@/components/home/Testimonials";
import { CTABanner } from "@/components/home/CTABanner";
import { FAQ } from "@/components/home/FAQ";
import { CustomPlanBanner } from "@/components/home/CustomPlanBanner";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/");
}

export default function Home() {
  return (
    <>
      <SchemaRenderer
        path="/"
        defaultSchemas={[getLocalBusinessSchema(), getFaqSchema(HOME_FAQ)]}
      />
      <Hero />
      <TrustedBrands />
      <CustomPlanBanner />
      <Services />
      <HowItWorks />
      <ByTheNumbers />
      <Testimonials />
      <CTABanner />
      <FAQ />
    </>
  );
}
