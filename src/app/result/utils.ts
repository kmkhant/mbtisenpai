import type { MbtiResult } from "./types";

// Helper functions to encode/decode result in URL
export function encodeResult(result: MbtiResult): string {
  try {
    const json = JSON.stringify(result);
    return btoa(encodeURIComponent(json));
  } catch {
    return "";
  }
}

export function decodeResult(encoded: string): MbtiResult | null {
  try {
    const json = decodeURIComponent(atob(encoded));
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
