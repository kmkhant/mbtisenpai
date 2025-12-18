import { promises as fs } from "fs";
import path from "path";
import { getRedisClient, isRedisAvailable } from "./redis-client";

const DATA_FILE = path.join(process.cwd(), "data", "test-count.json");

// Use environment-specific prefix to separate local and production counts
// Set STATS_ENV_PREFIX environment variable to enable separation
// If not set, both environments will share the same Redis keys
const ENV_PREFIX = process.env.STATS_ENV_PREFIX || "";
const REDIS_KEY = ENV_PREFIX
  ? `mbti:test-count:${ENV_PREFIX}`
  : "mbti:test-count";
const REDIS_LAST_UPDATED_KEY = ENV_PREFIX
  ? `mbti:test-count:last-updated:${ENV_PREFIX}`
  : "mbti:test-count:last-updated";

/**
 * Get storage backend information for debugging
 */
export function getStorageInfo() {
  const redisAvailable = isRedisAvailable();
  const redisUrl =
    process.env.KV_REDIS_CONNECTION_STRING ||
    process.env.REDIS_URL ||
    process.env.KV_URL;

  const checkedVars = ["KV_REDIS_CONNECTION_STRING", "REDIS_URL", "KV_URL"];
  const missingVars = checkedVars.filter((varName) => !process.env[varName]);
  const foundVar = checkedVars.find((varName) => process.env[varName]);

  return {
    storageBackend: redisAvailable ? "redis" : "file",
    redisConfigured: !!redisUrl,
    redisUrl: redisUrl
      ? redisUrl.length > 20
        ? `${redisUrl.substring(0, 20)}...`
        : redisUrl
      : null,
    redisKey: REDIS_KEY,
    filePath: DATA_FILE,
    envPrefix: process.env.STATS_ENV_PREFIX || "none (shared)",
    nodeEnv: process.env.NODE_ENV,
    // Debug info
    redisEnvVarFound: foundVar || null,
    redisEnvVarsChecked: checkedVars,
    redisEnvVarsMissing: missingVars,
    note: redisAvailable
      ? "Redis is configured and will be used"
      : `Redis is not configured. Set one of: ${checkedVars.join(
          ", "
        )}. STATS_ENV_PREFIX only changes key names, it doesn't enable Redis.`,
  };
}

export interface TestCountData {
  count: number;
  lastUpdated: string | null;
}

/**
 * Read count from Redis or file system (fallback)
 * If Redis is configured, it MUST be used - will throw error on failure
 */
export async function readCount(): Promise<TestCountData> {
  // If Redis is configured, it's required - fail if connection fails
  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    if (!redis) {
      throw new Error(
        "[Stats] Redis is configured but connection failed. getRedisClient() returned null."
      );
    }

    try {
      const [count, lastUpdated] = await Promise.all([
        redis.get(REDIS_KEY),
        redis.get(REDIS_LAST_UPDATED_KEY),
      ]);

      const result = {
        count: count ? parseInt(count, 10) : 0,
        lastUpdated: lastUpdated || null,
      };

      console.log(
        `[Stats] Reading from Redis (key: ${REDIS_KEY}, count: ${result.count})`
      );

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `[Stats] Redis read failed: ${errorMessage}. Redis is required when configured.`
      );
    }
  }

  // Fallback to file system only if Redis is NOT configured
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    const result = JSON.parse(fileContent) as TestCountData;
    console.log(`[Stats] Reading from file system (count: ${result.count})`);
    return result;
  } catch {
    // File doesn't exist or is invalid, return default
    console.log(
      "[Stats] File system read failed, returning default (count: 0)"
    );
    return { count: 0, lastUpdated: null };
  }
}

/**
 * Write count to Redis or file system (fallback)
 * If Redis is configured, it MUST be used - will throw error on failure
 */
export async function writeCount(data: TestCountData): Promise<void> {
  // If Redis is configured, it's required - fail if connection fails
  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    if (!redis) {
      throw new Error(
        "[Stats] Redis is configured but connection failed. getRedisClient() returned null."
      );
    }

    try {
      await Promise.all([
        redis.set(REDIS_KEY, data.count.toString()),
        redis.set(
          REDIS_LAST_UPDATED_KEY,
          data.lastUpdated || new Date().toISOString()
        ),
      ]);
      console.log(
        `[Stats] Written to Redis (key: ${REDIS_KEY}, count: ${data.count})`
      );
      return; // Success
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `[Stats] Redis write failed: ${errorMessage}. Redis is required when configured.`
      );
    }
  }

  // Fallback to file system only if Redis is NOT configured
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  console.log(`[Stats] Written to file system (count: ${data.count})`);
}

/**
 * Increment test count (uses Redis if available, otherwise file system)
 * If Redis is configured, it MUST be used - will throw error on failure
 */
export async function incrementCount(): Promise<number> {
  // If Redis is configured, it's required - fail if connection fails
  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    if (!redis) {
      throw new Error(
        "[Stats] Redis is configured but connection failed. getRedisClient() returned null."
      );
    }

    try {
      // Use Redis INCR for atomic increment
      const newCount = await redis.incr(REDIS_KEY);
      const lastUpdated = new Date().toISOString();
      await redis.set(REDIS_LAST_UPDATED_KEY, lastUpdated);
      console.log(
        `[Stats] Incremented in Redis (key: ${REDIS_KEY}, new count: ${newCount})`
      );
      return newCount;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `[Stats] Redis increment failed: ${errorMessage}. Redis is required when configured.`
      );
    }
  }

  // Fallback to file system only if Redis is NOT configured
  const currentData = await readCount();
  const newCount = currentData.count + 1;
  const updatedData: TestCountData = {
    count: newCount,
    lastUpdated: new Date().toISOString(),
  };

  await writeCount(updatedData);
  console.log(`[Stats] Incremented in file system (new count: ${newCount})`);
  return newCount;
}
