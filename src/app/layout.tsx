import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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

function getMetadataBase(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  return "https://www.mbtisenpai.xyz";
}

export const metadata: Metadata = {
  metadataBase: new URL(getMetadataBase()),
  title: {
    default: "MBTI Senpai - Free MBTI Personality Test",
    template: "%s | MBTI Senpai",
  },
  description:
    "Take a free, accurate MBTI personality test in just 10 minutes. Discover your personality type with detailed insights, compatibility analysis, and comprehensive results. Quick, easy, and completely free.",
  keywords: [
    "MBTI test",
    "personality test",
    "free MBTI",
    "Myers-Briggs",
    "personality type",
    "MBTI quiz",
    "personality assessment",
    "MBTI free online",
    "16 personalities",
    "personality insights",
  ],
  authors: [
    {
      name: "Khaing Myel Khant",
      url: "https://www.linkedin.com/in/khaing-myel-khant-457b69146/",
    },
  ],
  creator: "Khaing Myel Khant",
  publisher: "MBTI Senpai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "MBTI Senpai",
    title: "MBTI Senpai - Free MBTI Personality Test",
    description:
      "Take a free, accurate MBTI personality test in just 10 minutes. Discover your personality type with detailed insights and compatibility analysis.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MBTI Senpai - Free Personality Test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI Senpai - Free MBTI Personality Test",
    description:
      "Take a free, accurate MBTI personality test in just 10 minutes. Discover your personality type with detailed insights.",
    images: ["/logo.png"],
    creator: "@mbtisenpai",
  },
  alternates: {
    canonical: "/",
  },
  category: "Personality Test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""}
      />
      {facebookAppId && (
        <>
          <Script
            id="facebook-sdk"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.fbAsyncInit = function() {
                  FB.init({
                    appId: '${facebookAppId}',
                    xfbml: true,
                    version: 'v24.0'
                  });
                };
              `,
            }}
          />
          <Script
            src="https://connect.facebook.net/en_US/sdk.js"
            strategy="lazyOnload"
            async
            defer
            crossOrigin="anonymous"
          />
        </>
      )}
    </html>
  );
}
