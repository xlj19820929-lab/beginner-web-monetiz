import { useState, useMemo } from 'react';
import { Clipboard } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import CopyButton from '@/components/CopyButton';
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

const howToSteps: BiText[] = [
  {
    en: 'Type or paste your text into the input box.',
    zh: '在输入框输入或者粘贴文本。',
  },
  {
    en: 'Choose your target text case format.',
    zh: '选择你想要的文本大小写格式。',
  },
  {
    en: 'Copy the converted result with one click.',
    zh: '一键复制转换后的结果。',
  },
];

const faqs: FaqItem[] = [
  {
    questionEn: 'Will you save my input text?',
    questionZh: '你们会保存我输入的文本吗？',
    answerEn:
      'No. The conversion runs locally in your browser. We never receive or store your text.',
    answerZh: '不会。文本转换在浏览器本地完成，我们不会接收和存储你的文本。',
  },
  {
    questionEn: 'What text formats are supported?',
    questionZh: '支持哪些文本格式转换？',
    answerEn:
      'It supports UPPERCASE, lowercase, Capitalize Each Word, Sentence case and title case.',
    answerZh:
      '支持全部大写、全部小写、每个单词首字母大写、句子格式、标题格式。',
  },
  {
    questionEn: 'Is this case converter free to use?',
    questionZh: '这个大小写转换工具免费使用吗？',
    answerEn: 'Yes, fully free. No registration or login required.',
    answerZh: '完全免费，无需注册和登录。',
  },
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

      {/* Local processing note */}
      <LocalProcessingNote
        en="All processing runs locally in your browser. Your text will never be uploaded or stored on our server."
        zh="所有计算在浏览器本地执行，你的文本永远不会上传或保存在我们服务器。"
      />

      <HowToUse steps={howToSteps} />
      <Faq items={faqs} />
      <OtherTools currentToolId={tool.id} />

      <AdSlot slot="3333333333" />
    </div>
  );
}
