/**
 * Lightweight client-side SEO / document head manager.
 *
 * The site is a single-page app, so the head tags declared in index.html only
 * describe the home page. This module keeps `document.title`, the meta
 * description, the canonical URL and the social (Open Graph / Twitter) tags in
 * sync with whatever route is currently rendered. Google renders JavaScript and
 * indexes the resulting DOM, so updating these tags per route is what lets each
 * page rank with its own title and description.
 */

import { site } from '@/data/site';

export const SITE_NAME = site.name;
export const SITE_URL = site.url;
export const SITE_TAGLINE = site.tagline;

export interface SeoConfig {
  /** Full page title. Rendered as-is (already includes the site name). */
  title: string;
  /** Meta description, ideally 120-160 characters. */
  description: string;
  /** Route path, e.g. `/tools/word-counter`. Used to build the canonical URL. */
  path: string;
  /** Optional keywords, comma separated. */
  keywords?: string;
  /** Optional schema.org structured data injected as a JSON-LD script tag. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/** Create the tag if it is missing, then return it. */
function ensureMeta(selector: string, create: () => HTMLElement): HTMLElement {  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMetaByName(name: string, content: string): void {
  const el = ensureMeta(`meta[name="${name}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    return meta;
  });
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string): void {
  const el = ensureMeta(`meta[property="${property}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    return meta;
  });
  el.setAttribute('content', content);
}

function setCanonical(href: string): void {
  const el = ensureMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    return link;
  });
  el.setAttribute('href', href);
}

function setJsonLd(data: SeoConfig['jsonLd']): void {
  const existing = document.head.querySelector('#route-jsonld');
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.id = 'route-jsonld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Apply an SEO configuration to the current document head.
 * Safe to call on every render — it only touches the attributes that change.
 */
export function applySeo(config: SeoConfig): void {
  if (typeof document === 'undefined') return;

  const canonicalUrl = `${SITE_URL}${config.path === '/' ? '/' : config.path}`;

  document.title = config.title;

  setMetaByName('description', config.description);
  if (config.keywords) setMetaByName('keywords', config.keywords);

  setMetaByProperty('og:title', config.title);
  setMetaByProperty('og:description', config.description);
  setMetaByProperty('og:url', canonicalUrl);
  setMetaByProperty('og:type', 'website');
  setMetaByProperty('og:site_name', SITE_NAME);
  setMetaByProperty('og:image', `${SITE_URL}/og-image.svg`);

  setMetaByName('twitter:card', 'summary_large_image');
  setMetaByName('twitter:title', config.title);
  setMetaByName('twitter:description', config.description);
  setMetaByName('twitter:image', `${SITE_URL}/og-image.svg`);

  setCanonical(canonicalUrl);
  setJsonLd(config.jsonLd);
}
