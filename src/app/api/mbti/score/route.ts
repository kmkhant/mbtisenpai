import { NextRequest, NextResponse } from "next/server";

import questionsByDichotomy from "@/mbti/mbti-questions-by-dichotomy.json";

type DichotomyKey = "EI" | "SN" | "TF" | "JP";
type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

const DICHOTOMY_LETTERS: Record<DichotomyKey, [MbtiLetter, MbtiLetter]> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

type RawQuestion = (typeof questionsByDichotomy)[DichotomyKey][number];

type QuestionMeta = {
  id: number;
  dichotomy: DichotomyKey;
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

function computeType(scores: Scores): string {
  const ei = scores.E >= scores.I ? "E" : "I";
  const sn = scores.S >= scores.N ? "S" : "N";
  const tf = scores.T >= scores.F ? "T" : "F";
  const jp = scores.J >= scores.P ? "J" : "P";
  return `${ei}${sn}${tf}${jp}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { answers?: AnswerPayload[] } | null;

    if (!body?.answers || !Array.isArray(body.answers)) {
      return NextResponse.json(
        { error: "Request body must include an 'answers' array." },
        { status: 400 }
      );
    }

    const scores = emptyScores();

    for (const answer of body.answers) {
      if (
        !answer ||
        typeof answer.questionId !== "number" ||
        typeof answer.value !== "number" ||
        ![-2, -1, 0, 1, 2].includes(answer.value)
      ) {
        // Skip invalid entries rather than failing the whole request.
        continue;
      }

      const meta = QUESTION_INDEX.get(answer.questionId);
      if (!meta) {
        // Unknown question id – ignore.
        continue;
      }

      const [leftLetter, rightLetter] = DICHOTOMY_LETTERS[meta.dichotomy];

      const weight = answer.value;
      if (weight === 0) {
        // Neutral – does not contribute to either side.
        continue;
      }

      const traitToIncrement: MbtiLetter =
        weight < 0 ? leftLetter : rightLetter;

      scores[traitToIncrement] += Math.abs(weight);
    }

    const percentages: Scores = { ...scores };

    const pairs: [MbtiLetter, MbtiLetter][] = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];

    for (const [a, b] of pairs) {
      const total = scores[a] + scores[b];
      if (total === 0) {
        percentages[a] = 0;
        percentages[b] = 0;
      } else {
        percentages[a] = Math.round((scores[a] / total) * 100);
        percentages[b] = 100 - percentages[a];
      }
    }

    const type = computeType(scores);

    return NextResponse.json(
      {
        type,
        scores,
        percentages,
      },
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
