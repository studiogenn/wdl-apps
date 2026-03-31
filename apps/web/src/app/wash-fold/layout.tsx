import type { Metadata } from "next";
import { getSeoMetadata } from "@/lib/seo";
import { SchemaRenderer } from "@/components/seo/schema-renderer";
import { getServiceSchema, getFaqSchema, WASH_FOLD_FAQ } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata("/wash-fold");
}

export default function WashFoldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaRenderer
        path="/wash-fold"
        defaultSchemas={[
          getServiceSchema({
            serviceType: "Wash and Fold Laundry Service",
            description:
              "Professional wash and fold laundry service with free pickup and delivery. Priced by the pound with 24-hour turnaround.",
            url: "https://wedeliverlaundry.com/wash-fold",
          }),
          getFaqSchema(WASH_FOLD_FAQ),
        ]}
      />
      {children}
    </>
  );
}
