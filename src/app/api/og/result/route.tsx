/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getResultFromRedis } from "../../result-storage/redis";

// Use Node.js runtime to support Redis for id parameter
export const runtime = "nodejs";

type MbtiResult = {
  type: string;
  scores: Record<string, number>;
  percentages: Record<string, number>;
};

const TYPE_TITLES: Record<string, string> = {
  INTJ: "The Architect",
  INTP: "The Logician",
  ENTJ: "The Commander",
  ENTP: "The Debater",
  INFJ: "The Advocate",
  INFP: "The Mediator",
  ENFJ: "The Protagonist",
  ENFP: "The Campaigner",
  ISTJ: "The Logistician",
  ISFJ: "The Defender",
  ESTJ: "The Executive",
  ESFJ: "The Consul",
  ISTP: "The Virtuoso",
  ISFP: "The Adventurer",
  ESTP: "The Entrepreneur",
  ESFP: "The Entertainer",
};

const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  E: "Social & Outgoing",
  I: "Reflective & Reserved",
  S: "Practical & Realistic",
  N: "Imaginative & Abstract",
  T: "Logical & Objective",
  F: "Empathetic & Values-driven",
  J: "Organized & Decisive",
  P: "Flexible & Adaptable",
};

function decodeResult(encoded: string): MbtiResult | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json) as MbtiResult;
    if (
      !parsed.type ||
      !parsed.scores ||
      !parsed.percentages ||
      typeof parsed.type !== "string"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = searchParams.get("data");

    let result: MbtiResult | null = null;

    // Try to fetch from Redis if id is provided
    if (id) {
      try {
        result = await getResultFromRedis(id);
      } catch (error) {
        console.error("Failed to fetch result from Redis:", error);
      }
    }

    // Fallback to decoding data parameter if id didn't work
    if (!result && data) {
      result = decodeResult(data);
    }

    if (!result) {
      return new Response("Missing or invalid id/data parameter", {
        status: 400,
      });
    }

    const type = result.type === "XXXX" ? "Unable to Determine" : result.type;
    const title =
      result.type === "XXXX"
        ? "MBTI Result"
        : TYPE_TITLES[result.type] || "MBTI Result";

    // Calculate dimension preferences for display
    let ei = "E";
    let sn = "S";
    let tf = "T";
    let jp = "J";

    if (result.type !== "XXXX") {
      ei = result.percentages.E >= result.percentages.I ? "E" : "I";
      sn = result.percentages.S >= result.percentages.N ? "S" : "N";
      tf = result.percentages.T >= result.percentages.F ? "T" : "F";
      jp = result.percentages.J >= result.percentages.P ? "J" : "P";
    }

    // Get the base URL for the logo
    const baseUrl = request.nextUrl.origin;
    const logoUrl = `${baseUrl}/logo.png`;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom, #fdf4ff, #ffffff)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            <img
              src={logoUrl}
              alt="MBTI Senpai Logo"
              width="48"
              height="48"
              style={{
                borderRadius: "100%",
              }}
            />
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #d946ef, #ec4899)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              MBTI Senpai
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            {/* Type Display */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "120px",
                  fontWeight: "900",
                  background: "linear-gradient(to bottom, #d946ef, #ec4899)",
                  backgroundClip: "text",
                  color: "transparent",
                  lineHeight: "1",
                }}
              >
                {type}
              </div>
              {result.type !== "XXXX" && (
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "600",
                    color: "#52525b",
                  }}
                >
                  {title}
                </div>
              )}
            </div>

            {/* Dimensions */}
            {result.type !== "XXXX" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "20px",
                  color: "#52525b",
                }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ fontWeight: "600", width: "40px" }}>
                    {ei}:
                  </span>
                  <span>{DIMENSION_DESCRIPTIONS[ei]}</span>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ fontWeight: "600", width: "40px" }}>
                    {sn}:
                  </span>
                  <span>{DIMENSION_DESCRIPTIONS[sn]}</span>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ fontWeight: "600", width: "40px" }}>
                    {tf}:
                  </span>
                  <span>{DIMENSION_DESCRIPTIONS[tf]}</span>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <span style={{ fontWeight: "600", width: "40px" }}>
                    {jp}:
                  </span>
                  <span>{DIMENSION_DESCRIPTIONS[jp]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              fontSize: "18px",
              color: "#a1a1aa",
            }}
          >
            Discover your personality type
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error("OG image generation error:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
