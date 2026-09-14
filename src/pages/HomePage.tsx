import { useState, useMemo } from 'react';
import { Search, Sparkles, Zap, Shield } from 'lucide-react';
import { tools } from '@/data/tools';
import { navigate } from '@/lib/router';
import AdSlot from '@/components/AdSlot';
import { usePageMeta, homeJsonLd } from '@/lib/usePageMeta';

const categoryLabels: Record<string, string> = {
  text: 'Text Tools',
  dev: 'Developer Tools',
  health: 'Health Tools',
  utility: 'Utilities',
};

const categoryOrder = ['text', 'dev', 'utility', 'health'];

export default function HomePage() {
  usePageMeta({
    title: 'ToolKit — Free Online Tools for Everyone',
    description:
      'Use 6+ free online tools: password generator, word counter, unit converter, color converter, case converter and BMI calculator. No signup, no installs — everything runs privately in your browser.',
    keywords:
      'free online tools, password generator, word counter, unit converter, color converter, case converter, BMI calculator, browser tools',
    path: '/',
    jsonLd: homeJsonLd,
  });

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return tools;
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.short.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof tools> = {};
    for (const t of filtered) {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    }
    return map;
  }, [filtered]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white border-b border-ink-100">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-5 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            100% free — no signup required
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink-900 tracking-tight animate-slide-up">
            Free Online Tools
            <br />
            <span className="text-brand-600">for everyday tasks</span>
          </h1>
          <p className="mt-4 text-lg text-ink-500 max-w-2xl mx-auto animate-slide-up">
            Six fast, privacy-friendly tools that run right in your browser —
            password generator, word counter, unit converter and more. No
            signups, no installs, no data collected.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto relative animate-scale-in">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Everything runs locally — instant results' },
            { icon: Shield, title: 'Privacy First', desc: 'Your data never leaves your browser' },
            { icon: Sparkles, title: 'Always Free', desc: 'No signup, no hidden fees' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-ink-100">
              <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold text-ink-800 text-sm">{f.title}</p>
                <p className="text-ink-500 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AdSlot slot="1111111111" />
      </div>

      {/* SEO intro */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="rounded-2xl bg-brand-50 border border-brand-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-ink-900 mb-2">
            Free online tools that just work
          </h2>
          <p className="text-ink-700 text-base leading-relaxed">
            ToolKit brings together a growing collection of free online tools for
            everyday tasks — text utilities, developer helpers, converters and
            calculators. There is nothing to install and no account to create:
            every tool runs entirely in your browser, so your input stays on your
            device and results appear instantly. It is ideal for students,
            writers, developers and anyone who needs a quick, reliable answer
            without the clutter.
          </p>
        </div>
      </section>

      {/* Tool grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-400 text-lg">No tools found for "{query}"</p>
            <button onClick={() => setQuery('')} className="btn-ghost mt-3">
              Clear search
            </button>
          </div>
        ) : (
          categoryOrder.map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat} className="mb-10">
                <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-4">
                  {categoryLabels[cat]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => navigate(`/tools/${tool.id}`)}
                        className="tool-card text-left group"
                      >
                        <div className="flex items-start gap-4">
                          <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                            <Icon className="w-6 h-6" />
                          </span>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-ink-900 group-hover:text-brand-600 transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-ink-500 mt-0.5">{tool.short}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
