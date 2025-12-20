import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { TYPE_EXPLANATIONS } from "../data/type-explanations";
import { ResultPageContent } from "../page-content";
import { ResultSkeleton } from "../components/ResultSkeleton";
import { getResultFromRedis } from "@/app/api/result-storage/redis";

// Mark this route as dynamic since it depends on params
export const dynamic = "force-dynamic";

function normalizeUrl(url: string): string {
  // Normalize mbtisenpai.xyz to always use www
  const urlObj = new URL(url);
  if (
    urlObj.hostname === "mbtisenpai.xyz" &&
    !urlObj.hostname.startsWith("www.")
  ) {
    urlObj.hostname = "www.mbtisenpai.xyz";
  }
  return urlObj.toString().replace(/\/$/, ""); // Remove trailing slash
}

async function getSiteUrl(): Promise<string> {
  // Try to get from request headers first (most accurate)
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "https";
    if (host) {
      const url = `${protocol}://${host}`;
      return normalizeUrl(url);
    }
  } catch {
    // Headers not available, fall back to env vars
  }

  // Fall back to environment variables
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  return "https://www.mbtisenpai.xyz";
}

async function getDefaultMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  return {
    title: "MBTI Result | MBTI Senpai",
    description: "View your MBTI personality test results",
    keywords: [
      "MBTI test for dating compatibility",
      "MBTI test for career path",
      "which anime character am I MBTI",
      "MBTI dating compatibility",
      "MBTI career test",
      "anime character MBTI",
      "MBTI result",
      "personality test result",
      "MBTI type",
    ],
    openGraph: {
      title: "MBTI Result | MBTI Senpai",
      description: "View your MBTI personality test results",
      type: "website",
      url: `${siteUrl}/result`,
      images: [
        {
          url: `/api/og/result`,
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
      images: [`/api/og/result`],
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;

    if (!id) {
      return await getDefaultMetadata();
    }

    const result = await getResultFromRedis(id);
    if (!result || !result.type) {
      return await getDefaultMetadata();
    }

    const type = result.type === "XXXX" ? "Unable to Determine" : result.type;
    const typeTitle =
      TYPE_EXPLANATIONS[result.type]?.typeTitle || "MBTI Result";
    const description =
      TYPE_EXPLANATIONS[result.type]?.typeDescription?.substring(0, 160) +
        "..." ||
      `Your MBTI type is ${type}. Discover your personality insights.`;

    const siteUrl = await getSiteUrl();
    const ogImageUrl = `/api/og/result?id=${encodeURIComponent(id)}`;
    const pageUrl = `${siteUrl}/result/${id}`;

    return {
      title: `${type} - ${typeTitle} | MBTI Senpai`,
      description,
      keywords: [
        "MBTI test for dating compatibility",
        "MBTI test for career path",
        "which anime character am I MBTI",
        "MBTI dating compatibility",
        "MBTI career test",
        "anime character MBTI",
        `${type} personality type`,
        `${type} dating compatibility`,
        `${type} career path`,
        `${type} anime character`,
      ],
      openGraph: {
        title: `${type} - ${typeTitle}`,
        description,
        type: "website",
        url: pageUrl,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${type} - ${typeTitle}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${type} - ${typeTitle}`,
        description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return await getDefaultMetadata();
  }
}

export default async function ResultPageById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultPageContent resultId={id} />
    </Suspense>
  );
}
