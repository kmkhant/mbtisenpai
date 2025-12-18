import { createClient } from "redis";

// Redis connection URL from environment variables
// Vercel provides this via KV_REDIS_CONNECTION_STRING or REDIS_URL
const REDIS_URL =
  process.env.KV_REDIS_CONNECTION_STRING ||
  process.env.REDIS_URL ||
  process.env.KV_URL;

let redisClient: ReturnType<typeof createClient> | null = null;
let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

/**
 * Get or create Redis client singleton
 * Returns null if Redis is not configured (falls back to file system)
 */
export async function getRedisClient() {
  // If Redis URL is not configured, return null (use file system)
  if (!REDIS_URL) {
    return null;
  }

  // If client already exists and is connected, return it
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // If client exists but is closed, reset it (serverless environments may close connections)
  if (redisClient && !redisClient.isOpen) {
    try {
      await redisClient.quit();
    } catch {
      // Ignore errors when closing
    }
    redisClient = null;
  }

  // If already connecting, wait for that connection
  if (isConnecting && connectionPromise) {
    await connectionPromise;
    return redisClient;
  }

  // Create new connection
  isConnecting = true;
  connectionPromise = (async () => {
    try {
      redisClient = createClient({
        url: REDIS_URL,
      });

      // Handle connection errors
      redisClient.on("error", (err) => {
        console.error("[Redis] Connection error:", err);
        // Reset client on error so it can be recreated
        redisClient = null;
        isConnecting = false;
      });

      await redisClient.connect();
      isConnecting = false;
    } catch (error) {
      console.error("[Redis] Failed to connect:", error);
      isConnecting = false;
      redisClient = null;
      throw error;
    }
  })();

  await connectionPromise;
  return redisClient;
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return !!REDIS_URL;
}
