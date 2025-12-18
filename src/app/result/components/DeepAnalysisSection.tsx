"use client";

import {
  Target,
  Lightbulb,
  AlertTriangle,
  Briefcase,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TYPE_DEEP_ANALYSIS } from "../data/type-deep-analysis";

interface DeepAnalysisSectionProps {
  type: string;
}

export function DeepAnalysisSection({ type }: DeepAnalysisSectionProps) {
  const analysis = TYPE_DEEP_ANALYSIS[type];
  if (!analysis) return null;

  return (
    <section className="mt-8 space-y-4 text-xs text-zinc-600 sm:text-sm">
      <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
        <Target className="h-5 w-5" />
        Deep Analysis: {type}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-emerald-50/60 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-emerald-800">
              <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
              Strengths
            </CardTitle>
            <div className="border-t border-emerald-200 w-full" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {analysis.strengths.map((strength, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-emerald-700"
                >
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-rose-50/60 border-rose-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-rose-800">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              Growth Areas
            </CardTitle>
            <div className="border-t border-rose-200 w-full" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.growthAreas.map((area, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-rose-700"
                >
                  <span className="text-rose-500 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50/60 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-blue-800">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
            Work Style
          </CardTitle>
          <div className="border-t border-blue-200 w-full" />
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-blue-700">
            {analysis.workStyle}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-purple-50/60 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-purple-800">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            Relationship Style
          </CardTitle>
          <div className="border-t border-purple-200 w-full" />
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-purple-700">
            {analysis.relationshipStyle}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-amber-50/60 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base text-amber-800">
              Stress Triggers
            </CardTitle>
            <div className="border-t border-amber-200 w-full" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {analysis.stressTriggers.map((trigger, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-amber-700">
                  • {trigger}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-teal-50/60 border-teal-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base text-teal-800">
              Communication Tips
            </CardTitle>
            <div className="border-t border-teal-200 w-full" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {analysis.communicationTips.map((tip, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-teal-700">
                  • {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
