"use client";

import { useMemo } from "react";
import type { MbtiResult, MbtiLetter, RawScoreAnalysis } from "../types";
import { fallbackChartData } from "../data/chart-config";

interface ChartDataPoint {
  dimension: MbtiLetter;
  score: number;
  rawScore: number;
}

export function useNormalizedScores(result: MbtiResult | null) {
  return useMemo(() => {
    if (!result?.scores) return null;

    const scores = result.scores;
    const allValues = Object.values(scores);
    const maxScore = Math.max(...allValues);

    // If max is 0 or all scores are 0, return 50 for all (neutral)
    if (maxScore === 0) {
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

    // Normalize to 0-100 range based on max
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
      normalized[letter] = Math.round((scores[letter] / maxScore) * 100);
    }

    return normalized;
  }, [result]);
}

export function useChartData(
  result: MbtiResult | null,
  normalizedScores: Record<MbtiLetter, number> | null
): ChartDataPoint[] {
  return useMemo(() => {
    if (!result || !normalizedScores) return fallbackChartData;

    return [
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
    ];
  }, [result, normalizedScores]);
}

export function useStrongestPreference(result: MbtiResult | null) {
  return useMemo(() => {
    if (!result || !result.scores)
      return {
        label: "Complete the test to see your strongest preference.",
        letter: null,
        description: null,
      };

    const entries = Object.entries(result.scores) as [MbtiLetter, number][];
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

    const descriptionMap: Record<MbtiLetter, string> = {
      E: "You tend to recharge through social interaction and external stimulation, feeling energized by being around others and engaging with the world around you.",
      I: "You tend to recharge through solitude and introspection, feeling energized by quiet time alone to reflect and process your thoughts.",
      S: "You focus on concrete facts, present realities, and practical details, preferring information that is tangible and observable.",
      N: "You focus on patterns, possibilities, and abstract concepts, preferring to see the big picture and explore what could be.",
      T: "You make decisions based on logic, objectivity, and consistency, prioritizing fairness and rational analysis over personal values.",
      F: "You make decisions based on values, empathy, and personal impact, prioritizing harmony and the effect on people over pure logic.",
      J: "You prefer structure, planning, and closure, feeling more comfortable when decisions are made and things are organized.",
      P: "You prefer flexibility, spontaneity, and keeping options open, feeling more comfortable adapting to situations as they unfold.",
    };

    return {
      label: `Your strongest preference is toward ${labelMap[topLetter]}.`,
      letter: topLetter,
      description: descriptionMap[topLetter],
    };
  }, [result]);
}

interface DimensionNarrative {
  key: string;
  title: string;
  summary: string;
}

export function useDimensionNarratives(
  percentages: Record<MbtiLetter, number> | null
) {
  return useMemo(() => {
    if (!percentages) return [];

    const describeAxis = (
      a: MbtiLetter,
      b: MbtiLetter,
      title: string
    ): DimensionNarrative => {
      const aScore = percentages[a];
      const bScore = percentages[b];
      const dominant = aScore >= bScore ? a : b;

      if (a === "E" && b === "I") {
        if (dominant === "E") {
          return {
            key: "EI",
            title,
            summary: `You lean about toward Extraversion. You're more likely to recharge through interaction, shared experiences and outer stimulation, but still have an Introverted side that sometimes needs quiet time to reset.`,
          };
        }
        return {
          key: "EI",
          title,
          summary: `You lean about toward Introversion. You likely recharge through solitude, reflection and a small circle of close connections, while still being able to step into more social, outgoing modes when needed.`,
        };
      }

      if (a === "S" && b === "N") {
        if (dominant === "S") {
          return {
            key: "SN",
            title,
            summary: `You lean about toward Sensing. You tend to notice concrete facts, current realities and practical details first, adding intuition and imagination as a secondary layer when it's useful.`,
          };
        }
        return {
          key: "SN",
          title,
          summary: `You lean about toward Intuition. You're more drawn to patterns, possibilities and the "big picture," filling in details as needed rather than starting from them.`,
        };
      }

      if (a === "T" && b === "F") {
        if (dominant === "T") {
          return {
            key: "TF",
            title,
            summary: `You lean about toward Thinking. You're inclined to evaluate situations through logic, consistency and fairness of principles, even though feelings and harmony still matter to you in close relationships.`,
          };
        }
        return {
          key: "TF",
          title,
          summary: `You lean about toward Feeling. You're more likely to prioritize people, impact and values in decisions, while still appreciating clear reasoning when stakes are high.`,
        };
      }

      // J vs P
      if (dominant === "J") {
        return {
          key: "JP",
          title,
          summary: `You lean about toward Judging. You probably feel calmer when plans, timelines and expectations are defined, even if you still enjoy some flexibility and last‑minute inspiration.`,
        };
      }
      return {
        key: "JP",
        title,
        summary: `You lean about toward Perceiving. You tend to keep options open, adapt in the moment and follow emerging opportunities, even if you can use structure when it serves your goals.`,
      };
    };

    return [
      describeAxis("E", "I", "How you recharge and show up socially"),
      describeAxis("S", "N", "How you take in and interpret information"),
      describeAxis("T", "F", "How you evaluate and make decisions"),
      describeAxis("J", "P", "How you like to organize your outer world"),
    ];
  }, [percentages]);
}

