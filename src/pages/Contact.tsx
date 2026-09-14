import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { navigate } from '@/lib/router';
import { Faq } from '@/components/ToolExtras';
import { usePageMeta, faqJsonLd, type FaqEntry } from '@/lib/usePageMeta';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwlkdjka';

/**
 * FAQ structured data for the contact page. Answers only state what the form
 * and the page already make clear — no new promises about response times.
 */
const faqs: FaqEntry[] = [
  {
    questionEn: 'How can I contact ToolKit?',
    questionZh: '我如何联系 ToolKit？',
    answerEn:
      'Use the contact form on this page to send us a message, or email us directly at the address shown below the form.',
    answerZh:
      '你可以使用本页面的联系表单给我们留言，或直接发送邮件到表单下方显示的邮箱地址。',
  },
  {
    questionEn: 'Do I need an account to send a message?',
    questionZh: '发送留言需要注册账号吗？',
    answerEn:
      'No. Simply fill in your name, email address and message, and submit the form. No account or registration is required.',
    answerZh:
      '不需要。只需填写你的姓名、邮箱和留言内容并提交表单即可，无需账号或注册。',
  },
  {
    questionEn: 'What can I contact you about?',
    questionZh: '我可以通过这个表单联系哪些事项？',
    answerEn:
      'You can send us feedback, bug reports, tool suggestions, or questions about the website, including anything relating to our Privacy Policy or Terms of Service.',
    answerZh:
      '你可以向我们发送反馈、问题报告、工具建议，或关于本站的任何疑问，包括与隐私政策或服务条款相关的事项。',
  },
];

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  usePageMeta({
    title: 'Contact Us | ToolKit',
    description:
      'Get in touch with ToolKit. Send us feedback, bug reports or tool suggestions through our contact form, or email us directly — no account required.',
    keywords: 'contact ToolKit, contact us, feedback, bug report, tool suggestion, support',
    path: '/contact',
    jsonLd: faqJsonLd(faqs),
  });

  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3500);
    return () => clearTimeout(timer);
  }, [showToast]);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required / 请填写姓名';
    if (!form.email.trim()) {
      e.email = 'Email is required / 请填写邮箱';
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      e.email = 'Invalid email format / 邮箱格式不正确';
    }
    if (!form.message.trim()) e.message = 'Message is required / 请填写留言内容';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setShowToast(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setSubmitError('Submission failed. Please try again / 提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  }

  const inputErrorClass = (field: keyof FormErrors) =>
    errors[field] ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : '';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => navigate('/')} className="btn-ghost mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Contact Us</h1>
        <p className="text-ink-500">联系我们 — We'd love to hear from you</p>
      </div>

      <div className="bg-white rounded-2xl border border-ink-200 p-6 sm:p-8 shadow-sm">
        {submitError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink-700 mb-1.5">
              Name <span className="text-ink-400">/ 姓名</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`input-field ${inputErrorClass('name')}`}
              placeholder="Your name / 您的姓名"
              autoComplete="name"
            />
            {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-700 mb-1.5">
              Email <span className="text-ink-400">/ 邮箱</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`input-field ${inputErrorClass('email')}`}
              placeholder="you@example.com / 您的邮箱"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink-700 mb-1.5">
              Message <span className="text-ink-400">/ 留言</span>
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={5}
              className={`input-field resize-y ${inputErrorClass('message')}`}
              placeholder="Tell us what you think… / 告诉我们您的想法…"
            />
            {errors.message && <p className="mt-1.5 text-sm text-red-500">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send Message / 发送留言
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-ink-400 mt-6">
        Email / 邮箱：xlj19820929@gmail.com
      </p>

      <Faq items={faqs} />

      {/* Toast */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 rounded-xl bg-ink-900 text-white px-5 py-3.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-brand-400" />
          <span className="text-sm font-medium">Message sent! / 留言已发送</span>
        </div>
      </div>
    </div>
  );
}
