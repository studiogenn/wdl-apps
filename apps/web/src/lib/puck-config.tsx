'use client';

import type { Config } from '@measured/puck';
import { DropZone } from '@measured/puck';
import { Hero } from '@/components/home/Hero';
import { Services } from '@/components/home/Services';
import { FAQ } from '@/components/home/FAQ';
import { CTABanner } from '@/components/home/CTABanner';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { TrustedBrands } from '@/components/home/TrustedBrands';
import { ByTheNumbers } from '@/components/home/ByTheNumbers';
import { ContainerSection } from '@/components/editor/container-section';
import { ColumnsSection } from '@/components/editor/columns-section';
import { SpacerSection } from '@/components/editor/spacer-section';
import { TextBlock } from '@/components/editor/text-block';
import { ButtonSection } from '@/components/editor/button-section';
import { ImageSection } from '@/components/editor/image-section';
import { imagePickerField } from '@/lib/puck-fields';
import {
  SECTION_DEFAULTS,
  type HeroConfig,
  type ServicesConfig,
  type FaqConfig,
  type CtaConfig,
  type HowItWorksConfig,
  type TestimonialsConfig,
  type TrustedBrandsConfig,
  type ByTheNumbersConfig,
  type ContainerConfig,
  type ColumnsConfig,
  type SpacerConfig,
  type TextBlockConfig,
  type ButtonConfig,
  type ImageSectionConfig,
} from '@/lib/section-defaults';

/**
 * Props type map for all Puck-managed components.
 * Each key matches the component_key used in the CMS sections API.
 */
type PuckComponentProps = {
  hero: HeroConfig;
  services: ServicesConfig;
  faq: FaqConfig;
  cta: CtaConfig;
  how_it_works: HowItWorksConfig;
  testimonials: TestimonialsConfig;
  trusted_brands: TrustedBrandsConfig;
  by_the_numbers: ByTheNumbersConfig;
  container: ContainerConfig;
  columns: ColumnsConfig;
  spacer: SpacerConfig;
  text_block: TextBlockConfig;
  button: ButtonConfig;
  image_section: ImageSectionConfig;
};

/** Strip Puck-injected props (id, puck, editMode) from the render props. */
function stripPuckProps<T extends Record<string, unknown>>(
  props: T
): Omit<T, 'id' | 'puck' | 'editMode'> {
  const { id, puck, editMode, ...rest } = props;
  void id;
  void puck;
  void editMode;
  return rest;
}

const heroDefaults = SECTION_DEFAULTS.hero as HeroConfig;
const servicesDefaults = SECTION_DEFAULTS.services as ServicesConfig;
const faqDefaults = SECTION_DEFAULTS.faq as FaqConfig;
const ctaDefaults = SECTION_DEFAULTS.cta as CtaConfig;
const howItWorksDefaults = SECTION_DEFAULTS.how_it_works as HowItWorksConfig;
const testimonialsDefaults = SECTION_DEFAULTS.testimonials as TestimonialsConfig;
const trustedBrandsDefaults = SECTION_DEFAULTS.trusted_brands as TrustedBrandsConfig;
const byTheNumbersDefaults = SECTION_DEFAULTS.by_the_numbers as ByTheNumbersConfig;
const imageSectionDefaults = SECTION_DEFAULTS.image_section as ImageSectionConfig;

/**
 * Puck array field definition for the Hero bulletPoints.
 *
 * Puck's ArrayField requires keyed objects ({ value: string }) rather than
 * bare strings, but the HeroConfig types bulletPoints as string[].
 * We cast to Fields<HeroConfig>[string] to satisfy the Config generic
 * while preserving correct runtime behavior.
 */
const bulletPointsField = {
  type: 'array' as const,
  label: 'Bullet Points',
  arrayFields: {
    value: { type: 'text' as const, label: 'Bullet Point' },
  },
  getItemSummary: (item: Record<string, string>) => item.value || '(empty)',
};

