import { useState, useMemo } from 'react';
import { Eraser, FileText } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdSlot from '@/components/AdSlot';
import {
  LocalProcessingNote,
  HowToUse,
  Faq,
  OtherTools,
  type BiText,
  type FaqItem,
} from '@/components/ToolExtras';
import { toolsById } from '@/data/tools';

const howToSteps: BiText[] = [
  {
    en: 'Type or paste your text into the text box.',
    zh: '在文本框输入或者粘贴文本。',
  },
  {
    en: 'The stats update automatically as you type.',
    zh: '输入时统计数据会实时更新。',
  },
  {
    en: 'Copy your text or results for your work.',
    zh: '复制文本或统计结果用于你的工作。',
  },
];

const faqs: FaqItem[] = [
  {
    questionEn: 'Will you save my text?',
    questionZh: '你们会保存我的文本吗？',
    answerEn:
      'No. Everything runs locally on your browser. We do not receive or store your text.',
    answerZh: '不会。全部运算在你的浏览器本地运行，我们不会接收、存储你的文本。',
  },
  {
    questionEn: 'Does this counter count Chinese characters?',
    questionZh: '这个统计工具支持中文字符统计吗？',
    answerEn: 'Yes, it counts Chinese characters, English words and mixed text.',
    answerZh: '支持，可以统计中文字符、英文单词以及中英文混合文本。',
  },
  {
    questionEn: 'Is this tool free?',
    questionZh: '这个工具是免费的吗？',
    answerEn: 'Yes, this word counter is completely free, no account required.',
    answerZh: '是的，字数统计工具完全免费，无需注册账号。',
  },
];

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
    const readingTime = trimmed ? Math.max(1, Math.round(words / 200)) : 0;

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

      {/* Local processing note */}
      <LocalProcessingNote
        en="All processing runs locally in your browser. Your text will never be uploaded or stored on our server."
        zh="所有计算在浏览器本地执行，你的文本永远不会上传或保存在我们服务器。"
      />

      <HowToUse steps={howToSteps} />
      <Faq items={faqs} />
      <OtherTools currentToolId={tool.id} />

      <AdSlot slot="7777777777" />
    </div>
  );
}
