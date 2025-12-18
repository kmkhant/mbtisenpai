"use client";

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
} from "@/components/ui/chart";
import { chartConfig } from "../data/chart-config";
import type { MbtiLetter } from "../types";

interface ChartDataPoint {
  dimension: MbtiLetter;
  score: number;
  rawScore: number;
}

interface RadarChartSectionProps {
  chartData: ChartDataPoint[];
  strongestPreferenceLabel: string;
  strongestPreferenceDescription: string | null;
}

export function RadarChartSection({
  chartData,
  strongestPreferenceLabel,
  strongestPreferenceDescription,
}: RadarChartSectionProps) {
  return (
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
          {strongestPreferenceDescription && (
            <div className="text-xs sm:text-sm">
              {strongestPreferenceDescription}
            </div>
          )}

          <div className="h-4 border-t border-zinc-200 w-full mt-4" />

          <p className="text-xs sm:text-sm text-zinc-500">
            Chart shows normalized raw scores. Hover over points to see actual
            score values. Scores are calculated from weighted question responses
            across the entire test.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
