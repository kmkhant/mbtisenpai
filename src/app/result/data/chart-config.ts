import type { ChartConfig } from "@/components/ui/chart";
import type { MbtiLetter } from "../types";

export const fallbackChartData = [
  { dimension: "E", score: 50, rawScore: 0 },
  { dimension: "I", score: 50, rawScore: 0 },
  { dimension: "S", score: 50, rawScore: 0 },
  { dimension: "N", score: 50, rawScore: 0 },
  { dimension: "T", score: 50, rawScore: 0 },
  { dimension: "F", score: 50, rawScore: 0 },
  { dimension: "J", score: 50, rawScore: 0 },
  { dimension: "P", score: 50, rawScore: 0 },
] as Array<{ dimension: MbtiLetter; score: number; rawScore: number }>;

export const chartConfig = {
  score: {
    label: "Preference strength",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
