import type { Metadata } from "next";
import { DynamicSectionRenderer } from "@/components/seo/dynamic-section-renderer";
import { SchemaRenderer } from "@/components/seo/schema-renderer";
import { GhlPopup } from "@/components/ghl-popup";
import { getSeoMetadata } from "@/lib/seo";
import { getLocalBusinessSchema, getFaqSchema, HOME_FAQ } from "@/lib/schema";

export { DEFAULT_HOME_SECTIONS } from "@/lib/default-home-sections";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/");
}

export default async function Home() {
  return (
    <>
      <SchemaRenderer
        path="/"
        defaultSchemas={[getLocalBusinessSchema(), getFaqSchema(HOME_FAQ)]}
      />
      <DynamicSectionRenderer path="/" />
      <GhlPopup />
    </>
  );
}
