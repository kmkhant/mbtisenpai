"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRightCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
          // eslint-disable-next-line no-console
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

      if (!res.ok) {
        throw new Error("Failed to score MBTI answers.");
      }

      const result = await res.json();

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("mbtiResult", JSON.stringify(result));
      }

      router.push("/result");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError(
        "Something went wrong while submitting your answers. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-2xl md:px-10 md:py-10">
        <header className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-pink-300 bg-white/80 px-5 py-2 text-xs font-semibold tracking-wide text-fuchsia-600 shadow-sm sm:text-sm">
              MBTI Senpai Test
            </span>
            {questions.length > 0 && (
              <span className="text-[11px] font-medium text-zinc-400">
                Page {currentPage + 1}/{totalPages}
              </span>
            )}
          </div>
        </header>

        <section className="mt-8 space-y-6 sm:mt-10">
          {isLoadingQuestions && (
            <p className="text-center text-sm text-zinc-500">
              Loading questions...
            </p>
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
                  className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold sm:text-xs"
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
                  <div className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value="-2"
                      id={`q${question.id}-m2`}
                      className=""
                    />
                    <Label htmlFor={`q${question.id}-m2`}>Strongly left</Label>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value="-1"
                      id={`q${question.id}-m1`}
                      className=""
                    />
                    <Label htmlFor={`q${question.id}-m1`}>Slightly left</Label>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value="0"
                      id={`q${question.id}-0`}
                      className=""
                    />
                    <Label htmlFor={`q${question.id}-0`}>Neutral</Label>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value="1"
                      id={`q${question.id}-p1`}
                      className=""
                    />
                    <Label htmlFor={`q${question.id}-p1`}>Slightly right</Label>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RadioGroupItem
                      value="2"
                      id={`q${question.id}-p2`}
                      className=""
                    />
                    <Label htmlFor={`q${question.id}-p2`}>Strongly right</Label>
                  </div>
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

        <footer className="mt-10 border-t border-zinc-100 pt-4 text-center text-[10px] text-zinc-400 sm:mt-12">
          <p>
            ©2025 MBTI Senpai · made with{" "}
            <span className="text-pink-500">♥</span> by{" "}
            <Link
              href="https://khaingmyelkhant.com"
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
