"use client";

import { Sparkles, Film } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ANIME_CHARACTER_DATA } from "../data/anime-characters";

interface AnimeCharacterSectionProps {
  type: string;
}

export function AnimeCharacterSection({ type }: AnimeCharacterSectionProps) {
  const characterData = ANIME_CHARACTER_DATA[type];
  if (!characterData) return null;

  return (
    <section className="mt-8 space-y-4 text-xs text-muted-foreground sm:text-sm">
      <p className="font-semibold capitalize text-pink-500 flex items-center gap-2">
        <Film className="h-5 w-5" />
        Which Anime Character Am I MBTI
      </p>

      <Card className="bg-gradient-to-br from-pink-50/60 to-purple-50/60 border-pink-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-pink-800">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            Anime Characters That Match Your MBTI Type
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-pink-700">
            Discover which anime characters share your personality traits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {characterData.characters.map((character, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-white/60 p-4 border border-pink-100"
            >
              <div className="flex items-start gap-3">
                <div className="flex-none size-10 rounded-full bg-linear-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                  {character.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    {character.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {character.anime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {character.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-blue-50/60 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base text-blue-800">
            Common Traits You Share
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {characterData.commonTraits.map((trait) => (
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

      <Card className="bg-purple-50/60 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base text-purple-800">
            Why This Match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-purple-700">
            {characterData.whyThisMatch}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
