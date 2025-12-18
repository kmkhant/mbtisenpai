export type MbtiLetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MbtiResult = {
  type: string;
  scores: Record<MbtiLetter, number>;
  percentages: Record<MbtiLetter, number>;
  warning?: string;
};

export type TypeExplanation = {
  groupTitle: string;
  groupDescription: string;
  typeTitle: string;
  typeDescription: string;
};

export type CompatibilityInfo = {
  energyMatches: string[];
  difficultCommunication: string[];
};

export type TypeDeepAnalysis = {
  strengths: string[];
  weaknesses: string[];
  growthAreas: string[];
  workStyle: string;
  relationshipStyle: string;
  stressTriggers: string[];
  communicationTips: string[];
};

export type RawScoreAnalysis = {
  title: string;
  pair: [MbtiLetter, MbtiLetter];
  dominant: MbtiLetter;
  dominantLabel: string;
  aScore: number;
  bScore: number;
  aNormalized: number;
  bNormalized: number;
  difference: number;
  normalizedDiff: number;
  strength: "very-strong" | "strong" | "moderate" | "slight" | "balanced";
  strengthLabel: string;
  strengthDescription: string;
  comparisonDescription: string;
};
