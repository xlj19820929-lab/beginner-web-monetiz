import { useState, useEffect, useCallback } from 'react';
import { Cookie, X, Shield, Settings2 } from 'lucide-react';
import { navigate } from '@/lib/router';
import { getConsent, saveConsent, applyAdConsent, type ConsentValue } from '@/lib/consent';

/**
 * Cookie consent banner.
 *
 * Google AdSense requires sites serving visitors in the EEA/UK to obtain
 * consent before using cookies for personalised advertising. This banner
 * records the visitor's choice in local storage and updates Google's Consent
 * Mode signals accordingly. The banner never blocks the tools themselves.
 *
 * Consent logic lives in `@/lib/consent` so it can also be used by ad slots.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (existing === null) {
      // Small delay so the banner does not fight with first paint.
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
    // Re-apply a previously stored choice on every page load.
    applyAdConsent(existing);
  }, []);

  const decide = useCallback((value: Exclude<ConsentValue, null>) => {
    saveConsent(value);
    applyAdConsent(value);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 animate-slide-up"
    >
      <div className="max-w-4xl mx-auto rounded-2xl border border-ink-200 bg-white shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink-900 text-sm sm:text-base">
                We value your privacy
              </p>
              <p className="text-ink-600 text-sm leading-relaxed mt-1">
                We use cookies to keep this site running and, with your consent,
                third-party partners including Google may use cookies to show
                personalised ads. Tool input you type stays on your device and is
                never sent to us.
              </p>

              {showDetails && (
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex gap-2 text-ink-600">
                    <Shield className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-ink-800">Essential:</strong> required
                      for the site to function (for example, remembering this
                      choice). These cannot be switched off.
                    </span>
                  </li>
                  <li className="flex gap-2 text-ink-600">
                    <Settings2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-ink-800">Advertising:</strong> set by
                      Google AdSense and its partners to measure and personalise
                      ads. Choose &quot;Essential only&quot; to receive
                      non-personalised ads instead.
                    </span>
                  </li>
                </ul>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                <button
                  onClick={() => setShowDetails((v) => !v)}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  {showDetails ? 'Hide details' : 'Show details'}
                </button>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-sm text-ink-500 hover:text-brand-600 underline"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
            <button
              onClick={() => decide('rejected')}
              aria-label="Dismiss and use essential cookies only"
              className="text-ink-400 hover:text-ink-600 p-1 shrink-0 -mt-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <button
              onClick={() => decide('rejected')}
              className="btn-secondary w-full sm:w-auto text-sm"
            >
              Essential only
            </button>
            <button
              onClick={() => decide('accepted')}
              className="btn-primary w-full sm:w-auto text-sm"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
