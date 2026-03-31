import { draftMode } from "next/headers";
import { renderRegisteredComponent } from "@/lib/component-registry";
import { DEFAULT_HOME_SECTIONS } from "@/lib/default-home-sections";
import { getSeoSections } from "@/lib/seo";

interface DynamicSectionRendererProps {
  path: string;
  fallbackSections?: readonly string[];
}

function renderFallbackSections(sectionKeys: readonly string[]) {
  return sectionKeys.map((componentKey, index) => {
    return renderRegisteredComponent(componentKey, {}, `${componentKey}-${index}`);
  });
}

export async function DynamicSectionRenderer({
  path,
  fallbackSections = DEFAULT_HOME_SECTIONS,
}: DynamicSectionRendererProps) {
  const { isEnabled: isDraft } = await draftMode();
  const sections = await getSeoSections(path, isDraft);

  if (!sections) {
    return <>{renderFallbackSections(fallbackSections)}</>;
  }

  const orderedVisibleSections = sections
    .filter((section) => section.visible !== false)
    .sort((left, right) => left.section_order - right.section_order);

  return (
    <>
      {orderedVisibleSections.map((section, index) => {
        const componentKey = section.component_key || section.section_type;
        return renderRegisteredComponent(
          componentKey,
          section.config ?? {},
          `${section.section_type}-${section.section_order}-${index}`,
        );
      })}
    </>
  );
}
