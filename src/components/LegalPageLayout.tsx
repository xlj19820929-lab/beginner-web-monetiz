import { useEffect, type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { navigate } from '@/lib/router';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string;
  /** Short summary shown in the highlighted intro box. */
  intro?: ReactNode;
  children: ReactNode;
}

/**
 * Shared shell for the static information pages (privacy, terms, about, etc.).
 * Keeps typography and spacing consistent across all of them.
 */
export default function LegalPageLayout({
  title,
  lastUpdated,
  intro,
  children,
}: LegalPageLayoutProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [title]);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => navigate('/')} className="btn-ghost mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </button>

      <h1 className="text-3xl font-bold text-ink-900 mb-2">{title}</h1>
      {lastUpdated && (
        <p className="text-ink-400 text-sm mb-8">Last updated: {lastUpdated}</p>
      )}

      {intro && (
        <div className="rounded-2xl bg-brand-50 border border-brand-100 px-6 py-5 mb-10">
          <p className="text-ink-800 leading-relaxed">{intro}</p>
        </div>
      )}

      <div className="space-y-8 text-ink-700 leading-relaxed">{children}</div>
    </article>
  );
}

/** Section heading used throughout the legal pages. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-ink-900 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

/** External link styled consistently across legal content. */
export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-600 underline hover:text-brand-700 break-words"
    >
      {children}
    </a>
  );
}
