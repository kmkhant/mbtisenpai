"use client";

import { Star, Music, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CELEBRITY_DATA } from "../data/celebrities";

interface CelebritySectionProps {
  type: string;
}

export function CelebritySection({ type }: CelebritySectionProps) {
  const celebrityData = CELEBRITY_DATA[type];
  if (!celebrityData) return null;

  return (
    <section className="mt-8 space-y-4 text-xs text-muted-foreground sm:text-sm">
      <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
        <Star className="h-5 w-5" />
        Celebrities That Match Your MBTI Type
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-amber-800">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              Movie Stars & Actors
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-amber-700">
              Celebrities in film and television who share your personality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {celebrityData.movieStars.map((star, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white/60 p-3 border border-amber-100"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  {star.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {star.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50/60 to-pink-50/60 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-purple-800">
              <Music className="h-4 w-4 sm:h-5 sm:w-5" />
              Singers & Musicians
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-purple-700">
              Artists in music who share your personality traits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {celebrityData.singers.map((singer, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white/60 p-3 border border-purple-100"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  {singer.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {singer.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50/60 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base text-blue-800">
            Common Traits You Share
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {celebrityData.commonTraits.map((trait) => (
              <span
                key={trait}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 sm:text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-indigo-50/60 border-indigo-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-indigo-800">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            Why This Match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-indigo-700">
            {celebrityData.whyThisMatch}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
