import { useEffect, useRef } from 'react';
import { getConsent } from '@/lib/consent';

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

export default function AdSlot({
  slot = '',
  format = 'auto',
  responsive = true,
  className = '',
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Respect the visitor's stored choice: only request non-personalised ads
    // when they explicitly opted out of advertising cookies.
    const consent = getConsent();
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      if (consent === 'rejected') {
        window.adsbygoogle.requestNonPersonalizedAds = 1;
      }
    }

    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch {
      // AdSense not loaded yet — safe to ignore.
    }
  }, []);

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
