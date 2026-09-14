import { ArrowLeft } from 'lucide-react';
import { navigate } from '@/lib/router';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={() => navigate('/')}
        className="btn-ghost mb-6 -ml-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </button>

      <h1 className="text-3xl font-bold text-ink-900 mb-2">Privacy Policy</h1>
      <p className="text-ink-400 text-sm mb-10">Last updated: September 14, 2026</p>

      <div className="space-y-8 text-ink-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">Overview</h2>
          <p>
            ToolKit (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates a collection of
            free online tools at our website. This Privacy Policy explains what
            information we collect, how we use it, and the choices you have.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">
            Information We Collect
          </h2>
          <p className="mb-3">
            <strong>Tool data:</strong> All tools on this site run entirely in
            your browser. Any text, numbers, or other input you enter into our
            tools is processed locally on your device and is never transmitted to
            our servers or stored by us.
          </p>
          <p>
            <strong>Server logs:</strong> Our hosting provider may
            automatically log standard request information such as IP address,
            browser type, and timestamps for security and operational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">
            Cookies and Similar Technologies
          </h2>
          <p className="mb-3">
            We do not set our own cookies. However, third-party vendors,
            including Google, use cookies to serve ads based on your prior
            visits to this and other websites.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visit to our site
              and/or other sites on the internet.
            </li>
            <li>
              You may opt out of personalised advertising by visiting Google&apos;s
              Ads Settings at{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-700"
              >
                google.com/settings/ads
              </a>
              .
            </li>
            <li>
              You can also opt out of third-party vendors&apos; use of cookies for
              personalised advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-700"
              >
                aboutads.info/choices
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">
            Google AdSense
          </h2>
          <p>
            This site uses Google AdSense, a service provided by Google LLC, to
            display advertisements. Google AdSense uses cookies and similar
            technologies to serve ads based on your interests and past
            activity. Third-party vendors and Google&apos;s partners may also use
            cookies for ad measurement and personalisation. The use of cookies
            by AdSense is subject to Google&apos;s Privacy Policy, available at{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline hover:text-brand-700"
            >
              policies.google.com/privacy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">
            Third-Party Links
          </h2>
          <p>
            Our site may contain links to external websites that are not
            operated by us. We have no control over and assume no
            responsibility for the content or privacy practices of any
            third-party sites or services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">
            Children&apos;s Privacy
          </h2>
          <p>
            Our service is not directed to anyone under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If you believe a child has provided us with personal information,
            please contact us so we can remove it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">
            Your Rights
          </h2>
          <p>
            Depending on your location, you may have the right to access,
            correct, or delete your personal information. Since we do not
            collect personal information through our tools, most of your data
            remains on your device and under your control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date at the top.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink-900 mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can reach
            us through the contact information available on our website.
          </p>
        </section>
      </div>
    </div>
  );
}
