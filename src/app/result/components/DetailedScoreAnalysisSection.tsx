"use client";

import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedProgressBar } from "./AnimatedProgressBar";
import type { MbtiLetter, RawScoreAnalysis } from "../types";

interface DetailedScoreAnalysisSectionProps {
  rawScoreAnalysis: RawScoreAnalysis[];
}

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

const strengthColors = {
  "very-strong": "bg-red-100 text-red-800 border-red-200",
  strong: "bg-orange-100 text-orange-800 border-orange-200",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  slight: "bg-blue-100 text-blue-800 border-blue-200",
  balanced: "bg-gray-100 text-gray-800 border-gray-200",
};

export function DetailedScoreAnalysisSection({
  rawScoreAnalysis,
}: DetailedScoreAnalysisSectionProps) {
  return (
    <section className="mt-8 space-y-4 text-xs text-muted-foreground sm:text-sm">
      <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Detailed Score Analysis
      </p>
      <p className="text-xs text-muted-foreground sm:text-sm">
        A breakdown of your raw scores and preference strength for each
        dimension.
      </p>
      <div className="space-y-4">
        {rawScoreAnalysis.map((analysis, idx) => {
          const [a, b] = analysis.pair;

          return (
            <Card key={idx} className="bg-muted/60 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base text-foreground">
                  {analysis.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Result: {analysis.dominantLabel} (
                  {analysis.dominant === analysis.pair[0]
                    ? analysis.aNormalized
                    : analysis.bNormalized}
                  %)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <AnimatedProgressBar
                      label={labelMap[a]}
                      value={analysis.aNormalized}
                      rawScore={analysis.aScore}
                      isDominant={analysis.dominant === a}
                    />
                    <AnimatedProgressBar
                      label={labelMap[b]}
                      value={analysis.bNormalized}
                      rawScore={analysis.bScore}
                      isDominant={analysis.dominant === b}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        strengthColors[analysis.strength]
                      }`}
                    >
                      {analysis.strengthLabel} Preference
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Difference: {analysis.normalizedDiff}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground sm:text-sm mb-2">
                    {analysis.strengthDescription}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {analysis.comparisonDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
