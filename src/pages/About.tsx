import { Zap, Shield, DollarSign, Wrench, Users } from 'lucide-react';
import LegalPageLayout, { Section } from '@/components/LegalPageLayout';
import { Faq } from '@/components/ToolExtras';
import { usePageMeta, faqJsonLd, type FaqEntry } from '@/lib/usePageMeta';
import { navigate } from '@/lib/router';
import { tools } from '@/data/tools';
import { site } from '@/data/site';

const values = [
  {
    icon: Zap,
    title: 'Fast by design',
    desc: 'Every tool runs instantly in your browser. No queues, no uploads, no waiting for a server round-trip.',
  },
  {
    icon: Shield,
    title: 'Privacy by default',
    desc: 'We do not ask for accounts, emails or personal details, and the content you enter never leaves your device.',
  },
  {
    icon: DollarSign,
    title: 'Free forever',
    desc: 'The site is funded by advertising, so every tool stays free to use for individuals, students and professionals.',
  },
  {
    icon: Users,
    title: 'Built for everyone',
    desc: 'Works on desktop, tablet and mobile, in any modern browser — no installation and no plugins required.',
  },
];

/**
 * FAQ structured data for this page. Each answer restates what the sections
 * below already cover — Google requires marked-up Q&A to be answered on the
 * page, so these mirror the visible content rather than introducing new claims.
 */
const faqs: FaqEntry[] = [
  {
    questionEn: 'Is ToolKit really free to use?',
    questionZh: 'ToolKit 真的可以免费使用吗？',
    answerEn:
      'Yes. Every tool is free to use, with no account, subscription or payment of any kind. The site is funded by advertising so that the tools can stay free for individuals, students and professionals.',
    answerZh:
      '是的。所有工具均可免费使用，无需账号、订阅或任何付费。本站通过广告获得收入，以便让个人、学生和专业人士持续免费使用这些工具。',
  },
  {
    questionEn: 'Do I need to create an account or give you my email address?',
    questionZh: '我需要注册账号或提供邮箱地址吗？',
    answerEn:
      'No. We do not ask for accounts, email addresses or personal details. There is no signup and nothing to install.',
    answerZh:
      '不需要。我们不要求注册账号、邮箱地址或任何个人信息，无需注册也无需安装任何东西。',
  },
  {
    questionEn: 'Does the content I enter leave my device?',
    questionZh: '我输入的内容会离开我的设备吗？',
    answerEn:
      'No. Every tool runs entirely in your browser, so the text, numbers and other values you enter are processed on your device and never sent to our servers.',
    answerZh:
      '不会。所有工具完全在你的浏览器中运行，你输入的文本、数字等内容都在你的设备上处理，永远不会发送到我们的服务器。',
  },
];

export default function About() {
  usePageMeta({
    title: 'About Us | ToolKit',
    description:
      'Learn about ToolKit — free, privacy-friendly online tools that run entirely in your browser. Our mission, how we are funded and how to get in touch.',
    keywords: 'about ToolKit, free online tools, privacy-friendly tools, browser tools, our mission',
    path: '/about',
    jsonLd: faqJsonLd(faqs),
  });

  return (
    <LegalPageLayout
      title="About ToolKit"
      intro={
        <>
          {site.name} is a small, independent website that provides free, fast and
          privacy-friendly online tools for everyday tasks. From counting words
          in an essay to converting units, generating passwords or checking a
          colour code, everything works instantly in your browser.
        </>
      }
    >
      <Section title="Our Mission">
        <p>
          Most simple online tasks do not need an account, a subscription or an
          app download. They need a page that loads quickly, gives you the
          answer, and gets out of your way. That is the entire idea behind
          ToolKit.
        </p>
        <p>
          We build single-purpose tools that solve one problem well. Text tools
          for writers and students. Developer utilities for people building
          things. Converters and calculators for everyday life. No bloat, no dark
          patterns, no forced signups.
        </p>
      </Section>

      <Section title="What Makes ToolKit Different">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-4"
            >
              <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <v.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold text-ink-800 text-sm">{v.title}</p>
                <p className="text-ink-600 text-sm leading-relaxed mt-0.5">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Your Privacy Comes First">
        <p>
          All of our tools run entirely on your device. The text you paste into
          the word counter, the values you type into the converter and the
          passwords you generate with the password generator are processed in
          your browser and are never transmitted to our servers or stored
          anywhere. We could not read them even if we wanted to.
        </p>
        <p>
          We do display advertising through third-party partners to keep the site
          free. You can read exactly what that means, and how to opt out of
          personalised advertising, in our{' '}
          <a href="/privacy-policy" className="text-brand-600 underline hover:text-brand-700">
            Privacy Policy
          </a>
          .
        </p>
      </Section>

      <Section title="How We Are Funded">
        <p>
          {site.name} is free to use and always will be. Hosting and development
          costs are covered by advertising served through Google AdSense. Ads
          are the reason we can keep every tool open to everyone without a
          paywall or premium tier.
        </p>
      </Section>

      <Section title="Our Tools">
        <ul className="list-disc pl-6 space-y-2">
          {tools.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => navigate(`/tools/${t.id}`)}
                className="text-brand-600 underline hover:text-brand-700 font-medium"
              >
                {t.name}
              </button>{' '}
              — {t.short.toLowerCase()}.
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Get in Touch">
        <p>
          Found a bug, have a suggestion for a new tool, or want to work with us?
          We would genuinely like to hear from you — see our{' '}
          <a href="/contact" className="text-brand-600 underline hover:text-brand-700">
            Contact page
          </a>{' '}
          for ways to reach us.
        </p>
      </Section>

      <Section title="A Word About Our Content">
        <p>
          The tools on this site are provided for general informational and
          convenience purposes. Results should be verified before you rely on
          them for anything important. Please read our{' '}
          <a href="/disclaimer" className="text-brand-600 underline hover:text-brand-700">
            Disclaimer
          </a>{' '}
          and{' '}
          <a href="/terms" className="text-brand-600 underline hover:text-brand-700">
            Terms of Service
          </a>{' '}
          for the details.
        </p>
      </Section>

      <Faq items={faqs} />

      <div className="not-prose pt-4">
        <button onClick={() => navigate('/')} className="btn-primary">
          <Wrench className="w-4 h-4" />
          Explore all tools
        </button>
      </div>
    </LegalPageLayout>
  );
}
