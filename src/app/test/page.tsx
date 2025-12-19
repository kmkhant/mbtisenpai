"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRightCircle } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileImage from "@/components/home/ProfileImage";
import type { MbtiQuestion } from "@/app/api/mbti/questions/route";

// Likert-style answer value:
// -2 strongly left, -1 slightly left, 0 neutral,
//  1 slightly right, 2 strongly right
type AnswerValue = -2 | -1 | 0 | 1 | 2;

type AnswerState = Record<number, AnswerValue | null>;

const QUESTIONS_PER_PAGE = 10;

export default function TestPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<MbtiQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        setIsLoadingQuestions(true);
        setError(null);

        const res = await fetch("/api/mbti/questions");

        if (!res.ok) {
          throw new Error("Failed to fetch questions.");
        }

        const data = (await res.json()) as {
          count: number;
          questions: MbtiQuestion[];
        };

        if (cancelled) return;

        setQuestions(data.questions);

        // Initialize answers map
        const initialAnswers: AnswerState = {};
        data.questions.forEach((q) => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(
            "Sorry, we couldn't load the questions. Please refresh and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingQuestions(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages =
    questions.length > 0 ? Math.ceil(questions.length / QUESTIONS_PER_PAGE) : 1;

  const currentPageQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const allAnswered =
    questions.length > 0 &&
    questions.every(
      (q) => answers[q.id] !== null && answers[q.id] !== undefined
    );

  const currentPageAnswered =
    currentPageQuestions.length > 0 &&
    currentPageQuestions.every(
      (q) => answers[q.id] !== null && answers[q.id] !== undefined
    );

  function handleNextPage() {
    if (isSubmitting) return;
    if (!currentPageAnswered) return;
    if (currentPage >= totalPages - 1) return;

    setCurrentPage((prev) => prev + 1);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePreviousPage() {
    if (isSubmitting) return;
    if (currentPage === 0) return;

    setCurrentPage((prev) => prev - 1);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    if (!allAnswered || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        answers: questions.map((q) => ({
          questionId: q.id,
          value: answers[q.id] as AnswerValue,
        })),
      };

      const res = await fetch("/api/mbti/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        // Parse error message from API response
        const errorMessage =
          result?.error || "Failed to score MBTI answers. Please try again.";
        throw new Error(errorMessage);
      }

      // Check for warnings from API
      if (result.warning) {
        // Store warning with result - will be displayed on result page
        console.warn("Quiz warning:", result.warning);
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("mbtiResult", JSON.stringify(result));

        // Use nanoid-based URL if available, otherwise fallback to old method
        if (result.id) {
          router.push(`/result/${result.id}`);
        } else {
          // Fallback: encode result in URL for sharing (backward compatibility)
          try {
            const json = JSON.stringify(result);
            const encoded = btoa(encodeURIComponent(json));
            router.push(`/result?data=${encoded}`);
          } catch {
            // Final fallback to regular navigation
            router.push("/result");
          }
        }
      } else {
        router.push("/result");
      }
    } catch (err) {
      console.error(err);
      // Use error message from API if available, otherwise show generic message
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your answers. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-2xl md:px-10 md:py-10">
        <header className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-300 bg-white/80 px-5 py-2 text-xs font-semibold tracking-wide text-fuchsia-600 shadow-sm sm:text-sm">
              <ProfileImage size="w-10 h-10" thickness={0} />
              <div>
                <div>MBTI Senpai Test</div>
                <div className="border-t border-zinc-200 w-full mt-1" />
                <div>
                  {questions.length > 0 ? (
                    <span className="text-xs mt-1 font-medium text-zinc-400">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                  ) : (
                    <Skeleton className="h-4 w-20 mt-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 space-y-6 sm:mt-10">
          {isLoadingQuestions && (
            <div className="space-y-6">
              {Array.from({ length: QUESTIONS_PER_PAGE }).map((_, index) => (
                <div key={index} className="space-y-3">
                  {/* Question prompt skeleton */}
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-5 w-6 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-4/5" />
                    </div>
                  </div>
                  {/* Left/Right labels skeleton */}
                  <div className="rounded-lg bg-zinc-50 px-3 py-2">
                    <div className="flex justify-between gap-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  {/* Radio buttons skeleton */}
                  <div className="flex flex-wrap items-center justify-between mx-4 gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className={`${
                          i === 0 || i === 4
                            ? "h-7 w-7"
                            : i === 1 || i === 3
                            ? "h-6 w-6"
                            : "h-5 w-5"
                        } rounded-full`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          {!isLoadingQuestions &&
            !error &&
            currentPageQuestions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <p className="text-sm leading-relaxed text-zinc-900 sm:text-base">
                  <span className="mr-1 font-bold">
                    {currentPage * QUESTIONS_PER_PAGE + index + 1}.
                  </span>
                  {question.prompt}
                </p>
                <div className="rounded-lg bg-zinc-50 px-3 py-2 text-[11px] text-zinc-600 sm:text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium text-left">
                      {question.left}
                    </span>
                    <span className="font-medium text-right">
                      {question.right}
                    </span>
                  </div>
                </div>

                <RadioGroup
                  className="flex flex-wrap items-center justify-between mx-4 gap-2"
                  value={
                    answers[question.id] !== null &&
                    answers[question.id] !== undefined
                      ? String(answers[question.id])
                      : ""
                  }
                  onValueChange={(value) => {
                    const numeric = Number(value) as AnswerValue;
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: numeric,
                    }));
                  }}
                >
                  <Label
                    htmlFor={`q${question.id}-m2`}
                    className="flex items-center gap-x-3 cursor-pointer"
                  >
                    <RadioGroupItem
                      value="-2"
                      id={`q${question.id}-m2`}
                      className="size-7 border-blue-400 data-[state=checked]:border-blue-600 [&_svg]:fill-blue-600"
                    />
                  </Label>
                  <Label
                    htmlFor={`q${question.id}-m1`}
                    className="flex items-center gap-x-3 cursor-pointer"
                  >
                    <RadioGroupItem
                      value="-1"
                      id={`q${question.id}-m1`}
                      className="size-6 border-blue-400 data-[state=checked]:border-blue-600 [&_svg]:fill-blue-600"
                    />
                  </Label>
                  <Label
                    htmlFor={`q${question.id}-0`}
                    className="flex items-center gap-x-3 cursor-pointer"
                  >
                    <RadioGroupItem
                      value="0"
                      id={`q${question.id}-0`}
                      className="size-5 border-slate-500 data-[state=checked]:border-slate-700 [&_svg]:fill-slate-700"
                    />
                  </Label>
                  <Label
                    htmlFor={`q${question.id}-p1`}
                    className="flex items-center gap-x-3 cursor-pointer"
                  >
                    <RadioGroupItem
                      value="1"
                      id={`q${question.id}-p1`}
                      className="size-6 border-fuchsia-400 data-[state=checked]:border-fuchsia-600 [&_svg]:fill-fuchsia-600"
                    />
                  </Label>
                  <Label
                    htmlFor={`q${question.id}-p2`}
                    className="flex items-center gap-x-3 cursor-pointer"
                  >
                    <RadioGroupItem
                      value="2"
                      id={`q${question.id}-p2`}
                      className="size-7 border-fuchsia-400 data-[state=checked]:border-fuchsia-600 [&_svg]:fill-fuchsia-600"
                    />
                  </Label>
                </RadioGroup>
              </div>
            ))}
        </section>

        <section className="mt-10 flex items-center justify-between sm:mt-12">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={currentPage === 0 || isSubmitting}
            className="inline-flex items-center justify-center rounded-full border border-pink-100 px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={
              currentPage === totalPages - 1 ? handleSubmit : handleNextPage
            }
            disabled={
              isSubmitting ||
              (currentPage === totalPages - 1
                ? !allAnswered
                : !currentPageAnswered)
            }
            className={`inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-pink-500 px-10 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-12 sm:text-base ${
              isSubmitting ||
              (currentPage === totalPages - 1
                ? !allAnswered
                : !currentPageAnswered)
                ? "opacity-60"
                : "hover:-translate-y-0.5 hover:shadow-fuchsia-300/80"
            }`}
          >
            {currentPage === totalPages - 1
              ? isSubmitting
                ? "Submitting..."
                : "See Result"
              : "Next Page"}
            <ChevronRightCircle className="h-5 w-5" />
          </button>
        </section>

        <footer className="mt-10 border-t border-zinc-100 pt-6 text-center text-[10px] text-zinc-400 sm:mt-12">
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
            ©2025 MBTI Senpai · Open-source · made with{" "}
            <span className="text-pink-500">♥</span> by{" "}
            <br />
            <Link
              href="https://www.linkedin.com/in/khaing-myel-khant-457b69146/"
              className="underline underline-offset-2 hover:text-pink-500"
            >
              Khaing Myel Khant
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
