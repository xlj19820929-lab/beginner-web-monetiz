import { useState, useMemo } from 'react';
import { Clipboard, HelpCircle } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import CopyButton from '@/components/CopyButton';
import AdSlot from '@/components/AdSlot';
import { toolsById, tools } from '@/data/tools';
import { navigate } from '@/lib/router';

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

const howToSteps = [
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

const faqs = [
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
  const otherTools = tools.filter((t) => t.id !== tool.id);
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
      <p className="text-sm text-ink-500 leading-relaxed mt-5">
        All processing runs locally in your browser. Your text will never be
        uploaded or stored on our server.
        <br />
        所有计算在浏览器本地执行，你的文本永远不会上传或保存在我们服务器。
      </p>

      {/* How to use */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">
          How To Use <span className="text-ink-500 font-normal">使用方法</span>
        </h2>
        <ol className="space-y-3">
          {howToSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-ink-600 leading-relaxed">
                {step.en}
                <br />
                {step.zh}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink-900 mb-5">
          Frequently Asked Questions{' '}
          <span className="text-ink-500 font-normal">常见问题</span>
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-ink-800 text-sm leading-relaxed">
                  {faq.questionEn}
                  <br />
                  {faq.questionZh}
                </p>
                <p className="text-sm text-ink-500 leading-relaxed mt-1.5">
                  {faq.answerEn}
                  <br />
                  {faq.answerZh}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other tools */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">
          Other Tools <span className="text-ink-500 font-normal">其他工具</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherTools.map((other) => {
            const Icon = other.icon;
            return (
              <button
                key={other.id}
                onClick={() => navigate(`/tools/${other.id}`)}
                className="tool-card text-left group"
              >
                <div className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink-900 group-hover:text-brand-600 transition-colors">
                      {other.name}
                    </h3>
                    <p className="text-sm text-ink-500 mt-0.5">{other.short}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <AdSlot slot="3333333333" />
    </div>
  );
}
