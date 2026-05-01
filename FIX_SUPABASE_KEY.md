# 🔧 Fix Supabase Backend Connection

## Current Issue

The backend `.env` file has an **invalid/corrupted SERVICE_ROLE_KEY** with a space in it:
```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_a2amq fKhxFpf0_km-tQ8Lw_AHt85aAr  ❌ (has space, incomplete)
```

This key should be a **continuous string without any spaces**.

---

## ✅ Solution: Get the Correct Key from Supabase

### Step 1: Go to Supabase Dashboard
URL: https://supabase.com/dashboard/project/fwnxaglqcslbxsywokbl

### Step 2: Navigate to API Settings
1. Click on **Settings** (gear icon, bottom left)
2. Select **API**
3. Look for **"Project API keys"** section

### Step 3: Copy the Service Role Secret
You'll see two keys:
- **anon public** (for frontend) - do NOT use
- **Service Role Secret** (long key starting with `sb_secret_`) - **USE THIS ONE**

### Step 4: Update the .env File
The Service Role Secret should:
- Start with: `sb_secret_`
- Be a very long continuous string (around 50+ characters)
- Have NO spaces
- Look something like: `sb_secret_aBcDeFgHiJkLmNoPqRsT...`

---

## 🔐 Current Credentials Status

| Credential | Status | Format |
|-----------|--------|--------|
| SUPABASE_URL | ✅ Valid | `https://fwnxaglqcslbxsywokbl.supabase.co` |
| SERVICE_ROLE_KEY | ❌ Invalid | Corrupted/truncated (has space) |

---

## 📋 Other Fixes Already Applied

✅ **backend/package.json** - Fixed `jsonwebtoken` version from `^9.1.0` to `^9.0.2`
✅ **backend dependencies** - Successfully installed with `npm install`
✅ **backend server** - Running successfully on port 3000
✅ **Health endpoint** - Responding correctly at `http://localhost:3000/api/health`

---

## 🚀 Next Steps

1. Get the correct Service Role Secret from Supabase (follow steps above)
2. Update `C:\Users\LESLINE\Desktop\SchoolBell\backend\.env` with the correct key
3. Test the database connection by running:
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test@example.com\",\"password\":\"testPass123\",\"full_name\":\"Test User\"}"
   ```
   Should return: user created successfully (not "Invalid API key")

4. Push the fix to GitHub:
   ```bash
   cd C:\Users\LESLINE\Desktop\SchoolBell\backend
   git add package.json .env
   git commit -m "Fix: Correct jsonwebtoken version and Supabase SERVICE_ROLE_KEY"
   git push origin main
   ```

5. Redeploy on Render (automatic after push, or manual trigger)

---

## 🔍 Verify Connection Works

Once key is fixed, test with:
```bash
# Health check (should work already)
curl http://localhost:3000/api/health

# Database connection (will work after key fix)
curl http://localhost:3000/api/auth/signup ...
```

Expected response:
```json
{
  "status": "ok",
  "message": "SchoolBell Backend is running"
}
```

---

## 📞 Support

If you can't find the Service Role Secret in Supabase:
1. Verify you're in the correct project: `fwnxaglqcslbxsywokbl`
2. Make sure you're logged in with the correct Supabase account
3. Try refreshing the page or creating a new API key
