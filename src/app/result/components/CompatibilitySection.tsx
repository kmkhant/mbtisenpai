"use client";

import { Heart, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COMPATIBILITY_DATA } from "../data/compatibility-data";

interface CompatibilitySectionProps {
  type: string;
}

export function CompatibilitySection({ type }: CompatibilitySectionProps) {
  const compatibility = COMPATIBILITY_DATA[type];
  if (!compatibility) return null;

  return (
    <section className="mt-8 space-y-4 text-xs text-muted-foreground sm:text-sm">
      <p className="font-semibold capitalize text-pink-500">
        Compatibility & Communication
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-green-50/60 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-green-800">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              Energy Matches
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-green-700">
              Types that share similar energy and communication styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {compatibility.energyMatches.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 sm:text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-green-700 sm:text-sm">
              These types tend to understand your energy levels and
              communication preferences, making interactions feel more natural
              and energizing.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/60 border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-amber-800">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Difficult Communication
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-amber-700">
              Types that may require more effort to communicate with
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {compatibility.difficultCommunication.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 sm:text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-amber-700 sm:text-sm">
              These types have different communication styles and energy needs.
              With patience and understanding, meaningful connections are still
              possible.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
