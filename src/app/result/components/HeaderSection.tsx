"use client";

import ProfileImage from "@/components/home/ProfileImage";
import { SENPAI_MESSAGES } from "../data/senpai-messages";

interface HeaderSectionProps {
  type: string | null;
}

export function HeaderSection({ type }: HeaderSectionProps) {
  return (
    <header className="flex items-center justify-center lg:justify-start w-full gap-3">
      <div className="flex flex-col items-center lg:items-start gap-1">
        <ProfileImage size="w-32 h-32" />
        <span className="inline-flex items-center text-center rounded-full bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text px-4 text-xl font-semibold tracking-wide text-transparent">
          Senpai&apos;s Opinionated MBTI Results
        </span>
        <span className="text-xs px-4 font-medium text-muted-foreground">
          {type && type !== "XXXX"
            ? SENPAI_MESSAGES[type] ||
              "You're awesome. Senpai has got your back."
            : "You're awesome. Senpai has got your back. Take the test and find out your type."}
        </span>
      </div>
    </header>
  );
}
