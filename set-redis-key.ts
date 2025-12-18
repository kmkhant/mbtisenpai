import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.error("Error: REDIS_URL is not set in .env file");
  process.exit(1);
}

const KEY = "mbti:test-count:production";
const VALUE = "19";

async function setKey() {
  const client = createClient({
    url: REDIS_URL,
  });

  try {
    await client.connect();
    console.log("Connected to Redis");

    await client.set(KEY, VALUE);
    console.log(`Successfully set ${KEY} = ${VALUE}`);

    // Verify the value
    const result = await client.get(KEY);
    console.log(`Verified: ${KEY} = ${result}`);

    await client.quit();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error:", error);
    await client.quit().catch(() => {});
    process.exit(1);
  }
}

setKey();
