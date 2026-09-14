import { useEffect, useRef, useState } from 'react';
import { getConsent, loadAdSense, type ConsentValue } from '@/lib/consent';

interface AdSlotProps {
  slot?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[] & { requestNonPersonalizedAds?: number };
  }
}

/**
 * A single AdSense ad slot.
 *
 * The slot renders nothing until the visitor has granted consent. The AdSense
 * library is never loaded from here — that happens in `applyAdConsent()` in
 * `src/lib/consent.ts`, so that the advertising script is not requested before
 * permission is given.
 */
export default function AdSlot({
  slot = '',
  format = 'auto',
  responsive = true,
  className = '',
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const [consent, setConsent] = useState<ConsentValue>(null);

  // Read the stored choice on mount. `getConsent()` is safe during render on
  // the client, but reading it in an effect keeps SSR/hydration unambiguous.
  useEffect(() => {
    const current = getConsent();
    setConsent(current);

    if (current === 'accepted') {
      // Consent was granted earlier in a previous visit — make sure the library
      // is present before we try to fill the slot.
      loadAdSense();
    }
  }, []);

  // Fill the slot once the library is ready.
  useEffect(() => {
    if (consent !== 'accepted') return;

    const w = typeof window !== 'undefined'
      ? (window as Window & { adsbygoogle?: unknown[] })
      : undefined;
    if (!w) return;

    w.adsbygoogle = w.adsbygoogle || [];
    try {
      w.adsbygoogle.push({});
    } catch {
      // AdSense not ready yet — the loader will push on script load.
    }
  }, [consent]);

  // No consent (yet), or the visitor opted out of advertising cookies:
  // do not render an ad container at all.
  if (consent !== 'accepted') return null;

  return (
    <div
      className={`ad-container my-8 flex justify-center ${className}`}
      aria-label="Advertisement"
      role="complementary"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6410031165107651"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
