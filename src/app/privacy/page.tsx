import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | MBTI Senpai",
  description:
    "Privacy Policy for MBTI Senpai - Learn how we collect, use, and protect your data.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="w-full max-w-4xl rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:px-8 sm:py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-4 bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="prose prose-sm max-w-none space-y-6 text-zinc-700 sm:prose-base">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              1. Introduction
            </h2>
            <p>
              Welcome to MBTI Senpai (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;). We are committed to protecting your privacy and
              ensuring transparency about how we collect, use, and protect your
              information. This Privacy Policy explains our practices regarding
              data collection and usage when you use our website and services.
            </p>
            <p>
              By using MBTI Senpai, you agree to the collection and use of
              information in accordance with this policy. If you do not agree
              with our policies and practices, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              2. Information We Collect
            </h2>

            <h3 className="text-lg font-semibold text-zinc-900">
              2.1 Quiz Responses
            </h3>
            <p>
              When you take the MBTI personality test, we collect your responses
              to the quiz questions. These responses are used solely to
              calculate your personality type and generate your results. Your
              quiz answers are processed in real-time and are not permanently
              stored on our servers.
            </p>

            <h3 className="text-lg font-semibold text-zinc-900 mt-4">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Usage Data:</strong> We automatically collect
                information about how you interact with our website, including
                pages visited, time spent on pages, and navigation patterns.
              </li>
              <li>
                <strong>Device Information:</strong> We may collect information
                about your device, including browser type, operating system, and
                device identifiers.
              </li>
              <li>
                <strong>IP Address:</strong> Your IP address may be collected
                for security purposes and to analyze website traffic patterns.
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> We use
                cookies and similar tracking technologies to enhance your
                experience and analyze website usage.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-zinc-900 mt-4">
              2.3 Third-Party Analytics
            </h3>
            <p>
              We use Google Analytics to understand how visitors use our
              website. Google Analytics collects information such as how often
              users visit our site, what pages they visit, and what other sites
              they used prior to coming to our site. Google&apos;s ability to
              use and share information collected by Google Analytics about your
              visits to this site is restricted by the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fuchsia-600 hover:underline"
              >
                Google Analytics Terms of Service
              </a>{" "}
              and the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fuchsia-600 hover:underline"
              >
                Google Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>To Provide Services:</strong> Process your quiz
                responses and generate your MBTI personality type results.
              </li>
              <li>
                <strong>To Improve Our Service:</strong> Analyze usage patterns
                to enhance user experience and improve our website
                functionality.
              </li>
              <li>
                <strong>To Ensure Security:</strong> Detect and prevent fraud,
                abuse, and security issues.
              </li>
              <li>
                <strong>For Analytics:</strong> Understand how users interact
                with our website to make data-driven improvements.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              4. Data Storage and Retention
            </h2>
            <p>
              Your quiz responses are processed in real-time and are not
              permanently stored on our servers. Results are encoded in URL
              parameters, allowing you to share or revisit your results via the
              generated link. We do not maintain a database of individual quiz
              results or personal information.
            </p>
            <p>
              Analytics data collected by Google Analytics is retained according
              to Google&apos;s data retention policies. You can learn more about
              Google Analytics data retention{" "}
              <a
                href="https://support.google.com/analytics/answer/7667196"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fuchsia-600 hover:underline"
              >
                here
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              5. Data Sharing and Disclosure
            </h2>
            <p>We do not sell, trade, or rent your personal information.</p>
            <p>We may share information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Service Providers:</strong> We may share data with
                third-party service providers who assist us in operating our
                website, such as hosting providers and analytics services (e.g.,
                Google Analytics, Vercel).
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information
                if required by law or in response to valid requests by public
                authorities.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, your information may be
                transferred as part of that transaction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              6. Cookies and Tracking Technologies
            </h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our website and store certain information. Cookies are files
              with a small amount of data that may include an anonymous unique
              identifier.
            </p>
            <p>Types of cookies we use:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for the website to
                function properly.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors interact with our website through Google Analytics.
              </li>
            </ul>
            <p>
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent. However, if you do not accept
              cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              7. Third-Party Services
            </h2>
            <p>Our website uses the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Google Analytics:</strong> For website analytics and
                usage tracking. See{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fuchsia-600 hover:underline"
                >
                  Google&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Google Fonts:</strong> For web font delivery. See{" "}
                <a
                  href="https://developers.google.com/fonts/faq#what_does_using_the_google_fonts_api_mean_for_the_privacy_of_my_users"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fuchsia-600 hover:underline"
                >
                  Google Fonts Privacy FAQ
                </a>
                .
              </li>
              <li>
                <strong>Vercel:</strong> Our hosting provider. See{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fuchsia-600 hover:underline"
                >
                  Vercel&apos;s Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              8. Your Rights and Choices
            </h2>
            <p>
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access:</strong> Request information about the personal
                data we hold about you.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                data.
              </li>
              <li>
                <strong>Opt-Out:</strong> Opt-out of certain data collection
                practices, such as Google Analytics tracking.
              </li>
              <li>
                <strong>Cookie Preferences:</strong> Manage cookie settings
                through your browser.
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights or if you have questions about your data,
              please contact us using the information provided in the Contact
              section below.
            </p>
            <p>
              You can opt-out of Google Analytics tracking by installing the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fuchsia-600 hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              9. Children&apos;s Privacy
            </h2>
            <p>
              Our service is not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us, and we
              will delete such information from our records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              10. Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your information. However, no method of transmission over
              the Internet or electronic storage is 100% secure. While we strive
              to use commercially acceptable means to protect your data, we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              11. International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              data protection laws that differ from those in your country. By
              using our service, you consent to the transfer of your information
              to these countries.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              12. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              13. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <ul className="list-none pl-0 space-y-2">
              <li>
                <strong>Creator:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/khaing-myel-khant-457b69146/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fuchsia-600 hover:underline"
                >
                  Khaing Myel Khant
                </a>
              </li>
              <li>
                <strong>Github Profile:</strong>{" "}
                <a
                  href="https://github.com/kmkhant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fuchsia-600 hover:underline"
                >
                  https://github.com/kmkhant
                </a>
              </li>
            </ul>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
