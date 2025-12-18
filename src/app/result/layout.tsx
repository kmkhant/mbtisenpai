import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTI Result | MBTI Senpai",
  description: "View your MBTI personality test results",
  openGraph: {
    title: "MBTI Result | MBTI Senpai",
    description: "View your MBTI personality test results",
    type: "website",
    images: [
      {
        url: "/api/og/result",
        width: 1200,
        height: 630,
        alt: "MBTI Result",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI Result | MBTI Senpai",
    description: "View your MBTI personality test results",
    images: ["/api/og/result"],
  },
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
