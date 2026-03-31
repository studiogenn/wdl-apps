import { renderRegisteredComponent } from "@/lib/component-registry";

interface SectionRendererProps {
  type: string;
  config?: Record<string, unknown> | null;
}

export function SectionRenderer({ type, config }: SectionRendererProps) {
  return renderRegisteredComponent(type, config ?? {});
}