export function useRawScoreAnalysis(
  result: MbtiResult | null,
  normalizedScores: Record<MbtiLetter, number> | null
): RawScoreAnalysis[] | null {
  return useMemo(() => {
    if (!result?.scores || !normalizedScores) return null;

    const allScores = Object.values(result.scores);
    const maxScore = Math.max(...allScores);

    const pairs: [MbtiLetter, MbtiLetter, string][] = [
      ["E", "I", "Energy & Social Orientation"],
      ["S", "N", "Information Processing"],
      ["T", "F", "Decision Making"],
      ["J", "P", "Lifestyle & Organization"],
    ];

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

    return pairs.map(([a, b, title]) => {
      const aScore = result.scores[a];
      const bScore = result.scores[b];
      const aNormalized =
        maxScore > 0 ? Math.round((aScore / maxScore) * 100) : 50;
      const bNormalized =
        maxScore > 0 ? Math.round((bScore / maxScore) * 100) : 50;
      const difference = Math.abs(aScore - bScore);
      const dominant = aScore >= bScore ? a : b;
      const normalizedDiff = Math.abs(aNormalized - bNormalized);

      // Determine strength of preference
      let strength:
        | "very-strong"
        | "strong"
        | "moderate"
        | "slight"
        | "balanced";
      let strengthLabel: string;
      let strengthDescription: string;

      if (normalizedDiff >= 80) {
        strength = "very-strong";
        strengthLabel = "Very Strong";
        strengthDescription =
          "This is a very clear and consistent preference. You show strong alignment with this trait across most situations.";
      } else if (normalizedDiff >= 60) {
        strength = "strong";
        strengthLabel = "Strong";
        strengthDescription =
          "You have a strong preference for this trait, though you can access the opposite when needed.";
      } else if (normalizedDiff >= 40) {
        strength = "moderate";
        strengthLabel = "Moderate";
        strengthDescription =
          "You have a moderate preference, showing flexibility while still leaning toward this trait.";
      } else if (normalizedDiff >= 20) {
        strength = "slight";
        strengthLabel = "Slight";
        strengthDescription =
          "You have a slight preference, showing significant flexibility and ability to use both sides.";
      } else {
        strength = "balanced";
        strengthLabel = "Balanced";
        strengthDescription =
          "You show a balanced approach, using both traits flexibly depending on the situation.";
      }

      const aLabel = labelMap[a];
      const bLabel = labelMap[b];
      const dominantLabel = labelMap[dominant];
      const nonDominant = dominant === a ? b : a;
      const nonDominantLabel = labelMap[nonDominant];

      const dominantNormalized = dominant === a ? aNormalized : bNormalized;
      const nonDominantNormalized = dominant === a ? bNormalized : aNormalized;

      let comparisonDescription: string;

      if (normalizedDiff >= 80) {
        comparisonDescription = `You show a very strong preference for ${dominantLabel} (${dominantNormalized}%) over ${nonDominantLabel} (${nonDominantNormalized}%). This is a clear and consistent pattern in your responses.`;
      } else if (normalizedDiff >= 60) {
        comparisonDescription = `You have a strong preference for ${dominantLabel} (${dominantNormalized}%) compared to ${nonDominantLabel} (${nonDominantNormalized}%). While you lean strongly in this direction, you can still access the opposite trait when needed.`;
      } else if (normalizedDiff >= 40) {
        comparisonDescription = `You show a moderate preference for ${dominantLabel} (${dominantNormalized}%) over ${nonDominantLabel} (${nonDominantNormalized}%). You have flexibility while still having a clear leaning.`;
      } else if (normalizedDiff >= 20) {
        comparisonDescription = `You have a slight preference for ${dominantLabel} (${dominantNormalized}%) compared to ${nonDominantLabel} (${nonDominantNormalized}%). The difference is noticeable but you show significant flexibility in using both traits.`;
      } else {
        comparisonDescription = `Your scores for ${aLabel} (${aNormalized}%) and ${bLabel} (${bNormalized}%) are very close, showing a balanced approach. You use both traits flexibly depending on the situation.`;
      }

      return {
        title,
        pair: [a, b] as [MbtiLetter, MbtiLetter],
        dominant,
        dominantLabel: labelMap[dominant],
        aScore,
        bScore,
        aNormalized,
        bNormalized,
        difference,
        normalizedDiff,
        strength,
        strengthLabel,
        strengthDescription,
        comparisonDescription,
      };
    });
  }, [result, normalizedScores]);
}
