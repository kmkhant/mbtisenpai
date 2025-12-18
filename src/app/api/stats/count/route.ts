import { NextResponse } from "next/server";
import { readCount, getStorageInfo } from "../utils";

export async function GET() {
  try {
    const data = await readCount();
    const storageInfo = getStorageInfo();

    return NextResponse.json(
      {
        count: data.count,
        lastUpdated: data.lastUpdated,
        // Include storage info for debugging (only in development)
        ...(process.env.NODE_ENV === "development" && {
          _debug: storageInfo,
        }),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/stats/count] failed", error);
    return NextResponse.json(
      { error: "Failed to read test count." },
      { status: 500 }
    );
  }
}
