import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { PersonStandingIcon, Sparkles, BarChart3, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About | MBTI Senpai",
  description:
    "Learn about MBTI Senpai - A free, accurate MBTI personality test designed to help you discover your true self.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
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
            About MBTI Senpai
          </h1>
        </header>

        <div className="prose prose-sm max-w-none space-y-8 text-zinc-700 sm:prose-base">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Our Mission
            </h2>
            <p>
              MBTI Senpai was created with a simple mission: to make personality
              insights accessible, accurate, and free for everyone. We believe
              that understanding yourself is the first step toward personal
              growth, better relationships, and a more fulfilling life.
            </p>
            <p>
              Our goal is to provide a high-quality MBTI assessment that helps
              you discover your personality type quickly and easily, without the
              barriers of cost or complexity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              What Makes Us Different
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-none size-12 rounded-full bg-linear-to-tr from-fuchsia-500 via-pink-400 to-orange-400 p-3 shadow-sm">
                    <PersonStandingIcon className="text-white size-full" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    Completely Free
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  No hidden fees, no premium tiers, no credit card required. Our
                  entire service is free for everyone.
                </p>
              </div>

              <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-none size-12 rounded-full bg-linear-to-tr from-fuchsia-500 via-pink-400 to-orange-400 p-3 shadow-sm">
                    <BarChart3 className="text-white size-full" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    Accurate Results
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Our carefully designed algorithm ensures accurate personality
                  type determination based on your responses.
                </p>
              </div>

              <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-none size-12 rounded-full bg-linear-to-tr from-fuchsia-500 via-pink-400 to-orange-400 p-3 shadow-sm">
                    <Sparkles className="text-white size-full" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    Detailed Insights
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Get comprehensive analysis including compatibility,
                  communication styles, and personal growth recommendations.
                </p>
              </div>

              <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-none size-12 rounded-full bg-linear-to-tr from-fuchsia-500 via-pink-400 to-orange-400 p-3 shadow-sm">
                    <Heart className="text-white size-full" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900">
                    Privacy First
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Your quiz responses are processed in real-time and not
                  permanently stored. Your privacy is our priority.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              About the MBTI
            </h2>
            <p>
              The Myers-Briggs Type Indicator (MBTI) is a personality assessment
              tool based on Carl Jung&apos;s theory of psychological types. It
              categorizes personalities into 16 distinct types across four key
              dimensions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Extraversion (E) vs Introversion (I):</strong> How you
                recharge and interact with the world
              </li>
              <li>
                <strong>Sensing (S) vs Intuition (N):</strong> How you take in
                information
              </li>
              <li>
                <strong>Thinking (T) vs Feeling (F):</strong> How you make
                decisions
              </li>
              <li>
                <strong>Judging (J) vs Perceiving (P):</strong> How you organize
                your outer world
              </li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> MBTI Senpai is not affiliated with,
              endorsed by, or associated with The Myers & Briggs Foundation. The
              Myers-Briggs Type Indicator® and MBTI® are trademarks or
              registered trademarks of The Myers & Briggs Foundation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              How It Works
            </h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Take the Test:</strong> Answer 44 carefully crafted
                questions that assess your personality preferences across the
                four MBTI dimensions.
              </li>
              <li>
                <strong>Get Your Results:</strong> Our algorithm analyzes your
                responses and determines your personality type.
              </li>
              <li>
                <strong>Explore Insights:</strong> Discover detailed information
                about your type, including strengths, growth areas,
                communication styles, and compatibility with other types.
              </li>
              <li>
                <strong>Share & Learn:</strong> Share your results with others
                and learn more about different personality types.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Our Commitment
            </h2>
            <p>
              We are committed to providing a valuable, free service that helps
              people understand themselves better. We continuously work to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Improve the accuracy of our assessments</li>
              <li>Enhance the user experience</li>
              <li>Protect your privacy and data</li>
              <li>Keep the service completely free</li>
              <li>Provide educational and insightful content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Open Source
            </h2>
            <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-zinc-700">
                MBTI Senpai is an <strong>open-source project</strong> released
                under the{" "}
                <a
                  href="https://opensource.org/licenses/MIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-fuchsia-600 hover:underline"
                >
                  MIT License
                </a>
                . The source code is freely available for anyone to use, modify,
                and distribute.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                We believe in the power of open-source software and welcome
                contributions from the community. If you&apos;d like to
                contribute, improve, or learn from this project, feel free to
                explore the codebase and submit pull requests.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Creator
            </h2>
            <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-zinc-700">
                MBTI Senpai was created by{" "}
                <a
                  href="https://www.linkedin.com/in/khaing-myel-khant-457b69146/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-fuchsia-600 hover:underline"
                >
                  Khaing Myel Khant
                </a>
                , a developer passionate about creating useful, free tools that
                help people understand themselves and grow personally.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                This project was built with the goal of making personality
                insights accessible to everyone, regardless of their ability to
                pay for professional assessments.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Disclaimer
            </h2>
            <div className="rounded-xl border border-pink-100 bg-linear-to-br from-fuchsia-50 to-pink-50 p-6">
              <p className="text-sm leading-relaxed text-zinc-700">
                The MBTI personality test and results provided by MBTI Senpai
                are for entertainment and educational purposes only. They are
                not intended to be used for medical diagnosis, psychological
                assessment, employment decisions, or any other professional or
                clinical purpose.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                If you have concerns about your mental health or need
                professional guidance, please consult with a qualified mental
                health professional or healthcare provider.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl">
              Feedback & Support
            </h2>
            <p>
              We value your feedback and are always looking to improve. If you
              have suggestions, questions, or encounter any issues, please
              don&apos;t hesitate to reach out through our{" "}
              <Link
                href="/contact"
                className="text-fuchsia-600 hover:underline"
              >
                contact page
              </Link>
              .
            </p>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
