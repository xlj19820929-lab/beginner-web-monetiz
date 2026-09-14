/**
 * Central site configuration.
 *
 * Update the values here (especially `url` and `email`) to match your real
 * domain before deploying, and keep them in sync with `public/robots.txt`
 * and `public/sitemap.xml`.
 */
export const site = {
  name: 'ToolKit',
  tagline: 'Free Online Tools for Everyone',
  /** Canonical production URL — no trailing slash. */
  url: 'https://toolkit-tools.pages.dev',
  email: 'xlj19820929@gmail.com',
  adsenseClient: 'ca-pub-6410031165107651',
  /** Bumped whenever any legal page changes; shown on each legal page. */
  legalUpdated: 'September 14, 2026',
} as const;

/** Public navigation pages shown in the header and footer. */
export const legalPages = [
  { path: '/about', label: 'About Us', footerLabel: 'About Us' },
  { path: '/contact', label: 'Contact', footerLabel: 'Contact Us' },
  { path: '/privacy-policy', label: 'Privacy Policy', footerLabel: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service', footerLabel: 'Terms of Service' },
  { path: '/disclaimer', label: 'Disclaimer', footerLabel: 'Disclaimer' },
] as const;

export type LegalPage = (typeof legalPages)[number];
