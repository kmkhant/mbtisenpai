import { NextRequest, NextResponse } from "next/server";

import questionsByDichotomy from "@/mbti/mbti-questions-by-dichotomy.json";

type DichotomyKey = "EI" | "SN" | "TF" | "JP";
type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

type RawQuestion = (typeof questionsByDichotomy)[DichotomyKey][number];

type QuestionMeta = {
  id: number;
  dichotomy: DichotomyKey;
  weights: Record<MbtiLetter, number>;
};

const QUESTION_INDEX: Map<number, QuestionMeta> = new Map();

for (const [dichotomyKey, list] of Object.entries(
  questionsByDichotomy as Record<DichotomyKey, RawQuestion[]>
)) {
  for (const q of list) {
    if (!QUESTION_INDEX.has(q.id)) {
      QUESTION_INDEX.set(q.id, {
        id: q.id,
        dichotomy: dichotomyKey as DichotomyKey,
        weights: q.weights || {
          E: 0,
          I: 0,
          S: 0,
          N: 0,
          T: 0,
          F: 0,
          J: 0,
          P: 0,
        },
      });
    }
  }
}

type AnswerPayload = {
  questionId: number;
  /**
   * Likert-style strength:
   * -2 strongly left, -1 slightly left, 0 neutral,
   *  1 slightly right, 2 strongly right
   */
  value: -2 | -1 | 0 | 1 | 2;
};

type Scores = Record<MbtiLetter, number>;

function emptyScores(): Scores {
  return {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };
}

/**
 * Computes MBTI type from scores.
 *
 * Tie-breaking behavior: When scores are equal, defaults to:
 * - E over I
 * - S over N
 * - T over F
 * - J over P
 *
 * This is intentional and matches standard MBTI assessment behavior.
 */
function computeType(scores: Scores): string {
  const ei = scores.E >= scores.I ? "E" : "I";
  const sn = scores.S >= scores.N ? "S" : "N";
  const tf = scores.T >= scores.F ? "T" : "F";
  const jp = scores.J >= scores.P ? "J" : "P";
  return `${ei}${sn}${tf}${jp}`;
}

const EXPECTED_QUESTIONS_COUNT_FAST = 44; // 11 questions per dichotomy × 4 dichotomies
const EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE = 88; // 22 questions per dichotomy × 4 dichotomies

/**
 * Enable debug logging for troubleshooting.
 * Set to true in development or when debugging scoring issues.
 */
