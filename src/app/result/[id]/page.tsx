import type { Metadata } from "next";
import { Suspense } from "react";
import { TYPE_EXPLANATIONS } from "../data/type-explanations";
import { ResultPageContent } from "../page-content";
import { ResultSkeleton } from "../components/ResultSkeleton";
import { getResultFromRedis } from "@/app/api/result-storage/redis";

// Mark this route as dynamic since it depends on params
export const dynamic = "force-dynamic";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://mbtisenpai.com");

function getDefaultMetadata(): Metadata {
  return {
    title: "MBTI Result | MBTI Senpai",
    description: "View your MBTI personality test results",
    openGraph: {
      title: "MBTI Result | MBTI Senpai",
      description: "View your MBTI personality test results",
      type: "website",
      url: `${siteUrl}/result`,
      images: [
        {
          url: `${siteUrl}/api/og/result`,
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
      images: [`${siteUrl}/api/og/result`],
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
      return getDefaultMetadata();
    }

    const result = await getResultFromRedis(id);
    if (!result || !result.type) {
      return getDefaultMetadata();
    }

    const type = result.type === "XXXX" ? "Unable to Determine" : result.type;
    const typeTitle =
      TYPE_EXPLANATIONS[result.type]?.typeTitle || "MBTI Result";
    const description =
      TYPE_EXPLANATIONS[result.type]?.typeDescription?.substring(0, 160) +
        "..." ||
      `Your MBTI type is ${type}. Discover your personality insights.`;

    const ogImageUrl = `${siteUrl}/api/og/result?id=${encodeURIComponent(id)}`;
    const pageUrl = `${siteUrl}/result/${id}`;

    return {
      title: `${type} - ${typeTitle} | MBTI Senpai`,
      description,
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
    return getDefaultMetadata();
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
