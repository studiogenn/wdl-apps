import { getSeoSchemaMarkup } from "@/lib/seo";

/**
 * Server component that renders JSON-LD structured data into the page.
 *
 * Fetches CMS-managed schema first. If the CMS returns data, it takes
 * priority over the provided defaults. Otherwise, falls back to
 * `defaultSchemas` — typically built with helpers from `@/lib/schema`.
 *
 * Renders one <script type="application/ld+json"> per schema object.
 */
export async function SchemaRenderer({
  path,
  defaultSchemas,
}: {
  readonly path: string;
  readonly defaultSchemas: ReadonlyArray<Record<string, unknown>>;
}) {
  const cmsSchema = await getSeoSchemaMarkup(path);

  const schemas: ReadonlyArray<Record<string, unknown>> = cmsSchema
    ? Array.isArray(cmsSchema)
      ? (cmsSchema as Record<string, unknown>[])
      : [cmsSchema]
    : defaultSchemas;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Safe: JSON.stringify produces escaped output. Data is from trusted CMS or hardcoded defaults, not user input.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
