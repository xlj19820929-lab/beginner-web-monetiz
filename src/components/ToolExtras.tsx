import { HelpCircle } from 'lucide-react';
import { navigate } from '@/lib/router';
import { tools } from '@/data/tools';

export interface BiText {
  en: string;
  zh: string;
}

export interface FaqItem {
  questionEn: string;
  questionZh: string;
  answerEn: string;
  answerZh: string;
}

/**
 * Shared bilingual building blocks used at the bottom of every tool page:
 * the local-processing note, How To Use steps, an FAQ list and a grid of
 * "Other Tools" cards.
 *
 * The Other Tools grid reuses the exact card markup, classes and navigation
 * used on the home page, so tool cards stay visually identical everywhere.
 *
 * `currentToolId` is the only tool excluded from the Other Tools grid.
 */
export function LocalProcessingNote({
  en,
  zh,
}: {
  en: React.ReactNode;
  zh: React.ReactNode;
}) {
  return (
    <p className="text-sm text-ink-500 leading-relaxed mt-5">
      {en}
      <br />
      {zh}
    </p>
  );
}

export function HowToUse({ steps }: { steps: BiText[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-ink-900 mb-4">
        How To Use <span className="text-ink-500 font-normal">使用方法</span>
      </h2>
      <ol className="space-y-3">
        {steps.map((step, i) => (
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
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-ink-900 mb-5">
        Frequently Asked Questions{' '}
        <span className="text-ink-500 font-normal">常见问题</span>
      </h2>
      <div className="space-y-6">
        {items.map((faq, i) => (
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
  );
}

export function OtherTools({ currentToolId }: { currentToolId: string }) {
  const otherTools = tools.filter((t) => t.id !== currentToolId);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-ink-900 mb-4">
        Other Tools <span className="text-ink-500 font-normal">其他工具</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherTools.map((tool) => {
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
    </section>
  );
}
