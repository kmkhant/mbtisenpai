# Redis Integration Setup Guide

## Overview

The test count system now supports Redis for persistent storage on serverless platforms (Vercel, etc.). It automatically falls back to file system for local development.

## How It Works

### Automatic Detection

The system automatically detects if Redis is available:

1. **Redis Available** (when `KV_REDIS_CONNECTION_STRING`, `REDIS_URL`, or `KV_URL` is set):

   - Uses Redis for storing test count
   - Count persists across deployments
   - Atomic increment operations

2. **Redis Not Available** (local development):
   - Falls back to file system (`data/test-count.json`)
   - Works offline
   - Perfect for local testing

### Redis Keys Used

- `mbti:test-count` - Stores the test count (integer, incremented atomically)
- `mbti:test-count:last-updated` - Stores the last update timestamp (ISO string)

## Setting Up Redis on Vercel

### Step 1: Create Vercel KV Database

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **KV**
3. Click **Create Database**
4. Choose a name (e.g., "mbti-stats")
5. Select a region close to your users

### Step 2: Environment Variables

Vercel automatically provides the connection string via:

- `KV_REDIS_CONNECTION_STRING` (automatically set by Vercel)

**No manual configuration needed!** The code automatically detects and uses this.

### Step 3: Verify Setup

After deployment, test the integration:

```bash
# Check if Redis is being used
curl https://your-domain.com/api/stats/count

# Should return:
# {
#   "count": <number>,
#   "lastUpdated": "<timestamp>"
# }
```

## Local Development

For local development, you have two options:

### Option 1: Use File System (Default)

Just don't set any Redis environment variables. The system will automatically use the file system.

### Option 2: Use Local Redis

If you want to test Redis locally:

1. **Install Redis locally:**

   ```bash
   # macOS
   brew install redis
   brew services start redis

   # Linux
   sudo apt-get install redis-server
   sudo systemctl start redis
   ```

2. **Set environment variable:**

   ```bash
   # In your .env.local file
   REDIS_URL=redis://localhost:6379
   ```

3. **Run your app:**
   ```bash
   bun run dev
   ```

## Code Flow

### When a Test is Completed

1. User completes test → `/api/mbti/score` is called
2. Score is calculated successfully
3. `incrementCount()` is called asynchronously
4. System checks for Redis:
   - **If Redis available:** Uses `INCR mbti:test-count` (atomic)
   - **If Redis not available:** Reads file, increments, writes back
5. Count is updated

### Reading the Count

1. `/api/stats/count` endpoint is called
2. System checks for Redis:
   - **If Redis available:** Reads from Redis keys
   - **If Redis not available:** Reads from `data/test-count.json`
3. Returns count and last updated timestamp

## Troubleshooting

### Redis Connection Fails

If Redis connection fails, the system automatically falls back to file system. Check:

1. **Environment variable is set:**

   ```bash
   echo $KV_REDIS_CONNECTION_STRING
   ```

2. **Redis is accessible:**

   - Check Vercel KV dashboard
   - Verify database is active

3. **Check logs:**
   - Look for `[Redis]` error messages in Vercel logs
   - System will log fallback to file system

### Count Resets to Zero

If count resets unexpectedly:

1. **On Vercel:** Check if KV database was recreated
2. **Local:** Check if `data/test-count.json` was deleted
3. **Check logs:** Look for Redis connection errors

## Migration from File System to Redis

If you were using file system and want to migrate to Redis:

1. **Get current count:**

   ```bash
   cat data/test-count.json
   ```

2. **Set initial value in Redis** (if needed):

   ```typescript
   // One-time migration script
   const redis = await getRedisClient();
   if (redis) {
     await redis.set("mbti:test-count", "100"); // Your current count
     await redis.set("mbti:test-count:last-updated", new Date().toISOString());
   }
   ```

3. **Deploy with Redis:** Once Redis is configured, new increments will use Redis automatically.

## Performance

- **Redis:** ~1-5ms per operation (very fast)
- **File System:** ~5-10ms per operation (still fast, but slower)
- **Atomic Operations:** Redis `INCR` is atomic, preventing race conditions

## Security

- Redis connection string is stored in environment variables (never in code)
- Redis is only accessible from your Vercel functions
- No public access to Redis keys
- Increment endpoint is still protected with `INTERNAL_API_SECRET`
