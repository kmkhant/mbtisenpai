import { NextRequest, NextResponse } from "next/server";
import { getResultFromRedis } from "../../result-storage/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Result ID is required" },
        { status: 400 }
      );
    }

    const result = await getResultFromRedis(id);

    if (!result) {
      return NextResponse.json(
        { error: "Result not found or expired" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[GET /api/result/[id]] failed", error);
    return NextResponse.json(
      { error: "Failed to retrieve result." },
      { status: 500 }
    );
  }
}
