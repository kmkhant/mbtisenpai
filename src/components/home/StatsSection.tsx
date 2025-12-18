"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsSection() {
  const [testCount, setTestCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestCount() {
      try {
        const res = await fetch("/api/stats/count");
        if (res.ok) {
          const data = (await res.json()) as { count: number };
          setTestCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch test count:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestCount();
  }, []);

  const formattedTestCount =
    testCount !== null && testCount > 0
      ? testCount.toLocaleString()
      : testCount === null
      ? "500+"
      : "0";

  return (
    <section className="mt-4 rounded-2xl border border-border bg-accent/60 px-4 py-4 text-center text-xs text-muted-foreground shadow-sm sm:text-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-lg font-semibold bg-linear-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            {isLoading ? <Skeleton className="h-7 w-16 mx-auto" /> : "100+"}
          </div>
          <div className="mt-1 text-xs font-medium capitalize text-muted-foreground">
            Site Visits
          </div>
        </div>
        <div className="h-10 w-px bg-pink-100" />
        <div className="flex-1">
          <div className="text-lg font-semibold bg-linear-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            {isLoading ? (
              <Skeleton className="h-7 w-16 mx-auto" />
            ) : (
              formattedTestCount
            )}
          </div>
          <div className="mt-1 text-xs font-medium capitalize text-muted-foreground">
            Tests Taken
          </div>
        </div>
        <div className="h-10 w-px bg-pink-100" />
        <div className="flex-1">
          <div className="text-lg font-semibold bg-linear-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            {isLoading ? <Skeleton className="h-7 w-16 mx-auto" /> : "96.48%"}
          </div>
          <div className="mt-1 text-xs font-medium capitalize text-muted-foreground">
            Accuracy
          </div>
        </div>
      </div>
    </section>
  );
}
