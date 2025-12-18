"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Share2, Check, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderSection } from "./components/HeaderSection";
import { RadarChartSection } from "./components/RadarChartSection";
import { ResultSkeleton } from "./components/ResultSkeleton";
import { encodeResult, decodeResult } from "./utils";
import {
  useNormalizedScores,
  useChartData,
  useStrongestPreference,
  useDimensionNarratives,
  useRawScoreAnalysis,
} from "./hooks/use-result-data";
import { TYPE_EXPLANATIONS } from "./data/type-explanations";
import type { MbtiResult } from "./types";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
  TelegramIcon,
  TelegramShareButton,
  ViberIcon,
  ViberShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "next-share";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

// Lazy load below-the-fold sections
const CompatibilitySection = dynamic(
  () =>
    import("./components/CompatibilitySection").then((mod) => ({
      default: mod.CompatibilitySection,
    })),
  { ssr: false }
);

const DeepAnalysisSection = dynamic(
  () =>
    import("./components/DeepAnalysisSection").then((mod) => ({
      default: mod.DeepAnalysisSection,
    })),
  { ssr: false }
);

const TypeExplanationSection = dynamic(
  () =>
    import("./components/TypeExplanationSection").then((mod) => ({
      default: mod.TypeExplanationSection,
    })),
  { ssr: false }
);

const DimensionNarrativesSection = dynamic(
  () =>
    import("./components/DimensionNarrativesSection").then((mod) => ({
      default: mod.DimensionNarrativesSection,
    })),
  { ssr: false }
);

const DetailedScoreAnalysisSection = dynamic(
  () =>
    import("./components/DetailedScoreAnalysisSection").then((mod) => ({
      default: mod.DetailedScoreAnalysisSection,
    })),
  { ssr: false }
);

function ResultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<MbtiResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from URL params or sessionStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loadedResult: MbtiResult | null = null;

    const urlData = searchParams.get("data");
    if (urlData) {
      const decoded = decodeResult(urlData);
      if (decoded) {
        loadedResult = decoded;
        window.sessionStorage.setItem("mbtiResult", JSON.stringify(decoded));
      }
    }

    if (!loadedResult) {
      const stored = window.sessionStorage.getItem("mbtiResult");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as MbtiResult;
          if (
            parsed.type &&
            parsed.scores &&
            parsed.percentages &&
            typeof parsed.type === "string"
          ) {
            loadedResult = parsed;
            const encoded = encodeResult(loadedResult);
            if (encoded) {
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.set("data", encoded);
              router.replace(newUrl.pathname + newUrl.search, {
                scroll: false,
              });
            }
          } else {
            window.sessionStorage.removeItem("mbtiResult");
          }
        } catch {
          window.sessionStorage.removeItem("mbtiResult");
        }
      }
    }

    setResult(loadedResult);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate shareable URL (same as copy link handler)
  const shareableUrl = (() => {
    if (!result || typeof window === "undefined") return "";
    const encoded = encodeResult(result);
    if (!encoded) return "";
    return `${window.location.origin}/result?data=${encoded}`;
  })();

  const handleShare = async () => {
    if (!result || !shareableUrl) return;

    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareableUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Failed to copy
      }
      document.body.removeChild(textArea);
    }
  };

  // Update Open Graph metadata
  useEffect(() => {
    if (!result || !isHydrated || typeof window === "undefined") return;

    const type = result.type === "XXXX" ? "Unable to Determine" : result.type;
    const typeTitle =
      TYPE_EXPLANATIONS[result.type]?.typeTitle || "MBTI Result";
    const description =
      TYPE_EXPLANATIONS[result.type]?.typeDescription?.substring(0, 160) +
        "..." ||
      `Your MBTI type is ${type}. Discover your personality insights.`;

    const encoded = encodeResult(result);
    if (!encoded) return;

    const ogImageUrl = `${
      window.location.origin
    }/api/og/result?data=${encodeURIComponent(encoded)}`;

    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateNameTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    document.title = `${type} - ${typeTitle} | MBTI Senpai`;
    updateMetaTag("og:title", `${type} - ${typeTitle}`);
    updateMetaTag("og:description", description);
    updateMetaTag("og:image", ogImageUrl);
    updateMetaTag("og:type", "website");
    updateMetaTag("og:url", window.location.href);
    updateNameTag("twitter:card", "summary_large_image");
    updateNameTag("twitter:title", `${type} - ${typeTitle}`);
    updateNameTag("twitter:description", description);
    updateNameTag("twitter:image", ogImageUrl);
    updateNameTag("description", description);
  }, [result, isHydrated]);

  const mbtiType =
    result?.type === "XXXX"
      ? "Unable to Determine"
      : result?.type ?? "Your MBTI Type";

  const derivedPercentages = result ? result.percentages : null;
  const normalizedScores = useNormalizedScores(result);
  const chartData = useChartData(result, normalizedScores);
  const strongestPreference = useStrongestPreference(result);
  const dimensionNarratives = useDimensionNarratives(derivedPercentages);
  const rawScoreAnalysis = useRawScoreAnalysis(result, normalizedScores);

  if (!isHydrated) {
    return <ResultSkeleton />;
  }

  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10">
        <HeaderSection type={result?.type ?? null} />

        <div className="border-t border-zinc-200 w-full mt-4" />

        <section className="mt-7 space-y-1 text-center md:text-left">
          <p className="text-lg font-semibold capitalize text-pink-500">
            Your type
          </p>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
            <h1 className="bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-5xl">
              {mbtiType}
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            This result is based on how often you chose each side of the MBTI
            dichotomies across all questions in the test.
          </p>
          {!result && (
            <p className="text-xs text-red-500 sm:text-sm">
              No recent test result found. Please take the test first.
            </p>
          )}
          {result?.warning && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 sm:text-sm">
              <p className="font-semibold">⚠️ Notice:</p>
              <p className="mt-1">{result.warning}</p>
            </div>
          )}
        </section>

        {result && normalizedScores && (
          <RadarChartSection
            chartData={chartData}
            strongestPreferenceLabel={strongestPreference.label}
            strongestPreferenceDescription={strongestPreference.description}
          />
        )}

        <section className="mt-5 text-xs text-zinc-500 sm:text-sm">
          <p className="font-semibold capitalize text-pink-500">
            Letter meanings
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {[
              ["E", "Extraversion"],
              ["I", "Introversion"],
              ["S", "Sensing"],
              ["N", "Intuition"],
              ["T", "Thinking"],
              ["F", "Feeling"],
              ["J", "Judging"],
              ["P", "Perceiving"],
            ].map(([letter, label]) => (
              <div key={letter} className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-pink-500">
                  {letter}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-3 text-sm text-zinc-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-zinc-900">What this means</p>
            <p className="text-xs text-zinc-500 sm:text-sm">
              Your four-letter type summarizes how you tend to get energy, take
              in information, make decisions and organize your outer world.
            </p>
          </div>
        </section>

        {result && result.type === "XXXX" && (
          <section className="mt-6 space-y-3 text-xs text-zinc-600 sm:text-sm">
            <div className="mt-3 space-y-1 rounded-xl bg-amber-50/60 px-4 py-3 border border-amber-200">
              <p className="text-sm font-semibold text-amber-900 sm:text-base">
                Unable to Determine Your Type
              </p>
              <p className="text-xs text-amber-800 sm:text-sm">
                All your answers were neutral, making it impossible to determine
                your MBTI type. Please retake the test and provide more
                definitive answers to get accurate results.
              </p>
            </div>
          </section>
        )}

        {result && result.type !== "XXXX" && (
          <Suspense fallback={null}>
            <TypeExplanationSection type={result.type} mbtiType={mbtiType} />
          </Suspense>
        )}

        {dimensionNarratives.length > 0 && (
          <Suspense fallback={null}>
            <DimensionNarrativesSection narratives={dimensionNarratives} />
          </Suspense>
        )}

        {result && result.type !== "XXXX" && (
          <Suspense fallback={null}>
            <CompatibilitySection type={result.type} />
          </Suspense>
        )}

        {rawScoreAnalysis && rawScoreAnalysis.length > 0 && (
          <Suspense fallback={null}>
            <DetailedScoreAnalysisSection rawScoreAnalysis={rawScoreAnalysis} />
          </Suspense>
        )}

        {result && result.type !== "XXXX" && (
          <Suspense fallback={null}>
            <DeepAnalysisSection type={result.type} />
          </Suspense>
        )}

        <section className="mt-4 flex items-center justify-center flex-wrap gap-3">
          {result && (
            <Button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-100 px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          )}
          <div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-100 px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white">
                    <Share2 className="h-4 w-4" />
                    <div>Share Result</div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Result via</DialogTitle>
                    <DialogDescription>
                      Share your result with your friends and family.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <FacebookShareButton url={shareableUrl}>
                      <div className="inline-flex items-center justify-center gap-2 rounded-md border w-full px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white">
                        <FacebookIcon size={24} />
                        <div>Share on Facebook</div>
                      </div>
                    </FacebookShareButton>
                    <FacebookMessengerShareButton
                      url={shareableUrl}
                      appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? ""}
                    >
                      <div className="inline-flex items-center justify-center gap-2 rounded-md border w-full px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white">
                        <FacebookMessengerIcon size={24} />
                        <div>Share on Facebook Messenger</div>
                      </div>
                    </FacebookMessengerShareButton>
                    <TwitterShareButton url={shareableUrl}>
                      <div className="inline-flex items-center justify-center gap-2 rounded-md border w-full px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white">
                        <TwitterIcon size={24} />
                        <div>Share on Twitter</div>
                      </div>
                    </TwitterShareButton>
                    <TelegramShareButton url={shareableUrl}>
                      <div className="inline-flex items-center justify-center gap-2 rounded-md border w-full px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white">
                        <TelegramIcon size={24} />
                        <div>Share on Telegram</div>
                      </div>
                    </TelegramShareButton>
                    <ViberShareButton url={shareableUrl}>
                      <div className="inline-flex items-center justify-center gap-2 rounded-md border w-full px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white">
                        <ViberIcon size={24} />
                        <div>Share on Viber</div>
                      </div>
                    </ViberShareButton>
                    <LinkedinShareButton url={shareableUrl}>
                      <div className="inline-flex items-center justify-center gap-2 rounded-md border w-full px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm bg-white">
                        <LinkedinIcon size={24} />
                        <div>Share on Linkedin</div>
                      </div>
                    </LinkedinShareButton>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Link
            href="/test"
            className="inline-flex items-center justify-center rounded-full border border-pink-100 px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm"
          >
            Retake test
          </Link>
          <Button className="bg-linear-to-r from-fuchsia-500 to-pink-500 text-white">
            <Link href="/">Return to Home</Link>
          </Button>
        </section>

        <footer className="mt-8 border-t border-zinc-100 pt-6 text-center text-[10px] text-zinc-400 sm:mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              href="/about"
              className="text-zinc-500 hover:text-fuchsia-600 transition-colors"
            >
              About
            </Link>
            <span className="text-zinc-300">·</span>
            <Link
              href="/contact"
              className="text-zinc-500 hover:text-fuchsia-600 transition-colors"
            >
              Contact
            </Link>
            <span className="text-zinc-300">·</span>
            <Link
              href="/privacy"
              className="text-zinc-500 hover:text-fuchsia-600 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-zinc-300">·</span>
            <Link
              href="/terms"
              className="text-zinc-500 hover:text-fuchsia-600 transition-colors"
            >
              Terms
            </Link>
          </div>
          <p>
            ©2025 MBTI Senpai · Open-source · made with
            <span className="text-pink-500"> ♥ </span>
            by{" "}
            <Link
              href="https://www.linkedin.com/in/khaing-myel-khant-457b69146/"
              className="font-medium underline underline-offset-2 hover:text-pink-500"
            >
              Khaing Myel Khant
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}

// Export the client component for use in server wrapper
export { ResultPageContent };
