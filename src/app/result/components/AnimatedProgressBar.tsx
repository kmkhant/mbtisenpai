"use client";

import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/animate-ui/components/base/progress";
import {
  ProgressIndicator,
  ProgressTrack as ProgressTrackPrimitive,
} from "@/components/animate-ui/primitives/base/progress";
import { useIsInView } from "@/hooks/use-is-in-view";
import { cn } from "@/lib/utils";

interface AnimatedProgressBarProps {
  label: string;
  value: number;
  rawScore: number;
  isDominant: boolean;
}

export function AnimatedProgressBar({
  label,
  value,
  rawScore,
  isDominant,
}: AnimatedProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isInView } = useIsInView<HTMLDivElement>(containerRef, {
    inViewOnce: true,
    inViewMargin: "-100px",
  });
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (isInView && progressValue === 0) {
      // Small delay to ensure component is mounted and visible before animating
      const timer = setTimeout(() => {
        setProgressValue(value);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, progressValue]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-zinc-700">{label}</span>
        <span
          className={`text-xs font-mono font-semibold ${
            rawScore < 0
              ? "text-amber-600"
              : rawScore > 0
              ? "text-green-600"
              : "text-zinc-600"
          }`}
        >
          {rawScore > 0 ? "+" : ""}
          {rawScore.toFixed(2)}
        </span>
      </div>
      <Progress value={progressValue} className="w-full">
        <ProgressTrackPrimitive
          className={cn(
            "bg-zinc-200 relative h-2 w-full overflow-hidden rounded-full"
          )}
        >
          <ProgressIndicator
            className={`h-2 rounded-full ${
              isDominant
                ? "bg-linear-to-r from-fuchsia-500 to-pink-600"
                : "bg-zinc-300"
            }`}
          />
        </ProgressTrackPrimitive>
      </Progress>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{value}% (normalized)</span>
      </div>
    </div>
  );
}