export const puckConfig: Config<PuckComponentProps> = {
  categories: {
    heroes: {
      components: ['hero'],
      title: 'Heroes',
    },
    content: {
      components: ['services', 'how_it_works', 'faq'],
      title: 'Content',
    },
    social_proof: {
      components: ['testimonials', 'trusted_brands', 'by_the_numbers'],
      title: 'Social Proof',
    },
    cta: {
      components: ['cta'],
      title: 'Call to Action',
    },
    layout: {
      components: ['container', 'columns', 'spacer'],
      title: 'Layout',
    },
    elements: {
      components: ['text_block', 'button'],
      title: 'Elements',
    },
    media: {
      components: ['image_section'],
      title: 'Media',
    },
  },

  components: {
    hero: {
      label: 'Hero',
      defaultProps: {
        heading: heroDefaults.heading,
        subheading: heroDefaults.subheading,
        ctaText: heroDefaults.ctaText,
        ctaLink: heroDefaults.ctaLink,
        backgroundColor: '',
        secondaryCtaText: heroDefaults.secondaryCtaText,
        secondaryCtaLink: heroDefaults.secondaryCtaLink,
        bulletPoints: heroDefaults.bulletPoints,
        heroImage: '',
      },
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        ctaText: { type: 'text', label: 'CTA Button Text' },
        ctaLink: { type: 'text', label: 'CTA Button Link' },
        backgroundColor: { type: 'text', label: 'Background Color (CSS value)' },
        secondaryCtaText: { type: 'text', label: 'Secondary CTA Text' },
        secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bulletPoints: bulletPointsField as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        heroImage: { ...imagePickerField, label: 'Hero Image' } as any,
      },
      render: (props) => {
        const { bulletPoints, ...rest } = stripPuckProps(props);
        // Puck array fields store items as { value: string } objects.
        // The Hero component expects a plain string[].
        const resolvedBulletPoints = bulletPoints
          ? (bulletPoints as unknown as Array<{ value: string }>).map((bp) => bp.value)
          : undefined;
        return <Hero {...rest} bulletPoints={resolvedBulletPoints} />;
      },
    },

    services: {
      label: 'Services',
      defaultProps: {
        title: servicesDefaults.title,
        heading: servicesDefaults.heading,
        subheading: servicesDefaults.subheading,
        showPricing: servicesDefaults.showPricing,
      },
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        showPricing: {
          type: 'radio',
          label: 'Show Pricing',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return <Services {...componentProps} />;
      },
    },

    faq: {
      label: 'FAQ',
      defaultProps: {
        title: faqDefaults.title,
        heading: faqDefaults.heading,
        introText: faqDefaults.introText,
        items: faqDefaults.items,
      },
      fields: {
        title: { type: 'text', label: 'Title', contentEditable: true },
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        introText: { type: 'textarea', label: 'Intro Text', contentEditable: true },
        items: {
          type: 'array',
          label: 'FAQ Items',
          arrayFields: {
            question: { type: 'text', label: 'Question' },
            answer: { type: 'textarea', label: 'Answer' },
          },
          defaultItemProps: {
            question: 'New question',
            answer: 'Answer goes here',
          },
          getItemSummary: (item) => item.question || '(empty question)',
        },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return <FAQ {...componentProps} />;
      },
    },

    cta: {
      label: 'CTA Banner',
      defaultProps: {
        heading: ctaDefaults.heading,
        subheading: ctaDefaults.subheading,
        ctaText: ctaDefaults.ctaText,
        ctaLink: ctaDefaults.ctaLink,
        secondaryCtaText: ctaDefaults.secondaryCtaText,
        secondaryCtaLink: ctaDefaults.secondaryCtaLink,
      },
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        ctaText: { type: 'text', label: 'CTA Button Text' },
        ctaLink: { type: 'text', label: 'CTA Button Link' },
        secondaryCtaText: { type: 'text', label: 'Secondary CTA Text' },
        secondaryCtaLink: { type: 'text', label: 'Secondary CTA Link' },
      },
      render: (props) => {
        // CTABanner only accepts { config?: CtaConfig }, so wrap props into config.
        const componentProps = stripPuckProps(props);
        return <CTABanner config={componentProps} />;
      },
    },

    how_it_works: {
      label: 'How It Works',
      defaultProps: {
        heading: howItWorksDefaults.heading,
        subheading: howItWorksDefaults.subheading,
        eyebrow: howItWorksDefaults.eyebrow,
      },
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        eyebrow: { type: 'text', label: 'Eyebrow Text', contentEditable: true },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return <HowItWorks config={componentProps} />;
      },
    },

    testimonials: {
      label: 'Testimonials',
      defaultProps: {
        heading: testimonialsDefaults.heading,
        subheading: testimonialsDefaults.subheading,
        eyebrow: testimonialsDefaults.eyebrow,
      },
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        eyebrow: { type: 'text', label: 'Eyebrow Text', contentEditable: true },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return <Testimonials config={componentProps} />;
      },
    },

    trusted_brands: {
      label: 'Trusted Brands',
      defaultProps: {
        heading: trustedBrandsDefaults.heading,
      },
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return <TrustedBrands config={componentProps} />;
      },
    },

    by_the_numbers: {
      label: 'By The Numbers',
      defaultProps: {
        heading: byTheNumbersDefaults.heading,
        subheading: byTheNumbersDefaults.subheading,
        eyebrow: byTheNumbersDefaults.eyebrow,
      },
      fields: {
        heading: { type: 'text', label: 'Heading', contentEditable: true },
        subheading: { type: 'textarea', label: 'Subheading', contentEditable: true },
        eyebrow: { type: 'text', label: 'Eyebrow Text', contentEditable: true },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return <ByTheNumbers config={componentProps} />;
      },
    },

    /* ── Layout primitives ── */

    container: {
      label: 'Container',
      defaultProps: {
        maxWidth: 'default',
        paddingY: 'md',
        paddingX: 'md',
        backgroundColor: '',
      },
      fields: {
        maxWidth: {
          type: 'select',
          label: 'Max Width',
          options: [
            { label: 'Full (100%)', value: 'full' },
            { label: 'Wide (1280px)', value: 'wide' },
            { label: 'Default (1024px)', value: 'default' },
            { label: 'Narrow (768px)', value: 'narrow' },
          ],
        },
        paddingY: {
          type: 'select',
          label: 'Vertical Padding',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small (16px)', value: 'sm' },
            { label: 'Medium (32px)', value: 'md' },
            { label: 'Large (48px)', value: 'lg' },
            { label: 'Extra Large (64px)', value: 'xl' },
          ],
        },
        paddingX: {
          type: 'select',
          label: 'Horizontal Padding',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small (16px)', value: 'sm' },
            { label: 'Medium (32px)', value: 'md' },
            { label: 'Large (48px)', value: 'lg' },
          ],
        },
        backgroundColor: { type: 'text', label: 'Background Color (CSS value)' },
      },
      render: (props) => {
        const { maxWidth, paddingY, paddingX, backgroundColor } = stripPuckProps(props);
        return (
          <ContainerSection
            maxWidth={maxWidth ?? 'default'}
            paddingY={paddingY ?? 'md'}
            paddingX={paddingX ?? 'md'}
            backgroundColor={backgroundColor ?? ''}
          >
            <DropZone zone="content" />
          </ContainerSection>
        );
      },
    },

    columns: {
      label: 'Columns',
      defaultProps: {
        columns: 2,
        gap: 'md',
        verticalAlign: 'top',
        stackOnMobile: true,
      },
      fields: {
        columns: {
          type: 'select',
          label: 'Number of Columns',
          options: [
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
          ],
        },
        gap: {
          type: 'select',
          label: 'Gap',
          options: [
            { label: 'Small (16px)', value: 'sm' },
            { label: 'Medium (24px)', value: 'md' },
            { label: 'Large (32px)', value: 'lg' },
          ],
        },
        verticalAlign: {
          type: 'select',
          label: 'Vertical Alignment',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
        },
        stackOnMobile: {
          type: 'radio',
          label: 'Stack on Mobile',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
      },
      render: (props) => {
        const { columns, gap, verticalAlign, stackOnMobile } = stripPuckProps(props);
        const colCount = columns ?? 2;
        return (
          <ColumnsSection
            columns={colCount}
            gap={gap ?? 'md'}
            verticalAlign={verticalAlign ?? 'top'}
            stackOnMobile={stackOnMobile ?? true}
          >
            {Array.from({ length: colCount }, (_, i) => (
              <DropZone key={i} zone={`column-${i}`} />
            ))}
          </ColumnsSection>
        );
      },
    },

    spacer: {
      label: 'Spacer',
      defaultProps: {
        height: 'md',
      },
      fields: {
        height: {
          type: 'select',
          label: 'Height',
          options: [
            { label: 'Extra Small (16px)', value: 'xs' },
            { label: 'Small (32px)', value: 'sm' },
            { label: 'Medium (48px)', value: 'md' },
            { label: 'Large (64px)', value: 'lg' },
            { label: 'Extra Large (96px)', value: 'xl' },
            { label: '2XL (128px)', value: '2xl' },
          ],
        },
      },
      render: (props) => {
        const { height } = stripPuckProps(props);
        return <SpacerSection height={height ?? 'md'} />;
      },
    },

    text_block: {
      label: 'Text Block',
      defaultProps: {
        content: 'Enter your text here',
        fontSize: 'base',
        fontWeight: 'normal',
        textAlign: 'left',
        color: '#050B39',
      },
      fields: {
        content: { type: 'textarea', label: 'Content' },
        fontSize: {
          type: 'select',
          label: 'Font Size',
          options: [
            { label: 'Small (14px)', value: 'sm' },
            { label: 'Base (16px)', value: 'base' },
            { label: 'Large (18px)', value: 'lg' },
            { label: 'XL (20px)', value: 'xl' },
            { label: '2XL (24px)', value: '2xl' },
          ],
        },
        fontWeight: {
          type: 'select',
          label: 'Font Weight',
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Medium', value: 'medium' },
            { label: 'Semibold', value: 'semibold' },
            { label: 'Bold', value: 'bold' },
          ],
        },
        textAlign: {
          type: 'radio',
          label: 'Text Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        color: { type: 'text', label: 'Text Color (CSS value)' },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return (
          <TextBlock
            content={componentProps.content ?? 'Enter your text here'}
            fontSize={componentProps.fontSize ?? 'base'}
            fontWeight={componentProps.fontWeight ?? 'normal'}
            textAlign={componentProps.textAlign ?? 'left'}
            color={componentProps.color ?? '#050B39'}
          />
        );
      },
    },

    button: {
      label: 'Button',
      defaultProps: {
        text: 'Click Here',
        href: '#',
        variant: 'primary',
        size: 'md',
        align: 'left',
        fullWidth: false,
      },
      fields: {
        text: { type: 'text', label: 'Button Text' },
        href: { type: 'text', label: 'Link URL' },
        variant: {
          type: 'select',
          label: 'Variant',
          options: [
            { label: 'Primary (filled)', value: 'primary' },
            { label: 'Secondary (light)', value: 'secondary' },
            { label: 'Outline (border)', value: 'outline' },
          ],
        },
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        align: {
          type: 'radio',
          label: 'Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        fullWidth: {
          type: 'radio',
          label: 'Full Width',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return (
          <ButtonSection
            text={componentProps.text ?? 'Click Here'}
            href={componentProps.href ?? '#'}
            variant={componentProps.variant ?? 'primary'}
            size={componentProps.size ?? 'md'}
            align={componentProps.align ?? 'left'}
            fullWidth={componentProps.fullWidth ?? false}
          />
        );
      },
    },

    image_section: {
      label: 'Image / Banner',
      defaultProps: {
        src: imageSectionDefaults.src ?? '',
        alt: imageSectionDefaults.alt ?? '',
        aspectRatio: imageSectionDefaults.aspectRatio ?? 'auto',
        maxWidth: imageSectionDefaults.maxWidth ?? 'container',
        caption: imageSectionDefaults.caption ?? '',
      },
      fields: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        src: { ...imagePickerField, label: 'Image' } as any,
        alt: { type: 'text', label: 'Alt Text' },
        aspectRatio: {
          type: 'select',
          label: 'Aspect Ratio',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '16:9', value: '16:9' },
            { label: '4:3', value: '4:3' },
            { label: '21:9 (Ultrawide)', value: '21:9' },
          ],
        },
        maxWidth: {
          type: 'select',
          label: 'Max Width',
          options: [
            { label: 'Full Width', value: 'full' },
            { label: 'Container (1200px)', value: 'container' },
            { label: 'Narrow (800px)', value: 'narrow' },
          ],
        },
        caption: { type: 'text', label: 'Caption' },
      },
      render: (props) => {
        const componentProps = stripPuckProps(props);
        return <ImageSection {...componentProps} />;
      },
    },
  },
};
