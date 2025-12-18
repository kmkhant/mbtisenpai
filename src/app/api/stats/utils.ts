import { promises as fs } from "fs";
import path from "path";
import { getRedisClient, isRedisAvailable } from "./redis-client";

const DATA_FILE = path.join(process.cwd(), "data", "test-count.json");
const REDIS_KEY = "mbti:test-count";
const REDIS_LAST_UPDATED_KEY = "mbti:test-count:last-updated";

export interface TestCountData {
  count: number;
  lastUpdated: string | null;
}

/**
 * Read count from Redis or file system (fallback)
 */
export async function readCount(): Promise<TestCountData> {
  // Try Redis first if available
  if (isRedisAvailable()) {
    try {
      const redis = await getRedisClient();
      if (redis) {
        const [count, lastUpdated] = await Promise.all([
          redis.get(REDIS_KEY),
          redis.get(REDIS_LAST_UPDATED_KEY),
        ]);

        return {
          count: count ? parseInt(count, 10) : 0,
          lastUpdated: lastUpdated || null,
        };
      }
    } catch (error) {
      console.error("[Stats] Redis read failed, falling back to file:", error);
      // Fall through to file system
    }
  }

  // Fallback to file system
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(fileContent) as TestCountData;
  } catch {
    // File doesn't exist or is invalid, return default
    return { count: 0, lastUpdated: null };
  }
}

/**
 * Write count to Redis or file system (fallback)
 */
export async function writeCount(data: TestCountData): Promise<void> {
  // Try Redis first if available
  if (isRedisAvailable()) {
    try {
      const redis = await getRedisClient();
      if (redis) {
        await Promise.all([
          redis.set(REDIS_KEY, data.count.toString()),
          redis.set(
            REDIS_LAST_UPDATED_KEY,
            data.lastUpdated || new Date().toISOString()
          ),
        ]);
        return; // Success, don't fall back to file
      }
    } catch (error) {
      console.error("[Stats] Redis write failed, falling back to file:", error);
      // Fall through to file system
    }
  }

  // Fallback to file system
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Increment test count (uses Redis if available, otherwise file system)
 */
export async function incrementCount(): Promise<number> {
  // Try Redis first if available
  if (isRedisAvailable()) {
    try {
      const redis = await getRedisClient();
      if (redis) {
        // Use Redis INCR for atomic increment
        const newCount = await redis.incr(REDIS_KEY);
        const lastUpdated = new Date().toISOString();
        await redis.set(REDIS_LAST_UPDATED_KEY, lastUpdated);
        return newCount;
      }
    } catch (error) {
      console.error(
        "[Stats] Redis increment failed, falling back to file:",
        error
      );
      // Fall through to file system
    }
  }

  // Fallback to file system
  const currentData = await readCount();
  const newCount = currentData.count + 1;
  const updatedData: TestCountData = {
    count: newCount,
    lastUpdated: new Date().toISOString(),
  };

  await writeCount(updatedData);
  return newCount;
}
