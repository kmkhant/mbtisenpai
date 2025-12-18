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

/**
 * Seeded shuffle function for deterministic randomization.
 * Uses a seed value to ensure consistent results for the same seed.
 * This enables balanced question coverage over time.
 */
function seededShuffle<T>(items: T[], seed: number): T[] {
  const array = [...items];
  // Simple seeded random number generator
  let currentSeed = seed;
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seededRandom() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Gets a rotation seed based on the current minute.
 * This ensures:
 * - Same questions shown within the same minute (cached for 1 minute)
 * - Different questions shown in different minutes (variety on each request)
 * - All questions eventually get shown (balanced coverage over time)
 */
function getRotationSeed(): number {
  // Use minute-based timestamp as seed
  // This rotates questions every minute while maintaining consistency within that minute
  const now = new Date();
  // Get timestamp in minutes since epoch
  return Math.floor(now.getTime() / (1000 * 60));
}

const QUESTIONS_PER_DICHOTOMY = 11;

export async function GET() {
  try {
    // Get rotation seed for balanced coverage
    const rotationSeed = getRotationSeed();
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

        // Use seeded shuffle with a unique seed per dichotomy
        // This ensures balanced coverage: same questions on same day,
        // but different questions rotate over time
        const dichotomySeed =
          rotationSeed +
          dichotomyKey.charCodeAt(0) * 1000 +
          dichotomyKey.charCodeAt(1) * 100;
        const selected = seededShuffle(raw, dichotomySeed)
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

    // Shuffle all questions together using a final seed
    // This maintains randomness in question order while ensuring balanced selection
    const finalSeed = rotationSeed * 1000;
    const shuffled = seededShuffle(allQuestions, finalSeed);

    return NextResponse.json(
      {
        count: shuffled.length,
        questions: shuffled,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/mbti/questions] failed", error);
    return NextResponse.json(
      { error: "Failed to generate MBTI questions." },
      { status: 500 }
    );
  }
}
