/**
 * Cookie consent state helpers.
 *
 * Kept separate from the `CookieConsent` component so that components and
 * modules can import the consent logic without importing React components
 * (which would break Fast Refresh boundaries).
 */

export const CONSENT_STORAGE_KEY = 'toolkit-cookie-consent';

export type ConsentValue = 'accepted' | 'rejected' | null;

/**
 * Reads the consent choice from local storage.
 * Returns null when the visitor has not chosen yet.
 */
export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw === 'accepted' || raw === 'rejected') return raw;
  } catch {
    // localStorage can throw in private mode or when disabled — fail open.
  }
  return null;
}

/** Persists the visitor's choice. */
export function saveConsent(value: Exclude<ConsentValue, null>): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures; the banner simply reappears next visit.
  }
}

/**
 * Notifies Google AdSense of the visitor's consent state so that
 * personalised advertising is only requested when consent was granted.
 *
 * Two mechanisms are used together:
 *  1. Google Consent Mode v2 signals (`gtag('consent', 'update', …)`), which
 *     were defaulted to "denied" in index.html.
 *  2. AdSense's legacy `requestNonPersonalizedAds` flag, which is still honoured
 *     by classic AdSense tags.
 */
export function applyAdConsent(value: Exclude<ConsentValue, null>): void {
  if (typeof window === 'undefined') return;

  const granted = value === 'accepted';

  const w = window as Window & {
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number };
    gtag?: (...args: unknown[]) => void;
  };

  // 1. Consent Mode v2
  w.gtag?.('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });

  // 2. AdSense non-personalised ads flag
  w.adsbygoogle = w.adsbygoogle || [];
  w.adsbygoogle.requestNonPersonalizedAds = granted ? 0 : 1;

  try {
    w.adsbygoogle.push({});
  } catch {
    // AdSense script not loaded yet — safe to ignore.
  }
}
