"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

type MbtiResult = {
  type: string;
  scores: Record<MbtiLetter, number>;
  percentages: Record<MbtiLetter, number>;
  warning?: string;
};

type TypeExplanation = {
  groupTitle: string;
  groupDescription: string;
  typeTitle: string;
  typeDescription: string;
};

const TYPE_EXPLANATIONS: Record<string, TypeExplanation> = {
  // Analysts – Intuitive & Thinking
  INTJ: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Architect",
    typeDescription:
      "Strategic, imaginative, and independent thinkers who naturally look for patterns behind the chaos. INTJs like having a long-term vision and carefully designed systems, and they often prefer working alone or with a small circle of competent people. They may need to remember to share their inner plans with others and soften a tendency toward perfectionism or excessive criticism.",
  },
  INTP: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Logician",
    typeDescription:
      "Innovative, curious problem-solvers who love taking ideas apart and rebuilding them into elegant theories. INTPs are energized by questions, patterns, and abstract models more than by practical details or routines. They may struggle with finishing projects, communicating clearly in emotional situations, or turning their many ideas into consistent action.",
  },
  ENTJ: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Commander",
    typeDescription:
      "Decisive, goal-focused leaders who are quick to take charge and organize people and resources. ENTJs think in terms of efficiency, long‑term strategy, and measurable results, and they often feel most alive when fixing broken systems. They may come across as blunt or impatient, so learning to slow down, listen, and show appreciation helps balance their intensity.",
  },
  ENTP: {
    groupTitle: "The Analysts (Intuitive & Thinking)",
    groupDescription:
      "These types are known for their rationality, intellectual excellence, and love for problem-solving.",
    typeTitle: "The Debater",
    typeDescription:
      'Quick-witted, idea-driven explorers who love to challenge assumptions and play "devil\'s advocate." ENTPs enjoy debate, brainstorming, and discovering new angles more than settling on one fixed path. They may need to watch out for starting too many things at once, dismissing feelings as irrational, or getting bored with necessary follow‑through.',
  },

  // Diplomats – Intuitive & Feeling
  INFJ: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Advocate",
    typeDescription:
      "Quietly insightful idealists who look for deeper patterns in people and society. INFJs are drawn to meaningful work, authentic relationships, and causes that align with their values, often serving as guides or confidants to others. They may need to protect their energy, set clearer boundaries, and share their needs instead of silently carrying everyone else’s burdens.",
  },
  INFP: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Mediator",
    typeDescription:
      "Imaginative, values-driven individuals who filter life through a rich inner world of meaning and emotion. INFPs care deeply about authenticity, fairness, and living in alignment with what feels morally right to them. They may struggle with self‑doubt, conflict, and practical structure, so turning ideals into small, concrete steps is especially helpful.",
  },
  ENFJ: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Protagonist",
    typeDescription:
      "Warm, expressive leaders who naturally tune into what people need and how to bring them together. ENFJs often see potential in others before they see it in themselves and enjoy mentoring, guiding, and coordinating group efforts. They may overextend themselves or neglect their own needs, so learning to say no and check in with their personal values is important.",
  },
  ENFP: {
    groupTitle: "The Diplomats (Intuitive & Feeling)",
    groupDescription:
      "These types focus on empathy, personal growth, and creating harmony in the world.",
    typeTitle: "The Campaigner",
    typeDescription:
      "Enthusiastic, people‑oriented explorers who are energized by ideas, possibilities, and meaningful conversations. ENFPs often connect quickly with others, spotting unique strengths and weaving stories about what could be. They may find it hard to follow rigid routines, finish every project they start, or tolerate environments that feel shallow or controlling.",
  },

  // Sentinels – Sensing & Judging
  ISTJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Logistician",
    typeDescription:
      "Practical, thorough, and responsible individuals who take commitments seriously and notice the details others miss. ISTJs prefer clear rules, tested methods, and realistic plans, often becoming the steady anchor in work and family life. They may need to stay open to new perspectives and avoid being too hard on themselves or others when things deviate from the plan.",
  },
  ISFJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Defender",
    typeDescription:
      "Gentle, observant caretakers who notice what people need and quietly step in to help. ISFJs value loyalty, stability, and a sense of duty, often putting significant effort into creating comfort and security for others. They may forget their own needs, avoid conflict, or resist change until they feel fully prepared.",
  },
  ESTJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Executive",
    typeDescription:
      "Efficient, results‑oriented organizers who like to take charge and make sure things get done correctly and on time. ESTJs are comfortable with clear structure, measurable goals, and direct communication, especially when coordinating people or processes. They may need to soften a tendency toward bluntness and remember that not everyone moves at the same pace.",
  },
  ESFJ: {
    groupTitle: "The Sentinels (Sensing & Judging)",
    groupDescription:
      "These types value tradition, order, and stability. They are the backbone of organizations and families.",
    typeTitle: "The Consul",
    typeDescription:
      "Warm, sociable supporters who enjoy being at the center of a healthy, connected community. ESFJs pay close attention to how people are feeling and often step into roles that involve organizing, hosting, or caretaking. They may be sensitive to criticism or tension and benefit from spaces where they can process their own emotions, not just everyone else's.",
  },

  // Explorers – Sensing & Perceiving
  ISTP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Virtuoso",
    typeDescription:
      "Independent, hands‑on problem‑solvers who like to figure out how things work by experimenting. ISTPs stay calm under pressure, often excelling in situations that require quick thinking and practical skill. They may find planning, emotional conversations, or long‑term commitments draining if those areas feel too restrictive or theoretical.",
  },
  ISFP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Adventurer",
    typeDescription:
      "Gentle, present‑focused creators who often express themselves through aesthetics, experiences, or quiet acts of kindness. ISFPs value personal freedom, authenticity, and living in a way that feels true to who they are in the moment. They may avoid conflict or rigid structure, so it helps to create simple routines that still leave room for spontaneity.",
  },
  ESTP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Entrepreneur",
    typeDescription:
      "Energetic, action‑oriented doers who prefer to learn by jumping in rather than over‑planning. ESTPs are quick to notice opportunities, read the room, and respond in real time, which makes them effective in fast‑moving environments. They may need to watch out for impulsiveness, risk‑taking without reflection, or boredom with long‑term commitments.",
  },
  ESFP: {
    groupTitle: "The Explorers (Sensing & Perceiving)",
    groupDescription:
      "These types are known for their spontaneity, hands-on skills, and ability to react quickly to the present moment.",
    typeTitle: "The Entertainer",
    typeDescription:
      "Playful, expressive personalities who bring color, warmth, and excitement into whatever space they enter. ESFPs enjoy shared experiences, sensory pleasure, and making the moment enjoyable for themselves and others. They may resist strict structure or heavy topics for too long, so it helps to build supportive routines that still allow room for fun and flexibility.",
  },
};

