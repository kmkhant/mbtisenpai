"use client";

import Image from "next/image";
import { TYPE_EXPLANATIONS } from "../data/type-explanations";

interface TypeExplanationSectionProps {
  type: string;
  mbtiType: string;
}

export function TypeExplanationSection({
  type,
  mbtiType,
}: TypeExplanationSectionProps) {
  const explanation = TYPE_EXPLANATIONS[type];
  if (!explanation) return null;

  return (
    <section className="mt-6 space-y-3 text-xs text-muted-foreground sm:text-sm">
      <p className="font-semibold capitalize text-pink-500">
        {explanation.groupTitle}
      </p>
      <p>{explanation.groupDescription}</p>
      <div className="mt-3 space-y-1 rounded-xl bg-accent/60 px-4 py-3">
        <p className="text-sm font-semibold text-foreground sm:text-base">
          {mbtiType} — {explanation.typeTitle}
        </p>
        <p>{explanation.typeDescription}</p>
      </div>
      <div className="flex justify-center items-center">
        <Image
          src={`/personalities/${type.toLowerCase()}.png`}
          alt={type}
          width={400}
          height={400}
        />
      </div>
    </section>
  );
}
