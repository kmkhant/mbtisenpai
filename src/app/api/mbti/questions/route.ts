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
    const usedQuestionIds = new Set<number>();
    const dichotomyCounts: Record<DichotomyKey, number> = {
      EI: 0,
      SN: 0,
      TF: 0,
      JP: 0,
    };

    // Process each dichotomy to ensure fair representation
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
        const shuffled = seededShuffle(raw, dichotomySeed);

        // Categorize questions by their bias (leftLetter vs rightLetter)
        // A question is biased toward a letter if that letter's weight is higher
        const leftBiased: RawQuestion[] = [];
        const rightBiased: RawQuestion[] = [];
        const neutral: RawQuestion[] = [];

        for (const q of shuffled) {
          // Skip if already used in another dichotomy
          if (usedQuestionIds.has(q.id)) {
            continue;
          }

          const weights = q.weights || {};
          const leftWeight = weights[leftLetter as keyof typeof weights] || 0;
          const rightWeight = weights[rightLetter as keyof typeof weights] || 0;

          if (leftWeight > rightWeight) {
            leftBiased.push(q);
          } else if (rightWeight > leftWeight) {
            rightBiased.push(q);
          } else {
            // Equal weights or both zero - treat as neutral
            neutral.push(q);
          }
        }

        // Determine target split: 5-6 or 6-5 (use seed to make it deterministic)
        // Use dichotomy seed to determine which side gets 6
        const leftGetsSix = dichotomySeed % 2 === 0;
        const targetLeft = leftGetsSix ? 6 : 5;
        const targetRight = leftGetsSix ? 5 : 6;

        // Select questions maintaining fair balance
        const selected: MbtiQuestion[] = [];
        let leftCount = 0;
        let rightCount = 0;
        let neutralCount = 0;

        // First, try to fill from biased questions
        for (const q of leftBiased) {
          if (leftCount >= targetLeft) break;
          if (usedQuestionIds.has(q.id)) continue;

          selected.push({
            id: q.id,
            prompt: q.prompt,
            left: q.left,
            right: q.right,
            dichotomy: dichotomyKey,
            leftLetter,
            rightLetter,
          });
          usedQuestionIds.add(q.id);
          leftCount++;
        }

        for (const q of rightBiased) {
          if (rightCount >= targetRight) break;
          if (usedQuestionIds.has(q.id)) continue;

          selected.push({
            id: q.id,
            prompt: q.prompt,
            left: q.left,
            right: q.right,
            dichotomy: dichotomyKey,
            leftLetter,
            rightLetter,
          });
          usedQuestionIds.add(q.id);
          rightCount++;
        }

        // If we still need questions, fill from neutral or the other side
        const remaining = QUESTIONS_PER_DICHOTOMY - selected.length;
        if (remaining > 0) {
          // Fill from neutral first
          for (const q of neutral) {
            if (selected.length >= QUESTIONS_PER_DICHOTOMY) break;
            if (usedQuestionIds.has(q.id)) continue;

            selected.push({
              id: q.id,
              prompt: q.prompt,
              left: q.left,
              right: q.right,
              dichotomy: dichotomyKey,
              leftLetter,
              rightLetter,
            });
            usedQuestionIds.add(q.id);
            neutralCount++;
          }

          // If still need more, fill from whichever side has fewer
          const allRemaining = [
            ...leftBiased.filter((q) => !usedQuestionIds.has(q.id)),
            ...rightBiased.filter((q) => !usedQuestionIds.has(q.id)),
          ];

          for (const q of allRemaining) {
            if (selected.length >= QUESTIONS_PER_DICHOTOMY) break;
            if (usedQuestionIds.has(q.id)) continue;

            const weights = q.weights || {};
            const leftWeight = weights[leftLetter as keyof typeof weights] || 0;
            const rightWeight =
              weights[rightLetter as keyof typeof weights] || 0;

            // Only add if it helps balance or we're desperate
            if (
              selected.length < QUESTIONS_PER_DICHOTOMY - 2 ||
              (leftWeight > rightWeight && leftCount < targetLeft) ||
              (rightWeight > leftWeight && rightCount < targetRight)
            ) {
              selected.push({
                id: q.id,
                prompt: q.prompt,
                left: q.left,
                right: q.right,
                dichotomy: dichotomyKey,
                leftLetter,
                rightLetter,
              });
              usedQuestionIds.add(q.id);
              if (leftWeight > rightWeight) leftCount++;
              else if (rightWeight > leftWeight) rightCount++;
              else neutralCount++;
            }
          }
        }

        // Validate we got exactly the required number of unique questions
        if (selected.length < QUESTIONS_PER_DICHOTOMY) {
          throw new Error(
            `Not enough unique questions for dichotomy ${dichotomyKey}. Expected ${QUESTIONS_PER_DICHOTOMY}, found ${selected.length} after removing duplicates. Available questions: ${raw.length}, Already used IDs: ${usedQuestionIds.size}. Left-biased: ${leftBiased.length}, Right-biased: ${rightBiased.length}, Neutral: ${neutral.length}.`
          );
        }

        // Validate fair bias distribution (should be 5-6 or 6-5 split)
        const actualLeft = leftCount;
        const actualRight = rightCount;
        const isBalanced =
          (actualLeft === 5 && actualRight === 6) ||
          (actualLeft === 6 && actualRight === 5) ||
          (actualLeft + actualRight === QUESTIONS_PER_DICHOTOMY &&
            Math.abs(actualLeft - actualRight) <= 1);

        if (!isBalanced) {
          console.warn(
            `[Questions] Dichotomy ${dichotomyKey} bias may be unbalanced: ${actualLeft} ${leftLetter}-biased, ${actualRight} ${rightLetter}-biased, ${neutralCount} neutral. Target was ${targetLeft}-${targetRight}.`
          );
        }

        // Track count per dichotomy for validation
        dichotomyCounts[dichotomyKey] = selected.length;
        allQuestions.push(...selected);
      }
    );

    // Validate fair distribution: each dichotomy should have exactly QUESTIONS_PER_DICHOTOMY
    const expectedTotal =
      Object.keys(DICHOTOMY_LETTERS).length * QUESTIONS_PER_DICHOTOMY;
    const actualTotal = allQuestions.length;

    if (actualTotal !== expectedTotal) {
      throw new Error(
        `Question distribution imbalance. Expected ${expectedTotal} total questions (${QUESTIONS_PER_DICHOTOMY} per dichotomy), found ${actualTotal}. Distribution: ${JSON.stringify(
          dichotomyCounts
        )}`
      );
    }

    // Validate each dichotomy has exactly the required count
    for (const [key, count] of Object.entries(dichotomyCounts)) {
      if (count !== QUESTIONS_PER_DICHOTOMY) {
        throw new Error(
          `Dichotomy ${key} has incorrect count. Expected ${QUESTIONS_PER_DICHOTOMY}, found ${count}.`
        );
      }
    }

    // Final validation: ensure no duplicates in final array
    const finalQuestionIds = new Set(allQuestions.map((q) => q.id));
    if (finalQuestionIds.size !== allQuestions.length) {
      throw new Error(
        `Duplicate questions detected. Expected ${allQuestions.length} unique questions, found ${finalQuestionIds.size}.`
      );
    }

    // Shuffle all questions together using a final seed
    // This maintains randomness in question order while ensuring balanced selection
    // The shuffle doesn't affect the count per dichotomy, just the order
    const finalSeed = rotationSeed * 1000;
    const shuffled = seededShuffle(allQuestions, finalSeed);

    // Final validation: ensure shuffled array maintains the same count
    if (shuffled.length !== expectedTotal) {
      throw new Error(
        `Shuffle error. Expected ${expectedTotal} questions after shuffle, found ${shuffled.length}.`
      );
    }

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
