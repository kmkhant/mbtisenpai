import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take MBTI Test - Free Personality Assessment",
  description:
    "Take our free MBTI personality test. Answer 44 carefully crafted questions to discover your personality type for dating compatibility, career path guidance, and find which anime character matches your MBTI. Quick, accurate, and completely free.",
  keywords: [
    "MBTI test",
    "personality test",
    "free MBTI quiz",
    "Myers-Briggs test",
    "personality assessment",
    "MBTI questions",
    "MBTI test for dating compatibility",
    "MBTI test for career path",
    "which anime character am I MBTI",
    "MBTI dating compatibility",
    "MBTI career test",
    "anime character MBTI",
  ],
  openGraph: {
    title: "Take MBTI Test - Free Personality Assessment | MBTI Senpai",
    description:
      "Take our free MBTI personality test. Answer 44 carefully crafted questions to discover your personality type for dating compatibility, career path guidance, and find which anime character matches your MBTI. Quick, accurate, and completely free.",
    type: "website",
    url: "/test",
  },
  twitter: {
    card: "summary",
    title: "Take MBTI Test - Free Personality Assessment",
    description:
      "Take our free MBTI personality test. Answer 44 carefully crafted questions to discover your personality type for dating compatibility, career path guidance, and find which anime character matches your MBTI.",
  },
  alternates: {
    canonical: "/test",
  },
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
