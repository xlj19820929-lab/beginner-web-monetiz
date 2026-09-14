import { useEffect } from 'react';
import { applySeo, SITE_NAME, SITE_URL, SITE_TAGLINE, type SeoConfig } from '@/lib/seo';
import type { ToolMeta } from '@/data/tools';

/**
 * Applies per-route SEO metadata and records a page view.
 *
 * Usage inside a page component:
 *   usePageMeta({ title: '...', description: '...', path: '/about' });
 */
export function usePageMeta(config: SeoConfig): void {
  useEffect(() => {
    applySeo(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.title, config.description, config.path]);
}

/** Reusable Organization + WebSite structured data for the home page. */
export const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    description:
      'Free, browser-based online tools including a password generator, word counter, unit converter, color converter, case converter and BMI calculator.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
  },
];

/** Builds SoftwareApplication structured data for a single tool page. */
export function toolJsonLd(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web browser)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

/** A bilingual Q&A pair as rendered by the on-page FAQ section. */
export interface FaqEntry {
  questionEn: string;
  questionZh: string;
  answerEn: string;
  answerZh: string;
}

/**
 * Builds FAQPage structured data from the bilingual FAQ entries.
 *
 * Each on-page question is emitted as its own Question node with both the
 * English and Chinese text joined into `name`/`text`. Google matches the
 * visible wording against this markup, so the strings here must stay identical
 * to what the page renders — which is why the callers pass the very data they
 * hand to the `Faq` component rather than a second copy.
 */
export function faqJsonLd(items: readonly FaqEntry[]) {
  if (items.length === 0) return undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: `${item.questionEn} ${item.questionZh}`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${item.answerEn} ${item.answerZh}`,
      },
    })),
  };
}

/**
 * Applies a tool page's SEO metadata, combining the SoftwareApplication schema
 * with optional FAQPage schema.
 *
 * Both are passed as a single `jsonLd` array so that only one component writes
 * `#route-jsonld` — the tag is replaced wholesale on each write, so splitting
 * these across two `usePageMeta` calls would silently drop one of them.
 */
export function useToolSeo(tool: ToolMeta, faq: readonly FaqEntry[]): void {
  const path = `/tools/${tool.id}`;
  const faqSchema = faqJsonLd(faq);

  usePageMeta({
    title: `${tool.name} — Free Online Tool | ToolKit`,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    path,
    jsonLd: [
      toolJsonLd(tool.name, tool.description, path),
      ...(faqSchema ? [faqSchema] : []),
    ],
  });
}
