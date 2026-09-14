import LegalPageLayout, { Section, ExtLink } from '@/components/LegalPageLayout';
import { usePageMeta } from '@/lib/usePageMeta';
import { site } from '@/data/site';

const LAST_UPDATED = site.legalUpdated;

export default function TermsOfService() {
  usePageMeta({
    title: 'Terms of Service | ToolKit',
    description:
      'The terms and conditions that govern your use of ToolKit free online tools, including acceptable use, intellectual property, disclaimers and limitation of liability.',
    keywords: 'terms of service, terms and conditions, acceptable use, user agreement, ToolKit',
    path: '/terms',
  });

  return (
    <LegalPageLayout
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={
        <>
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of the ToolKit website and the free online tools it provides. By
          using this website you agree to be bound by these Terms. If you do not
          agree, please do not use the website.
        </>
      }
    >
      <Section title="1. Acceptance of Terms">
        <p>
          By accessing or using this website you confirm that you have read,
          understood and agree to these Terms, and that you are at least 13 years
          of age (or the minimum age of digital consent in your jurisdiction). If
          you are using the site on behalf of an organisation, you represent that
          you have authority to bind that organisation.
        </p>
      </Section>

      <Section title="2. Description of the Service">
        <p>
          ToolKit provides free, browser-based utilities such as a password
          generator, word counter, unit converter, color converter, case
          converter and BMI calculator. All tools run locally in your browser
          (&quot;client-side&quot;) and produce results instantly.
        </p>
        <p>
          The service is provided free of charge and is funded by advertising. We
          may add, change, suspend or discontinue any tool or feature at any time
          without notice.
        </p>
      </Section>

      <Section title="3. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            use the website for any unlawful purpose, or in violation of any
            applicable local, national or international law;
          </li>
          <li>
            attempt to gain unauthorised access to the website, its servers or
            any connected systems or networks;
          </li>
          <li>
            interfere with or disrupt the website, or introduce viruses, malware
            or any other harmful code;
          </li>
          <li>
            use automated systems (such as bots, scrapers or crawlers) to access
            the website in a way that places an unreasonable load on our
            infrastructure, except for standard search engine indexing;
          </li>
          <li>
            remove, obscure or interfere with advertising, copyright notices or
            other proprietary notices on the website;
          </li>
          <li>
            reproduce, duplicate, copy, sell or resell any part of the website,
            or frame or mirror the content without our prior written consent; or
          </li>
          <li>
            use the website to transmit unlawful, threatening, defamatory or
            otherwise objectionable content.
          </li>
        </ul>
      </Section>

      <Section title="4. Advertising">
        <p>
          This website displays third-party advertisements, including through
          Google AdSense. Your interactions with advertisers are solely between
          you and the advertiser. We are not responsible for the content of any
          advertisement or for any transactions, products or services offered by
          advertisers. See our{' '}
          <a href="/privacy-policy" className="text-brand-600 underline hover:text-brand-700">
            Privacy Policy
          </a>{' '}
          for details on advertising cookies and how to opt out.
        </p>
      </Section>

      <Section title="5. No Professional Advice">
        <p>
          The tools and content on this website are provided for general
          informational and convenience purposes only. They do not constitute
          professional advice. In particular, the BMI calculator is not a medical
          device and does not provide medical advice — consult a qualified
          healthcare professional for health-related decisions. You are solely
          responsible for verifying any output before relying on it.
        </p>
      </Section>

      <Section title="6. Intellectual Property">
        <p>
          The website design, layout, text, graphics, logos and source code are
          owned by or licensed to us and are protected by copyright and other
          intellectual property laws. You may use the tools for personal and
          commercial purposes, but you may not copy, modify, distribute or create
          derivative works from the website itself without our written
          permission.
        </p>
        <p>
          You retain all rights to the content you enter into the tools. Because
          that content never leaves your browser, we never receive a licence to
          it.
        </p>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <p>
          The website and tools are provided on an &quot;as is&quot; and
          &quot;as available&quot; basis, without warranties of any kind, whether
          express or implied, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose and
          non-infringement. We do not warrant that the website will be
          uninterrupted, error-free, secure, or free of viruses or other harmful
          components, or that the results obtained from using the tools will be
          accurate or reliable.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, we shall not be liable for any
          indirect, incidental, special, consequential or punitive damages, or
          any loss of profits, revenue, data, goodwill or other intangible
          losses, arising out of or in connection with your use of, or inability
          to use, the website. Where liability cannot be excluded, our total
          aggregate liability shall not exceed one hundred US dollars (USD $100).
        </p>
      </Section>

      <Section title="9. Indemnification">
        <p>
          You agree to indemnify and hold us harmless from any claims,
          liabilities, damages, losses and expenses (including reasonable legal
          fees) arising out of your use of the website or your breach of these
          Terms.
        </p>
      </Section>

      <Section title="10. Third-Party Websites and Services">
        <p>
          The website may contain links to third-party websites or services that
          we do not own or control. We assume no responsibility for the content,
          privacy policies or practices of any third-party websites or services.
        </p>
      </Section>

      <Section title="11. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with the laws
          applicable in the jurisdiction where the website operator is
          established, without regard to its conflict of law provisions. Any
          dispute arising from these Terms or your use of the website shall be
          subject to the exclusive jurisdiction of the competent courts in that
          jurisdiction.
        </p>
      </Section>

      <Section title="12. Changes to These Terms">
        <p>
          We may revise these Terms at any time. The revised version will be
          posted on this page with an updated &quot;Last updated&quot; date. Your
          continued use of the website after any change constitutes acceptance of
          the revised Terms.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Questions about these Terms? Please reach out through our{' '}
          <a href="/contact" className="text-brand-600 underline hover:text-brand-700">
            Contact page
          </a>{' '}
          or email us at{' '}
          <ExtLink href="mailto:support@toolkit-tools.pages.dev">
            support@toolkit-tools.pages.dev
          </ExtLink>
          .
        </p>
      </Section>
    </LegalPageLayout>
  );
}
