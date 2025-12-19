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
        if (!result) {
          console.log(`Result not found in Redis for id: ${id}`);
        }
      } catch (error) {
        console.error("Failed to fetch result from Redis:", error);
        if (error instanceof Error) {
          console.error("Redis error details:", error.message, error.stack);
        }
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

    // Validate result structure
    if (!result.type || !result.percentages) {
      console.error("Invalid result structure:", {
        type: result.type,
        hasPercentages: !!result.percentages,
        result: JSON.stringify(result).substring(0, 200),
      });
      return new Response("Invalid result data", { status: 400 });
    }

    // Ensure all required percentage fields exist
    const requiredFields: Array<"E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"> =
      ["E", "I", "S", "N", "T", "F", "J", "P"];
    const missingFields = requiredFields.filter(
      (field) => result.percentages[field] === undefined
    );
    if (missingFields.length > 0) {
      console.error("Missing percentage fields:", missingFields);
      // Fill in missing fields with 0
      missingFields.forEach((field) => {
        result.percentages[field] = 0;
      });
    }

    const type = result.type === "XXXX" ? "Unable to Determine" : result.type;
    const title =
      result.type === "XXXX"
        ? "MBTI Result"
        : TYPE_TITLES[result.type] || "MBTI Result";

    // Calculate dimension preferences for display with safe defaults
    let ei = "E";
    let sn = "S";
    let tf = "T";
    let jp = "J";

    if (result.type !== "XXXX" && result.percentages) {
      const p = result.percentages;
      // Safely access percentages with fallbacks
      ei = (p.E ?? 0) >= (p.I ?? 0) ? "E" : "I";
      sn = (p.S ?? 0) >= (p.N ?? 0) ? "S" : "N";
      tf = (p.T ?? 0) >= (p.F ?? 0) ? "T" : "F";
      jp = (p.J ?? 0) >= (p.P ?? 0) ? "J" : "P";
    }

    // Get the base URL for the logo - normalize to use www
    let baseUrl = request.nextUrl.origin;
    // Normalize mbtisenpai.xyz to always use www
    try {
      const urlObj = new URL(baseUrl);
      if (
        urlObj.hostname === "mbtisenpai.xyz" &&
        !urlObj.hostname.startsWith("www.")
      ) {
        urlObj.hostname = "www.mbtisenpai.xyz";
        baseUrl = urlObj.origin;
      }
    } catch {
      // If URL parsing fails, use the original baseUrl
    }
    const logoUrl = `${baseUrl}/logo.png`;

    try {
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
    } catch (imageError: unknown) {
      console.error("ImageResponse creation error:", imageError);
      throw imageError; // Re-throw to be caught by outer catch
    }
  } catch (e: unknown) {
    console.error("OG image generation error:", e);
    // Log more details for debugging
    if (e instanceof Error) {
      console.error("Error message:", e.message);
      console.error("Error stack:", e.stack);
    }
    return new Response(
      `Failed to generate image: ${
        e instanceof Error ? e.message : "Unknown error"
      }`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }
}
