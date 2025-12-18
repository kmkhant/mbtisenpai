import { NextResponse } from "next/server";
import { readCount } from "../utils";

export async function GET() {
  try {
    const data = await readCount();
    return NextResponse.json(
      {
        count: data.count,
        lastUpdated: data.lastUpdated,
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
