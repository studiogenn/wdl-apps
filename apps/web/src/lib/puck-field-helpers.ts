import type { Data } from '@measured/puck';
import type { SeoSection } from '@/lib/seo';
import { SECTION_DEFAULTS } from '@/lib/section-defaults';

/**
 * Convert API sections response to Puck Data format.
 *
 * Each SeoSection becomes a content item in Puck's data structure.
 * The component_key maps to the Puck component type, and the section
 * config becomes the component props.
 */
export function sectionsToPuckData(sections: SeoSection[]): Data {
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.section_order - b.section_order);

  const content = visibleSections.map((section, index) => {
    const defaults = SECTION_DEFAULTS[section.component_key] ?? {};
    const config = section.config ?? {};

    // Merge defaults with section config. Section config takes precedence.
    // Use Record<string, unknown> since we're handling a union of different config shapes.
    const mergedProps: Record<string, unknown> = { ...defaults, ...config };

    // Puck's hero component stores bulletPoints as { value: string }[] objects
    // because Puck array fields require keyed objects, not bare strings.
    if (
      section.component_key === 'hero' &&
      Array.isArray(mergedProps.bulletPoints)
    ) {
      const rawPoints = mergedProps.bulletPoints as unknown[];
      mergedProps.bulletPoints = rawPoints.map((point) =>
        typeof point === 'string' ? { value: point } : point
      );
    }

    return {
      type: section.component_key,
      props: {
        ...mergedProps,
        id: `section-${section.component_key}-${index}`,
      },
    };
  });

  return {
    root: { props: {} },
    content,
  } as Data;
}

/**
 * Convert Puck Data back to the section format the API expects.
 *
 * Each content item becomes a section with its type, order, config, and visibility.
 * Props injected by Puck (id, puck, editMode) are stripped from the config.
 */
export function puckDataToSections(
  data: Data
): Array<{
  section_type: string;
  component_key: string;
  section_order: number;
  config: Record<string, unknown>;
  visible: boolean;
}> {
  return data.content.map((item, index) => {
    const allProps = item.props as Record<string, unknown> & { id: string };
    const { id, ...configProps } = allProps;
    void id;

    // Convert hero bulletPoints back from Puck's { value: string }[] to string[].
    if (item.type === 'hero' && Array.isArray(configProps.bulletPoints)) {
      const puckPoints = configProps.bulletPoints as unknown[];
      configProps.bulletPoints = puckPoints.map((point) => {
        if (typeof point === 'object' && point !== null && 'value' in point) {
          return (point as { value: string }).value;
        }
        return point;
      });
    }

    // Strip any undefined values to keep the payload clean.
    const cleanConfig: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(configProps)) {
      if (value !== undefined) {
        cleanConfig[key] = value;
      }
    }

    return {
      section_type: item.type as string,
      component_key: item.type as string,
      section_order: index,
      config: cleanConfig,
      visible: true,
    };
  });
}
