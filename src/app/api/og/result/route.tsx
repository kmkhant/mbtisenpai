import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getResultFromRedis } from "../../result-storage/redis";

// Use Node.js runtime to support Redis for id parameter
export const runtime = "nodejs";

// Increase max duration for OG image generation (Vercel Pro plan allows up to 300s)
export const maxDuration = 30; // 30 seconds should be enough

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

// Helper to add timeout to promises
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  // Generate a simple request ID for tracking
  const requestId = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  // Log function start - Vercel will capture this
  console.log(
    JSON.stringify({
      level: "info",
      message: "[OG] Request started",
      requestId,
      timestamp: new Date().toISOString(),
    })
  );

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = searchParams.get("data");

    console.log(
      JSON.stringify({
        level: "info",
        message: "[OG] Request parameters",
        requestId,
        hasId: !!id,
        hasData: !!data,
        id: id?.substring(0, 10) + "...", // Log partial ID for debugging
      })
    );

    if (!id && !data) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "[OG] Missing parameters",
          requestId,
        })
      );
      return new Response("Missing id or data parameter", {
        status: 400,
      });
    }

    let result: MbtiResult | null = null;

    // Try to fetch from Redis if id is provided (with timeout)
    if (id) {
      const redisStartTime = Date.now();
      try {
        console.log(
          JSON.stringify({
            level: "info",
            message: "[OG] Fetching from Redis",
            requestId,
            id: id.substring(0, 10) + "...",
          })
        );

        result = await withTimeout(
          getResultFromRedis(id),
          5000, // 5 second timeout
          "Redis fetch timeout"
        );

        const redisTime = Date.now() - redisStartTime;

        if (result) {
          console.log(
            JSON.stringify({
              level: "info",
              message: "[OG] Redis fetch successful",
              requestId,
              redisTime,
              hasType: !!result.type,
              type: result.type,
              hasPercentages: !!result.percentages,
              hasScores: !!result.scores,
              percentagesKeys: result.percentages
                ? Object.keys(result.percentages)
                : [],
              percentagesValues: result.percentages
                ? Object.values(result.percentages).slice(0, 4)
                : [],
            })
          );
        } else {
          console.warn(
            JSON.stringify({
              level: "warn",
              message: "[OG] Result not found in Redis",
              requestId,
              redisTime,
            })
          );
        }
      } catch (error) {
        const redisTime = Date.now() - redisStartTime;
        console.error(
          JSON.stringify({
            level: "error",
            message: "[OG] Redis fetch failed",
            requestId,
            redisTime,
            error:
              error instanceof Error
                ? {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                  }
                : String(error),
          })
        );
        // Don't return error here, try fallback to data parameter
      }
    }

    // Fallback to decoding data parameter if id didn't work
    if (!result && data) {
      try {
        console.log(
          JSON.stringify({
            level: "info",
            message: "[OG] Attempting to decode data parameter",
            requestId,
          })
        );
        result = decodeResult(data);
        if (result) {
          console.log(
            JSON.stringify({
              level: "info",
              message: "[OG] Successfully decoded data parameter",
              requestId,
              hasType: !!result.type,
              hasPercentages: !!result.percentages,
            })
          );
        }
      } catch (error) {
        console.error(
          JSON.stringify({
            level: "error",
            message: "[OG] Failed to decode data parameter",
            requestId,
            error: error instanceof Error ? error.message : String(error),
          })
        );
      }
    }

    if (!result) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "[OG] No result available",
          requestId,
          totalTime: Date.now() - startTime,
        })
      );
      return new Response("Missing or invalid id/data parameter", {
        status: 400,
      });
    }

    // Validate result structure
    console.log(
      JSON.stringify({
        level: "info",
        message: "[OG] Validating result structure",
        requestId,
        hasType: !!result.type,
        type: result.type,
        hasPercentages: !!result.percentages,
        hasScores: !!result.scores,
        percentagesType: typeof result.percentages,
        percentagesIsArray: Array.isArray(result.percentages),
        percentagesKeys: result.percentages
          ? Object.keys(result.percentages)
          : null,
      })
    );

    if (!result.type || !result.percentages) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "[OG] Invalid result structure",
          requestId,
          hasType: !!result.type,
          hasPercentages: !!result.percentages,
          hasScores: !!result.scores,
          resultPreview: JSON.stringify(result).substring(0, 500),
        })
      );
      return new Response("Invalid result data: missing type or percentages", {
        status: 400,
      });
    }

    // Ensure all required percentage fields exist with safe defaults
    const requiredFields: Array<"E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"> =
      ["E", "I", "S", "N", "T", "F", "J", "P"];

    // Create a safe copy of percentages to avoid mutating the original
    console.log(
      JSON.stringify({
        level: "info",
        message: "[OG] Processing percentages",
        requestId,
        originalPercentages: result.percentages,
        originalPercentagesType: typeof result.percentages,
      })
    );

    const safePercentages: Record<string, number> = { ...result.percentages };
    const missingFields = requiredFields.filter(
      (field) =>
        safePercentages[field] === undefined || safePercentages[field] === null
    );

    console.log(
      JSON.stringify({
        level: "info",
        message: "[OG] Percentage fields check",
        requestId,
        safePercentages,
        missingFields,
        requiredFields,
      })
    );

    if (missingFields.length > 0) {
      console.warn(
        JSON.stringify({
          level: "warn",
          message: "[OG] Missing percentage fields",
          requestId,
          missingFields,
        })
      );
      // Fill in missing fields with 0
      missingFields.forEach((field) => {
        safePercentages[field] = 0;
      });
    }

    // Use safe percentages for calculations
    const p = safePercentages;

    console.log(
      JSON.stringify({
        level: "info",
        message: "[OG] Percentages processed",
        requestId,
        finalPercentages: p,
      })
    );

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

    if (result.type !== "XXXX") {
      // Safely access percentages with fallbacks
      ei = (p.E ?? 0) >= (p.I ?? 0) ? "E" : "I";
      sn = (p.S ?? 0) >= (p.N ?? 0) ? "S" : "N";
      tf = (p.T ?? 0) >= (p.F ?? 0) ? "T" : "F";
      jp = (p.J ?? 0) >= (p.P ?? 0) ? "J" : "P";
    }

    const dataFetchTime = Date.now() - startTime;
    const imageStartTime = Date.now();

    console.log(
      JSON.stringify({
        level: "info",
        message: "[OG] Starting ImageResponse generation",
        requestId,
        dataFetchTime,
        type: result.type,
        title,
        ei,
        sn,
        tf,
        jp,
      })
    );

    try {
      console.log(
        JSON.stringify({
          level: "info",
          message: "[OG] Creating ImageResponse",
          requestId,
        })
      );
      const imageResponse = new ImageResponse(
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
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "100%",
                  background: "linear-gradient(to bottom, #d946ef, #ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                M
              </div>
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
          // Add explicit format and quality settings for better compatibility
        }
      );
      const imageTime = Date.now() - imageStartTime;
      const totalTime = Date.now() - startTime;
      console.log(
        JSON.stringify({
          level: "info",
          message: "[OG] ImageResponse created successfully",
          requestId,
          imageTime,
          totalTime,
        })
      );
      return imageResponse;
    } catch (imageError: unknown) {
      const imageTime = Date.now() - imageStartTime;
      const totalTime = Date.now() - startTime;
      console.error(
        JSON.stringify({
          level: "error",
          message: "[OG] ImageResponse creation error",
          requestId,
          imageTime,
          totalTime,
          error:
            imageError instanceof Error
              ? {
                  message: imageError.message,
                  stack: imageError.stack,
                  name: imageError.name,
                }
              : String(imageError),
        })
      );
      throw imageError; // Re-throw to be caught by outer catch
    }
  } catch (e: unknown) {
    const totalTime = Date.now() - startTime;
    console.error(
      JSON.stringify({
        level: "error",
        message: "[OG] OG image generation error",
        requestId,
        totalTime,
        error:
          e instanceof Error
            ? {
                message: e.message,
                stack: e.stack,
                name: e.name,
              }
            : String(e),
      })
    );
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
