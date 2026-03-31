import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";
import { SchemaRenderer } from "@/components/seo/schema-renderer";
import {
  getLocalBusinessSchema,
  getFaqSchema,
  SERVICE_AREAS_FAQ,
} from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/service-areas");
}

export default function ServiceAreasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaRenderer
        path="/service-areas"
        defaultSchemas={[getLocalBusinessSchema(), getFaqSchema(SERVICE_AREAS_FAQ)]}
      />
      {children}
    </>
  );
}
