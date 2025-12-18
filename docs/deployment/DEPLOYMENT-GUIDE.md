# Test Count File Maintenance Guide

## How `test-count.json` is Maintained

### 📦 Git Version Control

**The file is NOT tracked by Git:**

- ✅ Listed in `.gitignore` (line 44: `/data/test-count.json`)
- ✅ Each environment (local dev, staging, production) has its own independent count
- ✅ Git commits/deployments do NOT affect the count file
- ✅ The count file is created automatically on first use

**Why it's ignored:**

- Count data is environment-specific (dev vs production)
- Prevents merge conflicts
- Keeps repository clean
- Allows each environment to maintain its own statistics

### 🚀 Deployment Scenarios

#### 1. **Serverless Platforms (Vercel, Netlify, AWS Lambda)**

❌ **File-based storage DOES NOT WORK** on serverless platforms because:

- Filesystem is **read-only** (except `/tmp` which is ephemeral)
- Each function invocation may run on a different server
- Files are **lost** between deployments
- Files are **lost** when the serverless function restarts

**What happens:**

```
Deployment 1: Count = 100 tests
↓ (New deployment)
Deployment 2: Count = 0 (file reset, starts fresh)
```

**Solutions for Serverless:**

1. **Vercel KV** (Recommended)

   ```typescript
   // Use Redis-based storage
   import { kv } from "@vercel/kv";
   await kv.incr("test-count");
   ```

2. **Vercel Edge Config**

   ```typescript
   import { get } from "@vercel/edge-config";
   ```

3. **External Database**
   - Upstash (Redis)
   - PlanetScale (MySQL)
   - Supabase (PostgreSQL)

#### 2. **Traditional Hosting (VPS, Dedicated Server, Docker)**

✅ **File-based storage WORKS** on traditional hosting:

- Filesystem is **writable** and **persistent**
- Files survive deployments (if deployed correctly)
- Files survive server restarts

**What happens:**

```
Deployment 1: Count = 100 tests
↓ (New deployment - file preserved)
Deployment 2: Count = 100 tests (continues from previous)
```

**Important considerations:**

- ⚠️ **Deployment method matters:**

  - If you delete/recreate the entire app directory → count resets
  - If you only update code files → count persists
  - If you use Docker volumes → count persists (if volume is mounted)

- ⚠️ **Backup strategy:**
  - The count file should be backed up separately
  - Consider periodic exports to a database or external storage

### 🔄 How Count Persists Across Deployments

#### Scenario A: Traditional Hosting (Works)

```
Initial State:
├── /app/
│   ├── src/ (code)
│   └── data/
│       └── test-count.json (count: 0)

After 50 tests:
├── /app/
│   ├── src/ (code)
│   └── data/
│       └── test-count.json (count: 50) ✅

New Deployment (code update):
├── /app/
│   ├── src/ (new code) ✅
│   └── data/
│       └── test-count.json (count: 50) ✅ PRESERVED
```

#### Scenario B: Serverless (Doesn't Work)

```
Initial Deployment:
├── Function Container
│   └── data/
│       └── test-count.json (count: 0)

After 50 tests:
├── Function Container
│   └── data/
│       └── test-count.json (count: 50)

New Deployment (new container):
├── Function Container (NEW)
│   └── data/
│       └── test-count.json (count: 0) ❌ RESET
```

### 🛠️ Best Practices

#### For Serverless (Vercel/Netlify):

1. **Use Vercel KV** (easiest migration):

   ```bash
   # Install
   npm install @vercel/kv

   # Set up in Vercel dashboard
   # Update utils.ts to use KV instead of file system
   ```

2. **Migration path:**
   - Keep file-based code for local dev
   - Use KV for production
   - Add environment check: `if (process.env.VERCEL) use KV else use file`

#### For Traditional Hosting:

1. **Preserve data directory:**

   ```bash
   # When deploying, exclude data/ from deletion
   rsync -av --exclude='data/' source/ destination/
   ```

2. **Backup strategy:**

   ```bash
   # Regular backups
   cp data/test-count.json backups/test-count-$(date +%Y%m%d).json
   ```

3. **Docker volumes:**
   ```yaml
   volumes:
     - ./data:/app/data # Persist count across container restarts
   ```

### 📊 Current Implementation

**Current code behavior:**

- ✅ Creates file automatically if it doesn't exist
- ✅ Reads/writes to `data/test-count.json`
- ✅ Works on traditional hosting
- ❌ **Will reset on serverless platforms**

**To check your deployment type:**

```typescript
// In your API route
const isServerless = !!process.env.VERCEL || !!process.env.NETLIFY;
if (isServerless) {
  // Use external storage (KV, database, etc.)
} else {
  // Use file system (current implementation)
}
```

### 🔍 Verification

**Check if your count persists:**

1. **Local development:**

   ```bash
   # Run tests, check count
   cat data/test-count.json
   # Restart server, check again
   cat data/test-count.json  # Should be same
   ```

2. **Production (serverless):**

   - Deploy, run a test
   - Redeploy (even without code changes)
   - Check count → **Will be reset to 0** ❌

3. **Production (traditional):**
   - Deploy, run tests
   - Update code and redeploy
   - Check count → **Should persist** ✅

### 🎯 Summary

| Platform Type            | File Persists? | Count Maintained? | Solution Needed?            |
| ------------------------ | -------------- | ----------------- | --------------------------- |
| **Local Dev**            | ✅ Yes         | ✅ Yes            | No                          |
| **VPS/Dedicated**        | ✅ Yes         | ✅ Yes            | No (but backup recommended) |
| **Docker (with volume)** | ✅ Yes         | ✅ Yes            | No                          |
| **Docker (no volume)**   | ❌ No          | ❌ No             | Yes                         |
| **Vercel**               | ❌ No          | ❌ No             | **Yes - Use KV**            |
| **Netlify**              | ❌ No          | ❌ No             | **Yes - Use external DB**   |
| **AWS Lambda**           | ❌ No          | ❌ No             | **Yes - Use DynamoDB/S3**   |

**Bottom line:** If you're deploying to Vercel or similar serverless platforms, you'll need to migrate to an external storage solution (Vercel KV, database, etc.) for the count to persist across deployments.
