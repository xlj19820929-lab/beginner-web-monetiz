import { useState, type FormEvent } from 'react';
import { Mail, MessageSquare, Bug, Lightbulb, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import LegalPageLayout, { Section, ExtLink } from '@/components/LegalPageLayout';
import { usePageMeta } from '@/lib/usePageMeta';
import { site } from '@/data/site';

const CONTACT_EMAIL = site.email;

const reasons = [
  {
    icon: Bug,
    title: 'Report a bug',
    desc: 'Something is broken or giving the wrong result. Tell us the tool and what happened.',
  },
  {
    icon: Lightbulb,
    title: 'Suggest a tool',
    desc: 'Need a converter, calculator or utility we do not have yet? We are always adding more.',
  },
  {
    icon: MessageSquare,
    title: 'General feedback',
    desc: 'Questions, comments or partnership enquiries — we read everything we receive.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy requests',
    desc: 'Questions about cookies, advertising data or your privacy rights under GDPR or CCPA.',
  },
];

export default function Contact() {
  usePageMeta({
    title: 'Contact Us | ToolKit',
    description:
      'Get in touch with the ToolKit team. Report a bug, suggest a new online tool, send feedback or ask a privacy question. We usually reply within 48 hours.',
    keywords: 'contact ToolKit, support, report a bug, suggest a tool, feedback, privacy request',
    path: '/contact',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General feedback');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // No backend is required: hand the message off to the visitor's own mail
    // client with a pre-filled subject and body. This keeps the site fully
    // static (deployable to Cloudflare Pages) and means no form data is ever
    // stored on our servers.
    const bodyLines = [
      `Name: ${name || 'Not provided'}`,
      `Email: ${email || 'Not provided'}`,
      '',
      message,
    ];
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[ToolKit] ${subject}`
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailto;
    setSent(true);
  };

  return (
    <LegalPageLayout
      title="Contact Us"
      intro={
        <>
          Have a question, a bug report or an idea for a new tool? We would love
          to hear from you. Fill in the form below, or email us directly at{' '}
          <ExtLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ExtLink>. We
          usually respond within 48 hours on business days.
        </>
      }
    >
      <Section title="What Can We Help With?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="flex gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-4"
            >
              <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <r.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold text-ink-800 text-sm">{r.title}</p>
                <p className="text-ink-600 text-sm leading-relaxed mt-0.5">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Send Us a Message">
        {sent ? (
          <div className="rounded-2xl border border-brand-200 bg-brand-50 px-6 py-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-brand-600 mx-auto mb-3" />
            <p className="font-semibold text-ink-900 text-lg mb-1">
              Thank you for reaching out!
            </p>
            <p className="text-ink-600 text-sm">
              Your email client should have opened with your message ready to
              send. If it did not, please email us directly at{' '}
              <ExtLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ExtLink>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="btn-ghost mt-4 text-sm"
            >
              Write another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-ink-700 mb-2">
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className="input-field"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-ink-700 mb-2">
                  Your email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-ink-700 mb-2">
                What is this about?
              </label>
              <select
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
              >
                <option>General feedback</option>
                <option>Report a bug</option>
                <option>Suggest a new tool</option>
                <option>Privacy or advertising question</option>
                <option>Business or partnership enquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-ink-700 mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Tell us what is on your mind…"
                className="input-field resize-y h-auto"
              />
            </div>

            <p className="text-xs text-ink-400">
              By sending a message you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-brand-600">
                Privacy Policy
              </a>
              . We only use your details to reply to you and never sell them.
            </p>

            <button type="submit" className="btn-primary">
              <Send className="w-4 h-4" />
              Send message
            </button>
          </form>
        )}
      </Section>

      <Section title="Other Ways to Reach Us">
        <div className="rounded-2xl border border-ink-100 bg-white px-5 py-4 flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </span>
          <div>
            <p className="font-semibold text-ink-800 text-sm">Email</p>
            <p className="text-ink-600 text-sm mt-0.5">
              <ExtLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ExtLink>
            </p>
          </div>
        </div>
      </Section>

      <Section title="Before You Write">
        <p>
          Many common questions are already answered on our information pages:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            For questions about ads and data, see our{' '}
            <a href="/privacy-policy" className="text-brand-600 underline hover:text-brand-700">
              Privacy Policy
            </a>
            .
          </li>
          <li>
            For accuracy of results and tool limitations, see our{' '}
            <a href="/disclaimer" className="text-brand-600 underline hover:text-brand-700">
              Disclaimer
            </a>
            .
          </li>
          <li>
            For the rules governing use of the site, see our{' '}
            <a href="/terms" className="text-brand-600 underline hover:text-brand-700">
              Terms of Service
            </a>
            .
          </li>
          <li>
            To learn more about who we are, see our{' '}
            <a href="/about" className="text-brand-600 underline hover:text-brand-700">
              About page
            </a>
            .
          </li>
        </ul>
      </Section>
    </LegalPageLayout>
  );
}
