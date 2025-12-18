import type { MbtiResult } from "./types";

// Server-safe base64 encoding (works in both Node.js and browser)
function base64Encode(str: string): string {
  if (typeof Buffer !== "undefined") {
    // Node.js environment
    return Buffer.from(str, "utf-8").toString("base64");
  } else {
    // Browser environment
    return btoa(encodeURIComponent(str));
  }
}

// Server-safe base64 decoding (works in both Node.js and browser)
function base64Decode(str: string): string {
  if (typeof Buffer !== "undefined") {
    // Node.js environment
    return Buffer.from(str, "base64").toString("utf-8");
  } else {
    // Browser environment
    return decodeURIComponent(atob(str));
  }
}

// Helper functions to encode/decode result in URL
export function encodeResult(result: MbtiResult): string {
  try {
    const json = JSON.stringify(result);
    return base64Encode(encodeURIComponent(json));
  } catch {
    return "";
  }
}

export function decodeResult(encoded: string): MbtiResult | null {
  try {
    const json = decodeURIComponent(base64Decode(encoded));
    const parsed = JSON.parse(json) as MbtiResult;
    // Validate result structure
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
