import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";
import { SchemaRenderer } from "@/components/seo/schema-renderer";
import {
  getServiceSchema,
  getFaqSchema,
  COMMERCIAL_FAQ,
} from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/commercial-laundry");
}

export default function CommercialLaundryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaRenderer
        path="/commercial-laundry"
        defaultSchemas={[
          getServiceSchema({
            serviceType: "Commercial Laundry Service",
            description:
              "Dependable commercial laundry solutions for businesses of all sizes with scheduled pickup, professional cleaning, and on-time delivery.",
            url: "https://wedeliverlaundry.com/commercial-laundry",
          }),
          getFaqSchema(COMMERCIAL_FAQ),
        ]}
      />
      {children}
    </>
  );
}
