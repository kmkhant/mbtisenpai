import { NextRequest, NextResponse } from "next/server";
import { incrementCount } from "../utils";

/**
 * Validates that the request is authorized to increment the test count.
 * Only allows requests with a valid secret token (server-side only).
 */
function isAuthorized(req: NextRequest): boolean {
  // Get secret token from environment variable
  const secretToken = process.env.INTERNAL_API_SECRET;

  // If no secret is set, reject all requests (security by default)
  if (!secretToken) {
    return false;
  }

  // Check for token in Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "").trim();
    return token === secretToken;
  }

  // Check for token in custom header (alternative method)
  const customHeader = req.headers.get("x-internal-secret");
  if (customHeader) {
    return customHeader === secretToken;
  }

  // Check for token in request body (for POST requests)
  // Note: This requires reading the body, which we'll do if needed
  // For now, we'll only check headers to avoid reading body unnecessarily

  return false;
}

export async function POST(req: NextRequest) {
  // Verify authorization
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newCount = await incrementCount();

    return NextResponse.json(
      {
        success: true,
        count: newCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/stats/increment] failed", error);
    return NextResponse.json(
      { error: "Failed to increment test count." },
      { status: 500 }
    );
  }
}
