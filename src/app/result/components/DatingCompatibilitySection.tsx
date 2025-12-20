"use client";

import { Heart, Users, Lightbulb } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DATING_COMPATIBILITY } from "../data/dating-compatibility";

interface DatingCompatibilitySectionProps {
  type: string;
}

export function DatingCompatibilitySection({
  type,
}: DatingCompatibilitySectionProps) {
  const compatibility = DATING_COMPATIBILITY[type];
  if (!compatibility) return null;

  return (
    <section className="mt-8 space-y-4 text-xs text-muted-foreground sm:text-sm">
      <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
        <Heart className="h-5 w-5" />
        MBTI Test for Dating Compatibility
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-green-50/60 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-green-800">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              Best Matches
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-green-700">
              Types with highest compatibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {compatibility.bestMatches.map((matchType) => (
                <span
                  key={matchType}
                  className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 sm:text-sm"
                >
                  {matchType}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/60 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-blue-800">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Good Matches
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-blue-700">
              Types with good compatibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {compatibility.goodMatches.map((matchType) => (
                <span
                  key={matchType}
                  className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 sm:text-sm"
                >
                  {matchType}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/60 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-amber-800">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Challenging Matches
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-amber-700">
              Types that may require more effort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {compatibility.challengingMatches.map((matchType) => (
                <span
                  key={matchType}
                  className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 sm:text-sm"
                >
                  {matchType}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-pink-50/60 border-pink-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-pink-800">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            Your Dating Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-pink-700">
            {compatibility.datingStyle}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-purple-50/60 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-purple-800">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
            What to Look For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-purple-700">
            {compatibility.whatToLookFor}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-teal-50/60 border-teal-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base text-teal-800">
            Relationship Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5">
            {compatibility.relationshipTips.map((tip, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-teal-700">
                • {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