const DEBUG_LOGGING = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { answers?: AnswerPayload[] } | null;

    if (!body?.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Request body must include an 'answers' array." },
        { status: 400 }
      );
    }

    const answers = body.answers;
    const validAnswers: AnswerPayload[] = [];
    let skippedCount = 0;
    let neutralCount = 0;
    const processedQuestionIds = new Set<number>();

    // Validate answer completeness and collect valid answers
    for (const answer of answers) {
      if (
        !answer ||
        typeof answer.questionId !== "number" ||
        typeof answer.value !== "number" ||
        ![-2, -1, 0, 1, 2].includes(answer.value)
      ) {
        skippedCount++;
        if (DEBUG_LOGGING) {
          console.warn("[SCORE] Skipping invalid answer:", answer);
        }
        continue;
      }

      if (processedQuestionIds.has(answer.questionId)) {
        skippedCount++;
        if (DEBUG_LOGGING) {
          console.warn(
            `[SCORE] Duplicate question ID ${answer.questionId}, keeping first occurrence`
          );
        }
        continue;
      }

      const meta = QUESTION_INDEX.get(answer.questionId);
      if (!meta) {
        skippedCount++;
        if (DEBUG_LOGGING) {
          console.warn(`[SCORE] Unknown question ID: ${answer.questionId}`);
        }
        continue;
      }

      processedQuestionIds.add(answer.questionId);

      if (answer.value === 0) {
        neutralCount++;
      }

      validAnswers.push(answer);
    }

    // Determine expected count based on answer count
    // If we have more than 44 answers, assume comprehensive mode (88 questions)
    // Otherwise, assume fast mode (44 questions)
    const isComprehensive = validAnswers.length > EXPECTED_QUESTIONS_COUNT_FAST;
    const EXPECTED_QUESTIONS_COUNT = isComprehensive
      ? EXPECTED_QUESTIONS_COUNT_COMPREHENSIVE
      : EXPECTED_QUESTIONS_COUNT_FAST;

    // Validate answer completeness
    if (validAnswers.length < EXPECTED_QUESTIONS_COUNT) {
      const missingCount = EXPECTED_QUESTIONS_COUNT - validAnswers.length;
      if (DEBUG_LOGGING) {
        console.warn(
          `[SCORE] Incomplete quiz: ${validAnswers.length}/${EXPECTED_QUESTIONS_COUNT} questions answered (${missingCount} missing)`
        );
      }
      // Still proceed with scoring, but note this in response
    }

    if (DEBUG_LOGGING) {
      console.log(
        `[SCORE] Processing ${validAnswers.length} valid answers (${neutralCount} neutral, ${skippedCount} skipped)`
      );
    }

    // Edge case: All answers are neutral or no valid answers
    if (validAnswers.length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid answers provided. Please answer at least some questions.",
        },
        { status: 400 }
      );
    }

    if (validAnswers.every((a) => a.value === 0)) {
      // All neutral answers - return balanced result
      const balancedPercentages: Scores = {
        E: 50,
        I: 50,
        S: 50,
        N: 50,
        T: 50,
        F: 50,
        J: 50,
        P: 50,
      };
      return NextResponse.json(
        {
          type: "XXXX", // Invalid type - all neutral
          scores: emptyScores(),
          percentages: balancedPercentages,
          warning:
            "All answers were neutral. Please provide more definitive answers.",
        },
        { status: 200 }
      );
    }

    // Score valid answers
    // Weight interpretation: Weights in question data represent association with the "right" option.
    // - Positive answer (right, +1 or +2) → adds to weighted traits
    // - Negative answer (left, -1 or -2) → adds to opposite traits (inverted weights)
    // - Neutral answer (0) → no contribution (already filtered above)
    //
    // Example: Question "angry / resentful" with weights {I: 0.21, N: 0.02, J: 0.04}
    // - Choosing "resentful" (right, +2) → I += 0.42, N += 0.04, J += 0.08
    // - Choosing "angry" (left, -2) → E += 0.42, S += 0.04, P += 0.08 (opposite traits)
    //
    // Dichotomy pairs for inverting weights:
    const dichotomyPairs: Record<MbtiLetter, MbtiLetter> = {
      E: "I",
      I: "E",
      S: "N",
      N: "S",
      T: "F",
      F: "T",
      J: "P",
      P: "J",
    };

    const scores = emptyScores();

    for (const answer of validAnswers) {
      const meta = QUESTION_INDEX.get(answer.questionId);
      if (!meta) continue; // Should not happen after validation, but safety check

      const answerValue = answer.value;
      if (answerValue === 0) {
        // Neutral – does not contribute to either side (already counted above)
        continue;
      }

      // Get absolute value for strength (0, 1, or 2)
      const strength = Math.abs(answerValue);
      const isRight = answerValue > 0;

      // Apply all non-zero weights from the question
      // Each weight represents how much that trait is associated with the right option
      for (const [letter, weight] of Object.entries(meta.weights) as [
        MbtiLetter,
        number
      ][]) {
        if (weight !== 0) {
          if (isRight) {
            // Right choice: add to weighted traits
            scores[letter] += strength * weight;
          } else {
            // Left choice: add to opposite traits
            const oppositeLetter = dichotomyPairs[letter];
            scores[oppositeLetter] += strength * weight;
          }
        }
      }
    }

    // Edge case: Check if all scores are zero (shouldn't happen after validation, but safety check)
    const allScoresZero = Object.values(scores).every((s) => s === 0);
    if (allScoresZero) {
      if (DEBUG_LOGGING) {
        console.warn("[SCORE] All scores are zero after processing");
      }
    }

    // Calculate percentages for each dichotomy pair
    // Percentages are normalized to a 0-100 scale for display purposes.
    // The actual type determination uses raw scores (see computeType function).
    //
    // Since scores are now always positive (left choices add to opposite traits),
    // normalization is simpler but we keep the same logic for consistency:
    // 1. Find minimum score in the pair
    // 2. Subtract minimum from both scores (normalizes to relative difference)
    // 3. Calculate percentage based on normalized scores
    // 4. Ensure percentages sum to exactly 100
    //
    // Example: E = 100, I = 50
    // - minScore = 50
    // - normalizedE = 50, normalizedI = 0
    // - total = 50
    // - E% = 100%, I% = 0% (correctly shows E is higher)
    const percentages: Scores = { ...scores };

    const pairs: [MbtiLetter, MbtiLetter][] = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];

    for (const [a, b] of pairs) {
      // Normalize scores to non-negative range for percentage calculation
      const minScore = Math.min(scores[a], scores[b]);
      const normalizedA = scores[a] - minScore;
      const normalizedB = scores[b] - minScore;
      const total = normalizedA + normalizedB;

      if (total === 0) {
        // Edge case: Equal scores or both zero - default to 50/50
        // This can happen if:
        // - Both scores are exactly equal
        // - Both scores are zero (all answers for this dichotomy were neutral)
        percentages[a] = 50;
        percentages[b] = 50;
      } else {
        // Calculate percentage and ensure it sums to 100
        // Using Math.round for the first value, then 100 - first for the second
        // ensures they always sum to exactly 100 (no rounding errors)
        percentages[a] = Math.round((normalizedA / total) * 100);
        percentages[b] = 100 - percentages[a];
      }
    }

    if (DEBUG_LOGGING) {
      console.log("[SCORE] Final scores:", scores);
      console.log("[SCORE] Percentages:", percentages);
    }

    const type = computeType(scores);

    if (DEBUG_LOGGING) {
      console.log(`[SCORE] Computed type: ${type}`);
    }

    const response: {
      type: string;
      scores: Scores;
      percentages: Scores;
      warning?: string;
    } = {
      type,
      scores,
      percentages,
    };

    // Add warning if quiz was incomplete
    if (validAnswers.length < EXPECTED_QUESTIONS_COUNT) {
      response.warning = `Only ${validAnswers.length} out of ${EXPECTED_QUESTIONS_COUNT} questions were answered. Results may be less accurate.`;
    }

    // Save result to Redis and get nanoid (asynchronously, don't block response)
    let resultId: string | null = null;
    try {
      const { saveResultToRedis } = await import("../../result-storage/redis");
      resultId = await saveResultToRedis(response);
      if (resultId && DEBUG_LOGGING) {
        console.log(`[SCORE] Result saved to Redis with ID: ${resultId}`);
      }
    } catch (err) {
      // Silently fail - don't block the response if Redis save fails
      if (DEBUG_LOGGING) {
        console.warn("[SCORE] Failed to save result to Redis:", err);
      }
    }

    // Increment test count asynchronously (don't block response)
    // Only count if we have valid results (not all neutral or invalid)
    if (type !== "XXXX" && validAnswers.length > 0) {
      // Import and call increment function directly (more efficient than API call)
      import("../../stats/utils")
        .then(({ incrementCount }) => incrementCount())
        .catch((err) => {
          // Silently fail - don't block the response if stats update fails
          if (DEBUG_LOGGING) {
            console.warn("[SCORE] Failed to increment test count:", err);
          }
        });
    }

    // Return response with result ID if available
    return NextResponse.json(
      { ...response, id: resultId || undefined },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/mbti/score] failed", error);
    return NextResponse.json(
      { error: "Failed to score MBTI answers." },
      { status: 500 }
    );
  }
}
