import { NextResponse } from "next/server";

import questionsByDichotomy from "@/mbti/mbti-questions-by-dichotomy.json";

type DichotomyKey = "EI" | "SN" | "TF" | "JP";

const DICHOTOMY_LETTERS: Record<DichotomyKey, [string, string]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

type RawQuestion = (typeof questionsByDichotomy)[DichotomyKey][number];

export type MbtiQuestion = {
  id: number;
  prompt: string;
  left: string;
  right: string;
  dichotomy: DichotomyKey;
  leftLetter: string;
  rightLetter: string;
};

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const QUESTIONS_PER_DICHOTOMY = 11;

export async function GET() {
  try {
    const allQuestions: MbtiQuestion[] = [];

    (Object.keys(DICHOTOMY_LETTERS) as DichotomyKey[]).forEach(
      (dichotomyKey) => {
        const raw = (
          questionsByDichotomy as Record<DichotomyKey, RawQuestion[]>
        )[dichotomyKey];

        if (!raw || raw.length < QUESTIONS_PER_DICHOTOMY) {
          throw new Error(
            `Not enough questions for dichotomy ${dichotomyKey}. Expected at least ${QUESTIONS_PER_DICHOTOMY}, found ${
              raw?.length ?? 0
            }.`
          );
        }

        const [leftLetter, rightLetter] = DICHOTOMY_LETTERS[dichotomyKey];

        const selected = shuffle(raw)
          .slice(0, QUESTIONS_PER_DICHOTOMY)
          .map<MbtiQuestion>((q) => ({
            id: q.id,
            prompt: q.prompt,
            left: q.left,
            right: q.right,
            dichotomy: dichotomyKey,
            leftLetter,
            rightLetter,
          }));

        allQuestions.push(...selected);
      }
    );

    const shuffled = shuffle(allQuestions);

    return NextResponse.json(
      {
        count: shuffled.length,
        questions: shuffled,
      },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[GET /api/mbti/questions] failed", error);
    return NextResponse.json(
      { error: "Failed to generate MBTI questions." },
      { status: 500 }
    );
  }
}