const fallbackChartData = [
  { dimension: "E", score: 50 },
  { dimension: "I", score: 50 },
  { dimension: "S", score: 50 },
  { dimension: "N", score: 50 },
  { dimension: "T", score: 50 },
  { dimension: "F", score: 50 },
  { dimension: "J", score: 50 },
  { dimension: "P", score: 50 },
];

const chartConfig = {
  score: {
    label: "Preference strength",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ResultPage() {
  const [result] = useState<MbtiResult | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = window.sessionStorage.getItem("mbtiResult");
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored) as MbtiResult;
      // Validate result structure
      if (
        !parsed.type ||
        !parsed.scores ||
        !parsed.percentages ||
        typeof parsed.type !== "string"
      ) {
        // Invalid structure - clear and return null
        window.sessionStorage.removeItem("mbtiResult");
        return null;
      }
      return parsed;
    } catch {
      // Invalid JSON - clear and return null
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("mbtiResult");
      }
      return null;
    }
  });

  // Handle invalid type "XXXX" (all neutral answers)
  const mbtiType =
    result?.type === "XXXX"
      ? "Unable to Determine"
      : result?.type ?? "Your MBTI Type";

  // Use percentages directly from API instead of recalculating
  // This ensures consistency with the API's normalization logic
  const derivedPercentages = useMemo(
    () => (result ? result.percentages : null),
    [result]
  );

  // Normalize raw scores to 0-100 range for radar chart
  // This allows visualization of actual score values (including negatives)
  const normalizedScores = useMemo(() => {
    if (!result?.scores) return null;

    const scores = result.scores;
    const allValues = Object.values(scores);
    const minScore = Math.min(...allValues);
    const maxScore = Math.max(...allValues);
    const range = maxScore - minScore;

    // If all scores are the same, return 50 for all (neutral)
    if (range === 0) {
      return {
        E: 50,
        I: 50,
        S: 50,
        N: 50,
        T: 50,
        F: 50,
        J: 50,
        P: 50,
      };
    }

    // Normalize to 0-100 range
    const normalized: Record<MbtiLetter, number> = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    for (const letter of Object.keys(normalized) as MbtiLetter[]) {
      // Normalize: (value - min) / range * 100
      normalized[letter] = Math.round(
        ((scores[letter] - minScore) / range) * 100
      );
    }

    return normalized;
  }, [result]);

  const chartData = useMemo(
    () =>
      result && normalizedScores
        ? ([
            {
              dimension: "E",
              score: normalizedScores.E,
              rawScore: result.scores.E,
            },
            {
              dimension: "I",
              score: normalizedScores.I,
              rawScore: result.scores.I,
            },
            {
              dimension: "S",
              score: normalizedScores.S,
              rawScore: result.scores.S,
            },
            {
              dimension: "N",
              score: normalizedScores.N,
              rawScore: result.scores.N,
            },
            {
              dimension: "T",
              score: normalizedScores.T,
              rawScore: result.scores.T,
            },
            {
              dimension: "F",
              score: normalizedScores.F,
              rawScore: result.scores.F,
            },
            {
              dimension: "J",
              score: normalizedScores.J,
              rawScore: result.scores.J,
            },
            {
              dimension: "P",
              score: normalizedScores.P,
              rawScore: result.scores.P,
            },
          ] as { dimension: MbtiLetter; score: number; rawScore: number }[])
        : fallbackChartData,
    [result, normalizedScores]
  );

  const strongestPreferenceLabel = useMemo(() => {
    if (!result || !derivedPercentages)
      return "Complete the test to see your strongest preference.";

    const entries = Object.entries(derivedPercentages) as [
      MbtiLetter,
      number
    ][];
    const [topLetter] = entries.reduce(
      (max, current) => (current[1] > max[1] ? current : max),
      entries[0]
    );

    const labelMap: Record<MbtiLetter, string> = {
      E: "Extraversion",
      I: "Introversion",
      S: "Sensing",
      N: "Intuition",
      T: "Thinking",
      F: "Feeling",
      J: "Judging",
      P: "Perceiving",
    };

    return `Your strongest preference is toward ${labelMap[topLetter]}.`;
  }, [result, derivedPercentages]);

  const dimensionNarratives = useMemo(() => {
    if (!derivedPercentages) return [];

    type DimensionNarrative = {
      key: string;
      title: string;
      summary: string;
    };

    const describeAxis = (
      a: MbtiLetter,
      b: MbtiLetter,
      title: string
    ): DimensionNarrative => {
      const aScore = derivedPercentages[a];
      const bScore = derivedPercentages[b];
      const dominant = aScore >= bScore ? a : b;
      const dominantScore = aScore >= bScore ? aScore : bScore;

      const formatPercent = (value: number) => `${value}%`;

      if (a === "E" && b === "I") {
        if (dominant === "E") {
          return {
            key: "EI",
            title,
            summary: `You lean about ${formatPercent(
              dominantScore
            )} toward Extraversion. You’re more likely to recharge through interaction, shared experiences and outer stimulation, but still have an Introverted side that sometimes needs quiet time to reset.`,
          };
        }
        return {
          key: "EI",
          title,
          summary: `You lean about ${formatPercent(
            dominantScore
          )} toward Introversion. You likely recharge through solitude, reflection and a small circle of close connections, while still being able to step into more social, outgoing modes when needed.`,
        };
      }

      if (a === "S" && b === "N") {
        if (dominant === "S") {
          return {
            key: "SN",
            title,
            summary: `You lean about ${formatPercent(
              dominantScore
            )} toward Sensing. You tend to notice concrete facts, current realities and practical details first, adding intuition and imagination as a secondary layer when it’s useful.`,
          };
        }
        return {
          key: "SN",
          title,
          summary: `You lean about ${formatPercent(
            dominantScore
          )} toward Intuition. You’re more drawn to patterns, possibilities and the “big picture,” filling in details as needed rather than starting from them.`,
        };
      }

      if (a === "T" && b === "F") {
        if (dominant === "T") {
          return {
            key: "TF",
            title,
            summary: `You lean about ${formatPercent(
              dominantScore
            )} toward Thinking. You’re inclined to evaluate situations through logic, consistency and fairness of principles, even though feelings and harmony still matter to you in close relationships.`,
          };
        }
        return {
          key: "TF",
          title,
          summary: `You lean about ${formatPercent(
            dominantScore
          )} toward Feeling. You’re more likely to prioritize people, impact and values in decisions, while still appreciating clear reasoning when stakes are high.`,
        };
      }

      // J vs P
      if (dominant === "J") {
        return {
          key: "JP",
          title,
          summary: `You lean about ${formatPercent(
            dominantScore
          )} toward Judging. You probably feel calmer when plans, timelines and expectations are defined, even if you still enjoy some flexibility and last‑minute inspiration.`,
        };
      }
      return {
        key: "JP",
        title,
        summary: `You lean about ${formatPercent(
          dominantScore
        )} toward Perceiving. You tend to keep options open, adapt in the moment and follow emerging opportunities, even if you can use structure when it serves your goals.`,
      };
    };

    return [
      describeAxis("E", "I", "How you recharge and show up socially"),
      describeAxis("S", "N", "How you take in and interpret information"),
      describeAxis("T", "F", "How you evaluate and make decisions"),
      describeAxis("J", "P", "How you like to organize your outer world"),
    ];
  }, [derivedPercentages]);

  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10">
        <header className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MBTI Senpai"
              width={100}
              height={100}
              className="w-10 h-10 rounded-full"
            />
            <span className="inline-flex items-center rounded-full border border-pink-400 bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text px-4 py-1 text-xs font-semibold tracking-wide text-transparent">
              MBTI Senpai Result
            </span>
          </div>
          <p className="text-[11px] font-medium capitalize text-zinc-400">
            Your personalized personality snapshot
          </p>
        </header>

        <section className="mt-7 space-y-3 text-center md:text-left">
          <p className="text-xs font-semibold capitalize text-pink-500">
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

        <section className="mt-8">
          <Card className="bg-fuchsia-50/40">
            <CardHeader className="items-center pb-3 text-center">
              <CardTitle>Preference radar</CardTitle>
              <CardDescription>
                Raw scores normalized for visualization (hover to see actual
                values).
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[260px] w-full min-h-[220px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData} outerRadius="75%">
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <PolarAngleAxis dataKey="dimension" tickLine={false} />
                    <PolarGrid />
                    <Radar
                      dataKey="score"
                      stroke="var(--color-score)"
                      fill="var(--color-score)"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-xs text-zinc-600 sm:text-sm">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 font-medium text-zinc-800">
                <TrendingUp className="h-4 w-4 text-fuchsia-500" />
                {strongestPreferenceLabel}
              </div>
              <p>
                Chart shows normalized raw scores. Hover over points to see
                actual score values. Scores are calculated from weighted
                question responses across the entire test.
              </p>
            </CardFooter>
          </Card>
        </section>

        <section className="mt-5 text-xs text-zinc-500 sm:text-sm">
          <p className="font-semibold capitalize text-pink-500">
            Letter meanings
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">E</span>
              <span>Extraversion</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">I</span>
              <span>Introversion</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">S</span>
              <span>Sensing</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">N</span>
              <span>Intuition</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">T</span>
              <span>Thinking</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">F</span>
              <span>Feeling</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">J</span>
              <span>Judging</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-pink-500">P</span>
              <span>Perceiving</span>
            </div>
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
        {result && result.type !== "XXXX" && TYPE_EXPLANATIONS[result.type] && (
          <section className="mt-6 space-y-3 text-xs text-zinc-600 sm:text-sm">
            <p className="font-semibold capitalize text-pink-500">
              {TYPE_EXPLANATIONS[result.type].groupTitle}
            </p>
            <p>{TYPE_EXPLANATIONS[result.type].groupDescription}</p>
            <div className="mt-3 space-y-1 rounded-xl bg-fuchsia-50/60 px-4 py-3">
              <p className="text-sm font-semibold text-zinc-900 sm:text-base">
                {mbtiType} — {TYPE_EXPLANATIONS[result.type].typeTitle}
              </p>
              <p>{TYPE_EXPLANATIONS[result.type].typeDescription}</p>
            </div>
            <div className="flex justify-center items-center">
              <Image
                src={`/personalities/${result.type.toLowerCase()}.png`}
                alt={result.type}
                width={400}
                height={400}
              />
            </div>
          </section>
        )}
        {dimensionNarratives.length > 0 && (
          <section className="mt-5 space-y-3 text-xs text-zinc-600 sm:text-sm">
            <p className="font-semibold capitalize text-pink-500">
              How your preferences play out in daily life
            </p>
            <ul className="mt-2 space-y-3">
              {dimensionNarratives.map((dim) => (
                <li
                  key={dim.key}
                  className="rounded-xl bg-zinc-50 px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
                >
                  <p className="text-xs font-semibold text-zinc-900 sm:text-sm">
                    {dim.title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                    {dim.summary}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="mt-4 flex items-center justify-center space-x-4">
          <div className="">
            <Link
              href="/test"
              className="inline-flex items-center justify-center rounded-full border border-pink-100 px-5 py-2 text-xs font-semibold text-fuchsia-600 transition hover:border-pink-300 hover:bg-fuchsia-50 sm:text-sm"
            >
              Retake test
            </Link>
          </div>
          <Button className="bg-linear-to-r from-fuchsia-500 to-pink-500 text-white">
            <Link href="/">Return to Home</Link>
          </Button>
        </section>

        <footer className="mt-8 border-t border-zinc-100 pt-4 text-center text-[10px] text-zinc-400 sm:mt-10">
          <p>
            ©2025 MBTI Senpai · made with
            <span className="text-pink-500"> ♥ </span>
            by
            <span className="font-medium"> Khaing Myel Khant</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
