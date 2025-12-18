"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultSkeleton() {
  return (
    <div className="flex min-h-screen justify-center bg-linear-to-b from-fuchsia-50 via-white to-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <main className="flex w-full max-w-md flex-col rounded-[32px] bg-white px-6 py-7 shadow-[0_18px_45px_rgba(199,110,255,0.18)] sm:max-w-lg sm:px-8 sm:py-8 md:max-w-3xl md:px-10 md:py-10">
        <header className="flex flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48" />
        </header>

        <section className="mt-7 space-y-3 text-center md:text-left">
          <Skeleton className="h-4 w-20" />
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-baseline md:gap-4">
            <Skeleton className="h-12 w-32" />
          </div>
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
        </section>

        <section className="mt-8">
          <Card className="bg-fuchsia-50/40">
            <CardHeader className="items-center pb-3 text-center">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="mx-auto aspect-square max-h-[260px] w-full min-h-[220px] rounded-lg" />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <Skeleton className="h-8 w-64 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardFooter>
          </Card>
        </section>

        <section className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-muted px-4 py-3">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-1" />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
