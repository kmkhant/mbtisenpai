import { getRedisClient, isRedisAvailable } from "../stats/redis-client";
import type { MbtiResult } from "@/app/result/types";

const RESULT_KEY_PREFIX = "mbti:result:";
const RESULT_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Save MBTI result to Redis with a unique ID
 * @param result The MBTI result to save
 * @returns The unique ID (nanoid) for the result
 */
export async function saveResultToRedis(
  result: MbtiResult
): Promise<string | null> {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const redis = await getRedisClient();
    if (!redis) {
      console.error(
        "[ResultStorage] Redis is configured but connection failed"
      );
      return null;
    }

    // Generate unique ID
    const { nanoid } = await import("nanoid");
    const id = nanoid();

    const key = `${RESULT_KEY_PREFIX}${id}`;
    const value = JSON.stringify(result);

    // Save with 7-day expiration
    await redis.setEx(key, RESULT_TTL_SECONDS, value);

    console.log(
      `[ResultStorage] Saved result to Redis (key: ${key}, TTL: ${RESULT_TTL_SECONDS}s)`
    );
    return id;
  } catch (error) {
    console.error("[ResultStorage] Failed to save result to Redis:", error);
    return null;
  }
}

/**
 * Retrieve MBTI result from Redis by ID
 * @param id The unique ID (nanoid) of the result
 * @returns The MBTI result or null if not found
 */
export async function getResultFromRedis(
  id: string
): Promise<MbtiResult | null> {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const redis = await getRedisClient();
    if (!redis) {
      console.error(
        "[ResultStorage] Redis is configured but connection failed"
      );
      return null;
    }

    const key = `${RESULT_KEY_PREFIX}${id}`;
    const value = await redis.get(key);

    if (!value) {
      console.log(`[ResultStorage] Result not found in Redis (key: ${key})`);
      return null;
    }

    const result = JSON.parse(value) as MbtiResult;

    // Validate result structure
    if (
      !result.type ||
      !result.scores ||
      !result.percentages ||
      typeof result.type !== "string"
    ) {
      console.error(`[ResultStorage] Invalid result structure for key: ${key}`);
      return null;
    }

    console.log(`[ResultStorage] Retrieved result from Redis (key: ${key})`);
    return result;
  } catch (error) {
    console.error(
      "[ResultStorage] Failed to retrieve result from Redis:",
      error
    );
    return null;
  }
}
