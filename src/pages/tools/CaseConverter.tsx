import { useState, useMemo } from 'react';
import { Clipboard } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import CopyButton from '@/components/CopyButton';
import AdSlot from '@/components/AdSlot';
import { toolsById } from '@/data/tools';

const conversions = [
  { id: 'upper', label: 'UPPER CASE', fn: (t: string) => t.toUpperCase() },
  { id: 'lower', label: 'lower case', fn: (t: string) => t.toLowerCase() },
  { id: 'title', label: 'Title Case', fn: (t: string) => t.replace(/\w\S*/g, (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()) },
  { id: 'sentence', label: 'Sentence case', fn: (t: string) => t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()) },
  { id: 'camel', label: 'camelCase', fn: (t: string) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { id: 'pascal', label: 'PascalCase', fn: (t: string) => {
    const camel = t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase());
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }},
  { id: 'snake', label: 'snake_case', fn: (t: string) => t.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') },
  { id: 'kebab', label: 'kebab-case', fn: (t: string) => t.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') },
];

export default function CaseConverter() {
  const tool = toolsById['case-converter'];
  const [text, setText] = useState('');
  const [activeId, setActiveId] = useState('upper');

  const result = useMemo(() => {
    const conv = conversions.find((c) => c.id === activeId);
    return conv ? conv.fn(text) : text;
  }, [text, activeId]);

  return (
    <div className="tool-shell">
      <ToolHeader tool={tool} />

      {/* Input */}
      <div className="bg-white rounded-2xl border border-ink-200 p-1 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          className="w-full h-32 p-4 rounded-2xl resize-y border-0 focus:outline-none text-ink-800 placeholder:text-ink-400 text-base leading-relaxed"
        />
      </div>

      {/* Conversion buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {conversions.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeId === c.id
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Result */}
      <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100">
          <span className="flex items-center gap-2 text-sm font-medium text-ink-600">
            <Clipboard className="w-4 h-4" />
            Result
          </span>
          {result && <CopyButton value={result} />}
        </div>
        <div className="p-4 min-h-[5rem] text-ink-800 text-base leading-relaxed break-all whitespace-pre-wrap">
          {result || <span className="text-ink-400">Your converted text will appear here…</span>}
        </div>
      </div>
      <AdSlot slot="3333333333" />
    </div>
  );
}
