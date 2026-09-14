import LegalPageLayout, { Section, ExtLink } from '@/components/LegalPageLayout';
import { usePageMeta } from '@/lib/usePageMeta';
import { site } from '@/data/site';

const LAST_UPDATED = site.legalUpdated;

export default function PrivacyPolicy() {
  usePageMeta({
    title: 'Privacy Policy | ToolKit',
    description:
      'How ToolKit handles your data, cookies and third-party advertising. Learn about Google AdSense cookies, our advertising partners and how to opt out of personalised ads.',
    keywords:
      'privacy policy, cookies, Google AdSense, personalised advertising, opt out, data protection, GDPR, CCPA',
    path: '/privacy-policy',
  });

  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <>
          ToolKit (&quot;we&quot;, &quot;us&quot; or &quot;our&quot;) provides free online tools
          that run entirely in your browser. This Privacy Policy explains what
          information is collected when you visit this website, how that
          information is used, and the choices and controls you have — including
          how to opt out of personalised advertising.
        </>
      }
    >
      <Section title="1. Summary">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            The tools themselves run locally on your device. Text, numbers and
            other values you type into a tool are <strong>never</strong> sent to
            us or stored on our servers.
          </li>
          <li>
            We do not require an account, and we do not ask for your name, email
            address or payment details to use this site.
          </li>
          <li>
            We display advertising through Google AdSense and other third-party
            advertising partners. These partners may use cookies and similar
            technologies to show ads that are relevant to you.
          </li>
          <li>
            You can opt out of personalised advertising at any time using the
            links in the &quot;Your Advertising Choices&quot; section below, or
            by using the cookie banner shown when you first visit this site.
          </li>
        </ul>
      </Section>

      <Section title="2. Information We Collect">
        <p>
          <strong>Information you enter into our tools.</strong> All calculations,
          conversions and formatting happen in your browser using JavaScript. The
          content you enter is processed on your device only and is never
          transmitted to, or stored by, us.
        </p>
        <p>
          <strong>Cookie preferences.</strong> If you make a choice on our cookie
          banner, we store that choice in your browser&apos;s local storage
          (under the key <code className="font-mono text-sm">toolkit-cookie-consent</code>)
          so that we do not ask you again on every visit. This value stays on
          your device and is not sent to our servers.
        </p>
        <p>
          <strong>Server and hosting logs.</strong> Our hosting provider
          (Cloudflare Pages) automatically records standard technical request
          information — such as IP address, browser type, referring page,
          requested URL and timestamps — for security, abuse prevention and
          operational purposes. These logs are retained for a limited period and
          are not used to identify you personally.
        </p>
        <p>
          <strong>Aggregate analytics.</strong> We may collect aggregated,
          non-identifying statistics about how the site is used (for example,
          which tools are most popular) in order to improve the service.
        </p>
      </Section>

      <Section title="3. Cookies and Similar Technologies">
        <p>
          Cookies are small text files placed on your device by a website. We do
          not set our own advertising or tracking cookies. However, third-party
          vendors — including Google — use cookies, web beacons and similar
          technologies to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>serve advertisements on this website and measure their performance;</li>
          <li>
            serve ads based on your prior visits to this website and/or other
            websites on the internet;
          </li>
          <li>limit how often you see the same advertisement; and</li>
          <li>detect and prevent fraudulent or invalid advertising activity.</li>
        </ul>
        <p>
          You can control or delete cookies through your browser settings. Most
          browsers let you block third-party cookies entirely. Please note that
          blocking cookies may affect how advertisements are displayed, but it
          will not affect the functionality of our tools.
        </p>
      </Section>

      <Section title="4. Google AdSense and Third-Party Advertising">
        <p>
          This website uses <strong>Google AdSense</strong>, an advertising
          service provided by Google LLC, to display advertisements and to fund
          the free tools we offer. Google AdSense and its advertising partners use
          cookies to serve ads based on your prior visits to this website and
          other websites.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners to
          serve ads to you based on your visit to this site and/or other sites on
          the internet. Google may also use your advertising identifier and
          approximate location (derived from IP address) for ad delivery,
          measurement and fraud prevention.
        </p>
        <p>
          The following third-party services may also place cookies or similar
          technologies on your device when you visit this site, and each operates
          under its own privacy policy:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Google AdSense and Google advertising products</strong> —{' '}
            <ExtLink href="https://policies.google.com/privacy">
              Google Privacy Policy
            </ExtLink>{' '}
            and{' '}
            <ExtLink href="https://policies.google.com/technologies/ads">
              How Google uses cookies in advertising
            </ExtLink>
          </li>
          <li>
            <strong>Cloudflare</strong> (hosting, content delivery and security) —{' '}
            <ExtLink href="https://www.cloudflare.com/privacypolicy/">
              Cloudflare Privacy Policy
            </ExtLink>
          </li>
        </ul>
        <p>
          Third-party advertising vendors may also participate in industry
          opt-out programmes that give you additional control over interest-based
          advertising, as described in the next section.
        </p>
      </Section>

      <Section title="5. Your Advertising Choices (How to Opt Out)">
        <p>
          You are not required to accept personalised advertising in order to use
          this website. You can opt out at any time using any of the options
          below:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Google Ads Settings:</strong> turn off personalised
            advertising from Google at{' '}
            <ExtLink href="https://www.google.com/settings/ads">
              google.com/settings/ads
            </ExtLink>
            . You can also review Google&apos;s ad settings across your devices at{' '}
            <ExtLink href="https://adssettings.google.com/">
              adssettings.google.com
            </ExtLink>
            .
          </li>
          <li>
            <strong>Industry opt-out tools:</strong> opt out of interest-based
            advertising from many third-party vendors at{' '}
            <ExtLink href="https://www.aboutads.info/choices/">
              aboutads.info/choices
            </ExtLink>{' '}
            (Digital Advertising Alliance),{' '}
            <ExtLink href="https://www.networkadvertising.org/choices/">
              networkadvertising.org/choices
            </ExtLink>{' '}
            (NAI) or, in the European Union,{' '}
            <ExtLink href="https://www.youronlinechoices.eu/">
              youronlinechoices.eu
            </ExtLink>
            .
          </li>
          <li>
            <strong>Device settings:</strong> on mobile devices you can reset
            your advertising identifier or limit ad tracking in your device
            settings.
          </li>
          <li>
            <strong>Browser settings:</strong> block or delete third-party
            cookies in your browser. Note that opting out does not remove ads —
            you will still see non-personalised advertisements.
          </li>
        </ul>
      </Section>

      <Section title="6. Consent and Legal Bases">
        <p>
          Where required by applicable law (for example, under the GDPR in the
          European Economic Area and the UK, or equivalent regulations
          elsewhere), we ask for your consent before non-essential cookies for
          advertising purposes are used, and we rely on your consent as the legal
          basis for that processing. When we process technical log data for
          security and fraud prevention, we rely on our legitimate interest in
          keeping the website available and secure.
        </p>
        <p>
          You can change or withdraw your cookie consent at any time by clearing
          the saved preference in your browser (see the &quot;Cookie
          preferences&quot; section above), after which the banner will appear
          again on your next visit.
        </p>
      </Section>

      <Section title="7. Your Privacy Rights">
        <p>
          Depending on where you live, you may have the right to access, correct,
          delete or restrict the processing of your personal information, to
          object to processing, and to data portability. California residents
          have rights under the CCPA/CPRA, including the right to know what
          personal information is collected and the right to opt out of the
          &quot;sale&quot; or &quot;sharing&quot; of personal information.
        </p>
        <p>
          Because our tools run locally in your browser and we do not maintain
          user accounts, we generally do not hold personal information that can
          be tied back to you. If you wish to exercise a right in relation to
          data processed by our advertising partners, please contact those
          partners directly using the links in Section 4.
        </p>
      </Section>

      <Section title="8. Data Retention and Security">
        <p>
          We retain technical and aggregate data only for as long as it is
          needed for the purposes described in this policy. We use HTTPS
          encryption in transit and reputable infrastructure providers, but no
          method of transmission or storage is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </Section>

      <Section title="9. International Data Transfers">
        <p>
          Our service providers, including Google and Cloudflare, may process and
          store data in countries other than your own, including the United
          States. Where required, these providers rely on appropriate safeguards
          such as standard contractual clauses to protect the transfer of
          personal data.
        </p>
      </Section>

      <Section title="10. Children's Privacy">
        <p>
          This website is not directed to children under the age of 13, and we do
          not knowingly collect personal information from children. If you
          believe that a child has provided personal information to us, please
          contact us and we will take reasonable steps to remove it.
        </p>
      </Section>

      <Section title="11. Third-Party Links">
        <p>
          Our website may link to external websites that we do not operate. We
          have no control over and assume no responsibility for the content,
          privacy policies or practices of any third-party websites or services.
          We encourage you to review the privacy policy of every site you visit.
        </p>
      </Section>

      <Section title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. When we do, we will revise the
          &quot;Last updated&quot; date at the top of this page. Continued use of
          the website after an update constitutes acceptance of the revised
          policy.
        </p>
      </Section>

      <Section title="13. Contact Us">
        <p>
          If you have questions about this Privacy Policy, or you would like to
          exercise any of the rights described above, please contact us through
          the details on our{' '}
          <a
            href="/contact"
            className="text-brand-600 underline hover:text-brand-700"
          >
            Contact page
          </a>
          . We aim to respond to all legitimate requests within 30 days.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
