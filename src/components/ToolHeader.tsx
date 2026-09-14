import { ArrowLeft } from 'lucide-react';
import { navigate } from '@/lib/router';
import { usePageMeta, toolJsonLd } from '@/lib/usePageMeta';
import type { ToolMeta } from '@/data/tools';

interface ToolHeaderProps {
  tool: ToolMeta;
}

/**
 * Renders the heading for a tool page and applies that tool's SEO metadata
 * (title, meta description, canonical URL and SoftwareApplication JSON-LD).
 */
export default function ToolHeader({ tool }: ToolHeaderProps) {
  const Icon = tool.icon;
  const path = `/tools/${tool.id}`;

  usePageMeta({
    title: `${tool.name} — Free Online Tool | ToolKit`,
    description: tool.description,
    keywords: tool.keywords.join(', '),
    path,
    jsonLd: toolJsonLd(tool.name, tool.description, path),
  });

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
