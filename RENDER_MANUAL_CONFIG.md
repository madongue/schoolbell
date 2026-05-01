# 🎯 Manual Render Environment Configuration - Step by Step

## ✅ What's Ready
- Backend code: Updated with validation and error checking
- render.yaml: Configuration template committed to GitHub
- All secrets: Securely managed (not in repository)

## ⏳ What You Need to Do
Configure environment variables on the Render dashboard

---

## EXACT STEPS TO CONFIGURE

### Step 1: Open Render Dashboard
```
URL: https://dashboard.render.com/
```

### Step 2: Select Your Service
1. Look for your services list on the left sidebar
2. Find **"SchoolBell Backend"** service
3. Click on it

### Step 3: Open Settings/Environment
In the service detail page:
1. Find the tab labeled **"Settings"** or **"Environment"**
2. Or look for a gear icon ⚙️ 
3. Click it

### Step 4: Add Environment Variables
You will see an area to add environment variables. For each variable:

#### Variable 1: PORT
- **Key**: `PORT`
- **Value**: `3000`
- Click **Add**

#### Variable 2: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- Click **Add**

#### Variable 3: SUPABASE_URL
- **Key**: `SUPABASE_URL`
- **Value**: `https://fwnxaglqcslbxsywokbl.supabase.co`
- Click **Add**

#### Variable 4: SUPABASE_SERVICE_ROLE_KEY ⚠️ IMPORTANT
- **Key**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: [Contact project lead for the value - starts with `sb_secret_`]
- Click **Add**

### Step 5: Save & Deploy
1. Look for a **"Save"** button or **"Deploy"** button
2. Click it
3. Wait 2-3 minutes for the service to redeploy

### Step 6: Verify Success
Open this URL in your browser:
```
https://schoolbell-backend.onrender.com/api/health
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

---

## Screenshots / Visual Guide

### Where to Find Settings
```
Render Dashboard
├── Services (left sidebar)
├── SchoolBell Backend (click)
├── Settings or Environment tab (top of page)
└── Add environment variables here
```

### Environment Variables Form
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Key                  │ Value             │
├─────────────────────────────────────────┤
│ PORT                 │ 3000              │
│ NODE_ENV             │ production        │
│ SUPABASE_URL         │ https://...       │
│ SUPABASE_SERVICE_    │ sb_secret_a...    │
│ ROLE_KEY             │                   │
├─────────────────────────────────────────┤
│ [Save] [Deploy]                         │
└─────────────────────────────────────────┘
```

---

## Values You Need (Copy-Paste)

### PORT
```
3000
```

### NODE_ENV
```
production
```

### SUPABASE_URL
```
https://fwnxaglqcslbxsywokbl.supabase.co
```

### SUPABASE_SERVICE_ROLE_KEY
```
[Contact project lead for the value]
This is a sensitive secret key for Supabase database access.
It should start with "sb_secret_"
```

---

## Troubleshooting

### Can't Find Environment Tab
- Try clicking the **Settings** gear icon (⚙️) 
- Or look for **"Config"** or **"Environment"** tabs
- If still stuck, go to Service → Settings → Environment

### Values Look Different
- ✓ PORT: Must be `3000` (exactly)
- ✓ NODE_ENV: Must be `production` (lowercase)
- ✓ SUPABASE_URL: Must start with `https://fwnxaglqcslbxsywokbl.supabase.co`
- ✓ SUPABASE_SERVICE_ROLE_KEY: Must start with `sb_secret_`

### Deployment Failed After Adding Variables
Check Render logs:
1. In service page, find **"Logs"** tab
2. Look for error messages
3. Common issues:
   - Missing variable (check all 4 are added)
   - Typo in key name (must be exact)
   - Invalid value format

### Health Check Still Fails
1. Wait 2-3 minutes after saving
2. Try refreshing: `https://schoolbell-backend.onrender.com/api/health`
3. Check logs again in Render dashboard
4. Verify all 4 environment variables are set correctly

---

## What Happens After Configuration

### Behind the Scenes
1. Render detects the environment variable change
2. Service redeploys automatically
3. Node.js server starts with new environment
4. Server reads environment variables
5. Supabase connection initialized
6. Server listens on port 3000
7. All endpoints ready to use

### Testing the Endpoints

Once deployment succeeds, test these:

```bash
# Health check
curl https://schoolbell-backend.onrender.com/api/health

# Create user
curl -X POST https://schoolbell-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@schoolbell.com",
    "password":"TestPass123!",
    "full_name":"Test User",
    "school_id":"363fc7ac-8256-492c-ad71-1e9e679c6801"
  }'

# Get students
curl https://schoolbell-backend.onrender.com/api/students/363fc7ac-8256-492c-ad71-1e9e679c6801
```

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Navigate to Render dashboard | 1 min | You |
| Find SchoolBell Backend | 1 min | You |
| Open Settings/Environment | 1 min | You |
| Add 4 environment variables | 2 min | You |
| Click Save/Deploy | <1 min | You |
| **Render redeploys service** | 2-3 min | **Automatic** |
| Test health endpoint | 1 min | You |
| **Total** | **~10 min** | - |

---

## After Configuration Complete

### Next Steps
1. ✅ Backend deployed to Render
2. ⏳ Upload APK to GitHub release
3. ⏳ Run end-to-end mobile app testing
4. ⏳ Create admin account
5. ⏳ Add test data (students, schedules)

---

## Support

If you get stuck:
1. Check the **Logs** tab in Render
2. Verify all 4 environment variables are present
3. Make sure values match exactly (no extra spaces)
4. Contact support with logs and error message

---

**Status**: Configuration ready - Waiting for manual setup on Render dashboard
**All code**: Committed to GitHub main branch
**Latest Commit**: 0797d89 (render.yaml added)
