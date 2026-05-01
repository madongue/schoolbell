# 🚨 URGENT: Render Environment Configuration

## Problem
The backend deployment on Render failed because environment variables are not set.

Error in logs:
```
Error: supabaseUrl is required.
    at validateSupabaseUrl
```

This means: `SUPABASE_URL` environment variable is missing

## Solution: Add Environment Variables to Render

### Step 1: Go to Render Dashboard
```
URL: https://dashboard.render.com
```

### Step 2: Find Your Service
1. Log in to Render (if not already)
2. Look for "SchoolBell Backend" service in your services list
3. Click on it to open the service details

### Step 3: Navigate to Environment Tab
1. In the service page, find and click the **"Environment"** tab
2. Or look for a settings/gear icon

### Step 4: Add These Environment Variables

Add each of these with their values:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `PORT` | `3000` | Required for server port |
| `SUPABASE_URL` | `https://fwnxaglqcslbxsywokbl.supabase.co` | From Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | `[CONTACT TEAM FOR VALUE]` | 🔒 Keep this secret |
| `NODE_ENV` | `production` | Production environment |

### Step 5: Save and Redeploy
1. Click the **"Save"** button (or **"Deploy"** button)
2. Render will automatically redeploy the service
3. Wait 2-3 minutes for deployment to complete
4. Check the logs to see if it succeeds

### Step 6: Verify Deployment
Once deployed, test the endpoint:
```bash
curl https://schoolbell-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "SchoolBell Backend is running",
  "config": {
    "supabase_url_configured": true,
    "supabase_key_configured": true,
    "environment": "production"
  }
}
```

## New Deployment Features

The latest code update includes:

✅ **Startup Validation** - Server checks environment variables on startup
✅ **Detailed Logging** - Shows which variables are configured
✅ **Enhanced Health Check** - Reports configuration status
✅ **Better Error Messages** - Clear guidance if env vars are missing

When the server starts, you'll see in the logs:
```
Environment Check:
- SUPABASE_URL: ✓ Set
- SUPABASE_SERVICE_ROLE_KEY: ✓ Set
- NODE_ENV: production
- PORT: 3000
```

## If You Still Get Errors

If deployment still fails, check the logs for:

1. **"SUPABASE_URL: ✗ MISSING"** → Add SUPABASE_URL variable
2. **"SUPABASE_SERVICE_ROLE_KEY: ✗ MISSING"** → Add SUPABASE_SERVICE_ROLE_KEY variable
3. **Other errors** → Check Render logs for details

## Render Dashboard Locations

**If you can't find the Environment tab:**

1. From service page, look for tabs: **"Settings"** → **"Environment Variables"**
2. Or try: **"Deploy"** → **"Settings"** → **"Environment"**
3. Or look for a **gear icon** or **⚙️** symbol

## Getting the SUPABASE_SERVICE_ROLE_KEY

If you need the Supabase key:

1. Go to: https://app.supabase.com
2. Select project: **fwnxaglqcslbxsywokbl**
3. Go to: **Settings** → **API**
4. Copy the **Service Role Key** (the long string starting with `sb_secret_`)
5. Paste into Render environment variable

## Quick Checklist

- [ ] Logged into Render dashboard
- [ ] Found SchoolBell Backend service
- [ ] Clicked Environment tab
- [ ] Added SUPABASE_URL variable
- [ ] Added SUPABASE_SERVICE_ROLE_KEY variable
- [ ] Added PORT variable (3000)
- [ ] Added NODE_ENV variable (production)
- [ ] Clicked Save/Deploy
- [ ] Waited 2-3 minutes
- [ ] Tested health endpoint
- [ ] Got success response ✓

## Status

**Latest Commit**: 9bf614c (Environment validation added)
**Deployment Status**: Ready to deploy with environment variables
**Next Action**: Set environment variables and redeploy

---

Once these variables are set and the service redeploys, your backend will be fully operational!
