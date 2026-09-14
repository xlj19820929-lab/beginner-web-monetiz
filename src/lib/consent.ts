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

/** Google AdSense publisher ID. */
export const ADSENSE_CLIENT = 'ca-pub-6410031165107651';

/**
 * Injects the Google AdSense library into the document.
 *
 * Called ONLY after the visitor has granted consent, so that the advertising
 * script is never downloaded or executed before permission is given. Safe to
 * call repeatedly — the script is injected at most once.
 */
export function loadAdSense(): void {
  if (typeof document === 'undefined') return;

  // Already loaded or in the process of loading.
  if (document.querySelector('script[data-adsense-loader]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-adsense-loader', '');

  script.onload = () => {
    // Ask AdSense to fill any <ins class="adsbygoogle"> slots on the page.
    const w = window as Window & { adsbygoogle?: unknown[] };
    w.adsbygoogle = w.adsbygoogle || [];
    try {
      w.adsbygoogle.push({});
    } catch {
      // Nothing to fill yet — slots will push on mount.
    }
  };

  document.head.appendChild(script);
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
 *
 * The AdSense library itself is loaded only when consent is granted — see
 * `loadAdSense()`.
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

  // 3. Load the advertising library only when permission was granted.
  //    Before consent (or after an opt-out) the script is never requested.
  if (granted) {
    loadAdSense();
  }
}
