"use client";

interface DimensionNarrative {
  key: string;
  title: string;
  summary: string;
}

interface DimensionNarrativesSectionProps {
  narratives: DimensionNarrative[];
}

export function DimensionNarrativesSection({
  narratives,
}: DimensionNarrativesSectionProps) {
  if (narratives.length === 0) return null;

  return (
    <section className="mt-5 space-y-3 text-xs text-zinc-600 sm:text-sm">
      <p className="font-semibold capitalize text-pink-500">
        How your preferences play out in daily life
      </p>
      <ul className="mt-2 space-y-3">
        {narratives.map((dim) => (
          <li
            key={dim.key}
            className="rounded-xl bg-zinc-50 px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
          >
            <p className="text-xs font-semibold text-zinc-900 sm:text-sm">
              {dim.title}
            </p>
            <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
              {dim.summary}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
