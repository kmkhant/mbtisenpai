import Link from "next/link";
import {
  ChevronRightCircle,
  EarthIcon,
  MapPinIcon,
  MessageCircleIcon,
  PersonStandingIcon,
  TrendingUpDownIcon,
  PlayCircle,
  FileText,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import ProfileImage from "@/components/home/ProfileImage";
import StatsSection from "@/components/home/StatsSection";

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mbtisenpai.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "MBTI Senpai",
    description:
      "Free MBTI personality test - Take a quick, accurate personality assessment in just 10 minutes",
    url: siteUrl,
    applicationCategory: "PersonalityTest",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "500",
    },
    featureList: [
      "Free MBTI personality test",
      "Detailed personality insights",
      "Compatibility analysis",
      "Comprehensive results",
      "Quick 10-minute assessment",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <main className="w-full max-w-md rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10 lg:max-w-5xl">
          <header className="flex items-center justify-center md:justify-between">
            <div className="flex items-center gap-2">
              <ProfileImage thickness={1} />
              <span className="inline-flex items-center rounded-full border border-pink-400 bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text px-4 py-1 text-xs font-semibold tracking-wide text-transparent">
                MBTI Senpai
              </span>
            </div>

            <span className="hidden font-medium capitalize text-muted-foreground md:inline">
              Personality insights in 10 minutes
            </span>
          </header>

          <div className="mt-8 flex flex-col gap-10 md:mt-10 md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-12">
            <div className="space-y-6">
              <section className="space-y-4 text-center md:text-left">
                <h1 className="bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text text-3xl font-extrabold leading-tight text-transparent sm:text-4xl lg:text-5xl">
                  Take MBTI Test
                  <br />
                  Quick, Easy and Accurate
                  <br />
                  from Anywhere
                  <br />
                  for FREE
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  just give 10 minutes to accurately understand more about
                  yourself.
                </p>
                <Button className="mt-3 md:justify-start group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-pink-500 px-8 py-3 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white group-hover:text-base">
                  <Link href="/test">Take the Test</Link>
                  <ChevronRightCircle className="size-5 transition-all duration-300 ease-in-out group-hover:translate-x-0.5" />
                </Button>
              </section>

              <StatsSection />
            </div>

            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-lg font-semibold capitalize text-pink-500">
                  What MBTI Senpai helps you get
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Master your strengths and navigate your growth with expert
                  personality insights.
                </p>
              </section>

              <section>
                <ul className="mt-2 space-y-4 sm:space-y-5">
                  {[
                    {
                      title: "Discover Your Unique Persona",
                      icon: <PersonStandingIcon className="size-8" />,
                      body: "Real insights for the real you.",
                    },
                    {
                      title: "How you reacts to the world",
                      icon: <EarthIcon />,
                      body: "how you get energy, process data, make choices, organize your life.",
                    },
                    {
                      title: "Predict Behaviors",
                      icon: <TrendingUpDownIcon />,
                      body: "predict how you likely react in specific scenarios.",
                    },
                    {
                      title: "Communication Style Insights",
                      icon: <MessageCircleIcon />,
                      body: 'identifies potential "blind spots" in how you handle disagreements with opposing types.',
                    },
                    {
                      title: "Personal Growth Roadmap",
                      icon: <MapPinIcon />,
                      body: "transforms your results into a practical guide for self-improvement.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <div className="flex-none size-16 aspect-square rounded-full bg-linear-to-tr from-fuchsia-500 via-pink-400 to-orange-400 p-4 shadow-sm">
                        <div className="text-white size-full flex items-center justify-center">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-2">
                <button
                  type="button"
                  className="text-left text-sm font-semibold text-fuchsia-600 underline-offset-4 hover:underline"
                >
                  Explore Personality Types
                  <span className="ml-1" aria-hidden>
                    →
                  </span>
                </button>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Step into the shoes of all 16 archetypes and understand the
                  world through their eyes.
                </p>
              </section>
            </div>
          </div>

          <section className="mt-10 md:mt-12">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-xl font-semibold capitalize text-pink-500 sm:text-2xl">
                How MBTI Senpai Works
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Discover your personality type in just a few simple steps
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  step: "1",
                  title: "Start the Test",
                  icon: <PlayCircle className="size-6" />,
                  description:
                    "Click 'Take the Test' and begin your 10-minute journey to self-discovery.",
                },
                {
                  step: "2",
                  title: "Answer Questions",
                  icon: <FileText className="size-6" />,
                  description:
                    "Respond to carefully crafted questions that assess your personality preferences across four key dimensions.",
                },
                {
                  step: "3",
                  title: "Get Your Results",
                  icon: <BarChart3 className="size-6" />,
                  description:
                    "Receive your MBTI type based on our accurate scoring algorithm that analyzes your responses.",
                },
                {
                  step: "4",
                  title: "View Insights",
                  icon: <Sparkles className="size-6" />,
                  description:
                    "Explore detailed insights about your personality type, strengths, growth areas, and communication style.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-none size-12 rounded-full bg-linear-to-tr from-fuchsia-500 via-pink-400 to-orange-400 p-3 shadow-sm">
                      <div className="text-white size-full flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-fuchsia-600">
                          STEP {item.step}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 space-y-6 md:mt-12">
            <div className="text-center md:text-left">
              <h2 className="bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                What is MBTI?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Understanding the Myers-Briggs Type Indicator
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-pink-50 bg-fuchsia-50/40 p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-foreground sm:text-base">
                  The{" "}
                  <strong className="text-fuchsia-600">
                    Myers-Briggs Type Indicator (MBTI)
                  </strong>{" "}
                  is a personality assessment tool that helps you understand how
                  you perceive the world and make decisions. Based on Carl
                  Jung&apos;s theory of psychological types, MBTI categorizes
                  personalities into 16 distinct types across four key
                  dimensions.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    Extraversion (E) vs Introversion (I)
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    How you recharge and interact with the world. Extraverts
                    gain energy from social interaction, while Introverts
                    recharge through solitude and reflection.
                  </p>
                </div>

                <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    Sensing (S) vs Intuition (N)
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    How you take in information. Sensors focus on concrete facts
                    and present realities, while Intuitives look for patterns
                    and future possibilities.
                  </p>
                </div>

                <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    Thinking (T) vs Feeling (F)
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    How you make decisions. Thinkers prioritize logic and
                    objectivity, while Feelers consider values and the impact on
                    people.
                  </p>
                </div>

                <div className="rounded-xl border border-pink-50 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    Judging (J) vs Perceiving (P)
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    How you organize your outer world. Judgers prefer structure
                    and closure, while Perceivers like flexibility and keeping
                    options open.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-pink-100 bg-linear-to-br from-fuchsia-50 to-pink-50 p-6">
                <h3 className="text-sm font-semibold text-foreground sm:text-base">
                  Why Take the MBTI Test?
                </h3>
                <ul className="mt-3 space-y-2 text-xs text-foreground sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500 mt-0.5">•</span>
                    <span>
                      <strong>Self-awareness:</strong> Understand your natural
                      preferences and strengths
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500 mt-0.5">•</span>
                    <span>
                      <strong>Better relationships:</strong> Improve
                      communication by understanding different personality types
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500 mt-0.5">•</span>
                    <span>
                      <strong>Career insights:</strong> Discover work
                      environments and roles that align with your personality
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500 mt-0.5">•</span>
                    <span>
                      <strong>Personal growth:</strong> Identify areas for
                      development and understand your blind spots
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <footer className="mt-10 border-t border-border pt-6 text-center text-[10px] text-muted-foreground/60 md:mt-12 md:text-[11px]">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
              >
                About
              </Link>
              <span className="text-muted-foreground/40">·</span>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
              >
                Contact
              </Link>
              <span className="text-muted-foreground/40">·</span>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
              >
                Privacy
              </Link>
              <span className="text-muted-foreground/40">·</span>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-fuchsia-600 transition-colors"
              >
                Terms
              </Link>
            </div>
            <div className="md:flex md:items-center md:justify-between">
              <p>
                ©2025 MBTI Senpai · Open-source · made with{" "}
                <span className="text-pink-500">♥</span> by{" "}
                <Link
                  href="https://www.linkedin.com/in/khaing-myel-khant-457b69146/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-fuchsia-600 transition-colors underline underline-offset-2"
                >
                  Khaing Myel Khant
                </Link>
              </p>
              <p className="mt-2 md:mt-0">
                Designed for mobile, tablet and desktop.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
