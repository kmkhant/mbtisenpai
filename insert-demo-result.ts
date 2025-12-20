import {
  getRedisClient,
  isRedisAvailable,
} from "./src/app/api/stats/redis-client";
import type { MbtiResult } from "./src/app/result/types";

const RESULT_KEY_PREFIX = "mbti:result:";
const DEMO_ID = "demo";

/**
 * Demo MBTI result - INTP (The Logician)
 * This is a realistic result that will be used for the /result/demo page
 */
const demoResult: MbtiResult = {
  type: "INTP",
  scores: {
    E: 15,
    I: 85,
    S: 20,
    N: 80,
    T: 90,
    F: 10,
    J: 25,
    P: 75,
  },
  percentages: {
    E: 15,
    I: 85,
    S: 20,
    N: 80,
    T: 90,
    F: 10,
    J: 25,
    P: 75,
  },
};

async function insertDemoResult() {
  if (!isRedisAvailable()) {
    console.error(
      "❌ Redis is not configured. Please set REDIS_URL or KV_REDIS_CONNECTION_STRING environment variable."
    );
    process.exit(1);
  }

  try {
    const redis = await getRedisClient();
    if (!redis) {
      console.error("❌ Failed to connect to Redis");
      process.exit(1);
    }

    const key = `${RESULT_KEY_PREFIX}${DEMO_ID}`;
    const value = JSON.stringify(demoResult);

    // Save without expiration (or with a very long expiration - 100 years)
    // Using setEx with a very large number, or just set() for no expiration
    // Redis set() without expiration means it never expires
    await redis.set(key, value);

    console.log(`✅ Successfully inserted demo result into Redis`);
    console.log(`   Key: ${key}`);
    console.log(`   Type: ${demoResult.type}`);
    console.log(`   Expiration: Never (no expiration set)`);
    console.log(`\n   You can now access it at: /result/${DEMO_ID}`);

    await redis.quit();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to insert demo result:", error);
    process.exit(1);
  }
}

insertDemoResult();
