import { Wrench, Heart, Shield } from 'lucide-react';
import { navigate } from '@/lib/router';
import { tools } from '@/data/tools';
import { legalPages } from '@/data/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </span>
              <span className="font-semibold text-ink-800">ToolKit</span>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed">
              Free, fast and privacy-friendly online tools. No signup required —
              everything runs in your browser.
            </p>
          </div>

          {/* Popular tools */}
          <div>
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">
              Popular Tools
            </h3>
            <ul className="space-y-2">
              {tools.slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigate(`/tools/${tool.id}`)}
                    className="text-sm text-ink-500 hover:text-brand-600 transition-colors text-left"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              {legalPages.slice(0, 2).map((page) => (
                <li key={page.path}>
                  <button
                    onClick={() => navigate(page.path)}
                    className="text-sm text-ink-500 hover:text-brand-600 transition-colors text-left"
                  >
                    {page.footerLabel}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal — permanent links, always visible */}
          <div>
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalPages.slice(2).map((page) => (
                <li key={page.path}>
                  <button
                    onClick={() => navigate(page.path)}
                    className="text-sm text-ink-500 hover:text-brand-600 transition-colors text-left"
                  >
                    {page.footerLabel}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ads and privacy notice */}
        <div className="mt-10 pt-6 border-t border-ink-100">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <Shield className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <p className="text-xs text-ink-400 leading-relaxed">
              All tools run entirely in your browser — the data you enter is never
              sent to our servers. This site is supported by advertising served by
              Google AdSense and third-party partners, which may use cookies to
              show personalised ads. You can opt out at any time; see our{' '}
              <button
                onClick={() => navigate('/privacy-policy')}
                className="underline hover:text-brand-600"
              >
                Privacy Policy
              </button>{' '}
              for details.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-ink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-400">
            © {year} ToolKit. All rights reserved.
          </p>
          <p className="text-sm text-ink-400 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-brand-500" /> for everyone
          </p>
        </div>

        {/* Legal links repeated as plain inline links for reliability */}
        <nav
          aria-label="Legal"
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {legalPages.map((page) => (
            <a
              key={page.path}
              href={page.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(page.path);
              }}
              className="text-xs text-ink-400 hover:text-brand-600 transition-colors"
            >
              {page.footerLabel}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
