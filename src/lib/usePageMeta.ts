import { useEffect } from 'react';
import { applySeo, SITE_NAME, SITE_URL, SITE_TAGLINE, type SeoConfig } from '@/lib/seo';

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
