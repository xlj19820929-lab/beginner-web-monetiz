import { ArrowLeft } from 'lucide-react';
import { navigate } from '@/lib/router';
import type { ToolMeta } from '@/data/tools';

interface ToolHeaderProps {
  tool: ToolMeta;
}

/**
 * Renders the heading for a tool page.
 *
 * NOTE: this component deliberately does NOT call `usePageMeta`. The route's
 * `<title>`, meta description, canonical URL and JSON-LD are applied by the
 * tool page itself, which also owns the FAQ structured data. Keeping the SEO
 * call in one place avoids two `#route-jsonld` writers racing each other —
 * `setJsonLd` replaces the whole tag, so the last writer would win and the
 * other schema type would be dropped.
 */
export default function ToolHeader({ tool }: ToolHeaderProps) {
  const Icon = tool.icon;

  return (
    <div className="mb-8">
      <button
        onClick={() => navigate('/')}
        className="btn-ghost mb-4 -ml-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </button>
      <div className="flex items-center gap-4">
        <span
          className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <Icon className="w-7 h-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{tool.name}</h1>
          <p className="text-ink-500 mt-1">{tool.description}</p>
        </div>
      </div>
    </div>
  );
}
