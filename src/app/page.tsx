import Link from "next/link";
import {
  ChevronRightCircle,
  EarthIcon,
  MapPinIcon,
  MessageCircleIcon,
  PersonStandingIcon,
  TrendingUpDownIcon,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="w-full max-w-md rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10 lg:max-w-5xl">
        <header className="flex items-center justify-center md:justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Image
                src="/logo.png"
                alt="MBTI Senpai"
                width={100}
                height={100}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <span className="inline-flex items-center rounded-full border border-pink-400 bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text px-4 py-1 text-xs font-semibold tracking-wide text-transparent">
              MBTI Senpai
            </span>
          </div>

          <span className="hidden font-medium capitalize text-zinc-400 md:inline">
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
              </h1>
              <p className="text-sm leading-relaxed text-zinc-500 sm:text-base">
                just give 10 minutes to accurately understand more about
                yourself.
              </p>
              <div className="mt-3 flex justify-center md:justify-start">
                <Link
                  href="/test"
                  className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-pink-500 px-8 py-3 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white group-hover:text-base"
                >
                  Take the Test
                  <ChevronRightCircle className="size-5 transition-all duration-300 ease-in-out group-hover:translate-x-0.5" />
                </Link>
              </div>
            </section>

            <section className="mt-4 rounded-2xl border border-pink-50 bg-fuchsia-50/60 px-4 py-4 text-center text-xs text-zinc-600 shadow-sm sm:text-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-lg font-semibold bg-linear-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                    13,100+
                  </div>
                  <div className="mt-1 text-xs font-medium capitalize text-zinc-500">
                    Site Visits
                  </div>
                </div>
                <div className="h-10 w-px bg-pink-100" />
                <div className="flex-1">
                  <div className="text-lg font-semibold bg-linear-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="mt-1 text-xs font-medium capitalize text-zinc-500">
                    Tests Taken
                  </div>
                </div>
                <div className="h-10 w-px bg-pink-100" />
                <div className="flex-1">
                  <div className="text-lg font-semibold bg-linear-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                    93.17%
                  </div>
                  <div className="mt-1 text-xs font-medium capitalize text-zinc-500">
                    Accuracy
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold capitalize text-pink-500">
                What MBTI Senpai helps you get for FREE
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600">
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
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
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
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Step into the shoes of all 16 archetypes and understand the
                world through their eyes.
              </p>
            </section>
          </div>
        </div>

        <footer className="mt-10 border-t border-zinc-100 pt-4 text-center text-[10px] text-zinc-400 md:mt-12 md:flex md:items-center md:justify-between md:text-left md:text-[11px]">
          <p>
            ©2025 MBTI Senpai · made with{" "}
            <span className="text-pink-500">♥</span> by Khaing Myel Khant
          </p>
          <p className="mt-2 md:mt-0">
            Designed for mobile, tablet and desktop.
          </p>
        </footer>
      </main>
    </div>
  );
}
