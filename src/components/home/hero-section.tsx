"use client";

import Link from "next/link";
import { ChevronRightCircle } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { EncryptedText } from "@/components/ui/encrypted-text";

export function HeroSection() {
  return (
    <section className="space-y-4 text-center md:text-left min-h-[280px] sm:min-h-[300px] md:min-h-[320px]">
      <h1 className="bg-linear-to-b from-fuchsia-500 to-pink-600 bg-clip-text text-3xl font-extrabold leading-tight text-transparent sm:text-4xl lg:text-5xl">
        <EncryptedText text="Take MBTI Test" revealDelayMs={40} />
        <br />
        <EncryptedText text="Quick, Easy and Accurate" revealDelayMs={40} />
        <br />
        <EncryptedText text="from Anywhere" revealDelayMs={60} />
        <br />
        <EncryptedText text="for FREE" revealDelayMs={60} />
      </h1>
      <p className="text-sm leading-relaxed text-zinc-500 sm:text-base">
        just give 10 minutes to accurately understand more about yourself.
      </p>
      <Button className="mt-3 md:justify-start group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-pink-500 px-8 py-3 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white group-hover:text-base">
        <Link href="/test">Take the Test</Link>
        <ChevronRightCircle className="size-5 transition-all duration-300 ease-in-out group-hover:translate-x-0.5" />
      </Button>
    </section>
  );
}

