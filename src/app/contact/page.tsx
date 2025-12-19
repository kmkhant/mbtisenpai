import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Globe, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | MBTI Senpai",
  description: "Get in touch with MBTI Senpai - We'd love to hear from you!",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
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
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            We&apos;d love to hear from you! Get in touch with questions,
            feedback, or suggestions.
          </p>
        </header>

        <div className="prose prose-sm max-w-none space-y-8 text-zinc-700 sm:prose-base">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Get in Touch
            </h2>
            <p>
              Have a question about the test? Found a bug? Want to suggest a
              feature? We&apos;re here to help! Reach out to us through any of
              the following channels.
            </p>
          </section>

          <section>
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-none size-12 rounded-full bg-linear-to-tr from-fuchsia-500 via-pink-400 to-orange-400 p-3 shadow-sm">
                    <Globe className="text-white size-full" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    GitHub Profile
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 mb-3">
                  Visit the creator&apos;s GitHub profile
                </p>
                <a
                  href="https://github.com/kmkhant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 hover:underline"
                >
                  github.com/kmkhant →
                </a>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900 mb-2">
                  Is the test really free?
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Yes! MBTI Senpai is completely free. There are no hidden fees,
                  premium tiers, or credit card requirements. All features are
                  available to everyone at no cost.
                </p>
              </div>

              <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900 mb-2">
                  How accurate is the test?
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Our test uses a carefully designed algorithm based on the MBTI
                  framework. Accuracy depends on honest self-reflection when
                  answering questions. The test is designed for educational and
                  entertainment purposes.
                </p>
              </div>

              <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900 mb-2">
                  Is my data stored?
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Your quiz responses are processed in real-time and are not
                  permanently stored on our servers. Results are encoded in URL
                  parameters, allowing you to share or revisit your results. We
                  use Google Analytics for website usage statistics, but this
                  does not include your quiz responses. See our{" "}
                  <Link
                    href="/privacy"
                    className="text-fuchsia-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for more details.
                </p>
              </div>

              <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900 mb-2">
                  Can I use this for professional purposes?
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  No. The test and results are for entertainment and educational
                  purposes only. They should not be used for medical diagnosis,
                  psychological assessment, employment decisions, or any other
                  professional or clinical purpose. Please consult qualified
                  professionals for such needs.
                </p>
              </div>

              <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900 mb-2">
                  How long does the test take?
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  The test consists of 44 questions and typically takes about 10
                  minutes to complete. You can take it at your own pace.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Other Resources
            </h2>
            <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-6 shadow-sm">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 hover:underline"
                  >
                    About MBTI Senpai →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 hover:underline"
                  >
                    Privacy Policy →
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 hover:underline"
                  >
                    Terms of Service →
                  </Link>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <div className="rounded-xl border border-pink-100 bg-linear-to-br from-fuchsia-50 to-pink-50 p-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="text-fuchsia-600 size-6 flex-none mt-1" />
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-2">
                    Response Time
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    While we don&apos;t have a formal support system, we do our
                    best to address feedback and issues. For urgent matters,
                    please visit the creator&apos;s GitHub profile for direct
                    contact information.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
