import { useState, useMemo } from 'react';
import { Eraser, FileText } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdSlot from '@/components/AdSlot';
import { toolsById } from '@/data/tools';

export default function WordCounter() {
  const tool = toolsById['word-counter'];
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || 1 : 0;
    const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter(Boolean).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const readingTime = Math.max(1, Math.round(words / 200));

    return { words, characters, charactersNoSpaces, sentences, paragraphs, lines, readingTime };
  }, [text]);

  const statCards = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Lines', value: stats.lines },
    { label: 'Reading Time', value: `${stats.readingTime} min` },
  ];

  return (
    <div className="tool-shell">
      <ToolHeader tool={tool} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-ink-200 p-4 text-center">
            <p className="text-2xl font-bold text-brand-600">{s.value}</p>
            <p className="text-xs text-ink-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Text area */}
      <div className="bg-white rounded-2xl border border-ink-200 p-1">
        <div className="flex items-center justify-between px-4 py-2 border-b border-ink-100">
          <span className="flex items-center gap-2 text-sm font-medium text-ink-600">
            <FileText className="w-4 h-4" />
            Type or paste your text here
          </span>
          {text && (
            <button
              onClick={() => setText('')}
              className="btn-ghost text-sm"
            >
              <Eraser className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing…"
          className="w-full h-72 p-4 rounded-2xl resize-y border-0 focus:outline-none text-ink-800 placeholder:text-ink-400 text-base leading-relaxed"
        />
      </div>
      <AdSlot slot="7777777777" />
    </div>
  );
}
