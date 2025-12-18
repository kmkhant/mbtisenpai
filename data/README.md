# Test Count Data

This directory stores the test completion count.

## File: `test-count.json`

This file is automatically created and updated when tests are completed. It contains:

```json
{
  "count": 0,
  "lastUpdated": null
}
```

## Important Notes

### Serverless Platforms (Vercel, Netlify, etc.)

✅ **Redis integration is now implemented!** The system automatically uses Redis when available, and falls back to file system for local development.

**How it works:**

- If `KV_REDIS_CONNECTION_STRING`, `REDIS_URL`, or `KV_URL` environment variable is set → Uses Redis
- If no Redis URL is set → Falls back to file system (for local development)

**Setting up Redis on Vercel:**

1. Create a Vercel KV database in your Vercel dashboard
2. The connection string is automatically provided via `KV_REDIS_CONNECTION_STRING`
3. The code will automatically detect and use Redis

📚 **For detailed Redis setup instructions, see [docs/deployment/REDIS-SETUP.md](../docs/deployment/REDIS-SETUP.md)**

**Redis Keys Used:**

- `mbti:test-count` - Stores the test count (integer)
- `mbti:test-count:last-updated` - Stores the last update timestamp

### Traditional Hosting

If you're using traditional hosting (VPS, dedicated server, etc.), the file-based approach will work fine.

## API Endpoints

- `GET /api/stats/count` - Get the current test count (public, read-only)
- `POST /api/stats/increment` - Increment the test count (protected, requires secret token)

### Security

The increment endpoint is protected and requires a secret token. Set the `INTERNAL_API_SECRET` environment variable to enable it. The token should be passed in the `Authorization` header as `Bearer <token>` or in the `x-internal-secret` header.

**Note:** The score API calls the increment function directly (server-side), so it doesn't need to use the API endpoint. The API endpoint is protected in case someone tries to call it directly.

## Manual Reset

To reset the count, simply delete or edit `test-count.json`:

```json
{
  "count": 0,
  "lastUpdated": null
}
```
