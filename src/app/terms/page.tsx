import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | MBTI Senpai",
  description:
    "Terms of Service for MBTI Senpai - Read our terms and conditions for using our personality test service.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="prose prose-sm max-w-none space-y-6 text-zinc-700 sm:prose-base">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using MBTI Senpai (&quot;the Service&quot;), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              2. Description of Service
            </h2>
            <p>
              MBTI Senpai is a free online personality assessment tool based on
              the Myers-Briggs Type Indicator (MBTI) framework. The Service
              provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>An interactive personality questionnaire</li>
              <li>Personality type results and analysis</li>
              <li>Compatibility insights</li>
              <li>Educational content about personality types</li>
            </ul>
            <p>
              The Service is provided &quot;as is&quot; and we reserve the right
              to modify, suspend, or discontinue any aspect of the Service at
              any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              3. Use of Service
            </h2>
            <h3 className="text-lg font-semibold text-zinc-900">
              3.1 Eligibility
            </h3>
            <p>
              You must be at least 13 years old to use this Service. By using
              the Service, you represent and warrant that you meet this age
              requirement.
            </p>

            <h3 className="text-lg font-semibold text-zinc-900 mt-4">
              3.2 Acceptable Use
            </h3>
            <p>
              You agree to use the Service only for lawful purposes and in a way
              that does not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>
                Attempt to gain unauthorized access to any part of the Service
              </li>
              <li>
                Use automated systems (bots, scrapers) to access the Service
              </li>
              <li>
                Reproduce, duplicate, or copy any portion of the Service without
                permission
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              4. Intellectual Property
            </h2>
            <p>
              The Service and its original content, features, and functionality
              are owned by MBTI Senpai and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>
            <p>
              The Myers-Briggs Type Indicator® and MBTI® are trademarks or
              registered trademarks of The Myers & Briggs Foundation in the
              United States and other countries. MBTI Senpai is not affiliated
              with, nor endorsed by, The Myers & Briggs Foundation or its
              affiliates.
            </p>
            <p>
              You may not use our trademarks, logos, or other proprietary
              information without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              5. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; BASIS. MBTI SENPAI EXPRESSLY DISCLAIMS ALL
              WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>We do not warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Service will meet your requirements</li>
              <li>
                The Service will be uninterrupted, timely, secure, or error-free
              </li>
              <li>
                The results or information provided by the Service will be
                accurate or reliable
              </li>
              <li>Any errors in the Service will be corrected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              6. Limitation of Liability
            </h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, MBTI SENPAI SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
              INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
              GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use or inability to use the Service</li>
              <li>Any conduct or content of third parties on the Service</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>
                Any interruption or cessation of transmission to or from the
                Service
              </li>
              <li>
                Any bugs, viruses, or other harmful code that may be transmitted
                through the Service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              7. Medical and Professional Disclaimer
            </h2>
            <p>
              <strong>IMPORTANT:</strong> The MBTI personality test and results
              provided by this Service are for entertainment and educational
              purposes only. They are not intended to be used for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Medical diagnosis or treatment</li>
              <li>Psychological assessment or therapy</li>
              <li>Employment decisions or hiring practices</li>
              <li>Legal or financial advice</li>
              <li>Any other professional or clinical purpose</li>
            </ul>
            <p>
              The results should not be considered as a substitute for
              professional advice, diagnosis, or treatment. Always seek the
              advice of qualified health providers, mental health professionals,
              or other qualified professionals with any questions you may have
              regarding a medical condition, mental health, or professional
              matters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              8. Accuracy of Results
            </h2>
            <p>
              While we strive to provide accurate personality assessments, we
              cannot guarantee the accuracy, completeness, or reliability of the
              results. Personality tests are tools for self-reflection and
              should be interpreted with understanding of their limitations.
              Results may vary based on:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your honesty and self-awareness when answering questions</li>
              <li>Your current mood or circumstances</li>
              <li>The inherent limitations of personality assessment tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              9. User Content
            </h2>
            <p>
              If you submit any content, feedback, or suggestions to us, you
              grant us a non-exclusive, worldwide, royalty-free, perpetual,
              irrevocable license to use, reproduce, modify, adapt, publish, and
              distribute such content in any form.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              10. Third-Party Links
            </h2>
            <p>
              Our Service may contain links to third-party websites or services
              that are not owned or controlled by MBTI Senpai. We have no
              control over, and assume no responsibility for, the content,
              privacy policies, or practices of any third-party websites or
              services. You acknowledge and agree that MBTI Senpai shall not be
              responsible or liable for any damage or loss caused by or in
              connection with the use of any such content or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              11. Termination
            </h2>
            <p>
              We may terminate or suspend your access to the Service
              immediately, without prior notice or liability, for any reason,
              including if you breach the Terms. Upon termination, your right to
              use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              12. Changes to Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions
              become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              13. Governing Law
            </h2>
            <p>
              These Terms shall be interpreted and governed by the laws of the
              jurisdiction in which the Service is operated, without regard to
              its conflict of law provisions. Our failure to enforce any right
              or provision of these Terms will not be considered a waiver of
              those rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              14. Severability
            </h2>
            <p>
              If any provision of these Terms is held to be invalid or
              unenforceable by a court, the remaining provisions of these Terms
              will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              15. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
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
