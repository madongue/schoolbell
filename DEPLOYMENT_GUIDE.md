# 🚀 SchoolBell Complete Deployment Guide

This guide walks through deploying the SchoolBell app to production with:
- Supabase backend database
- Node.js API on Render
- Mobile APK hosted online

## 📋 Prerequisites

- GitHub account
- Supabase account (free)
- Render account (free)
- Firebase/GitHub for APK hosting

---

## STEP 1: Set Up Supabase Database

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up or login
3. Click "New Project"
4. **Name:** `schoolbell`
5. **Region:** Select closest to you
6. **Password:** Choose something secure
7. Click "Create new project" (wait 2-3 minutes)

### 1.2 Create Database Schema
1. In Supabase dashboard, click **SQL Editor**
2. Create new query
3. Copy entire SQL from: `../scripts/setup-database.sql`
4. Paste into SQL editor and click "Run"
5. Wait for all tables to create ✓

### 1.3 Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL:** `https://xxxxxxxxx.supabase.co`
   - **Service Role Secret:** (under "Project API keys" section)

**Save these - you'll need them!**

---

## STEP 2: Deploy Backend to Render

### 2.1 Prepare Backend Repository

```bash
cd c:\Users\LESLINE\Desktop\SchoolBell\backend

# Create .env file with Supabase credentials
copy .env.example .env
# Edit .env and add your Supabase credentials:
#   SUPABASE_URL=https://xxxxxxxxx.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Test locally first
npm install
npm run dev
# Check http://localhost:3000/api/health
```

### 2.2 Push to GitHub

```bash
cd c:\Users\LESLINE\Desktop\SchoolBell

# Initialize git
git init
git add .
git commit -m "Initial SchoolBell commit"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/schoolbell.git
git branch -M main
git push -u origin main
```

### 2.3 Deploy on Render

1. Go to https://render.com
2. Sign up/login
3. Click **New +** → **Web Service**
4. Connect GitHub (authorize Render)
5. Select `schoolbell` repository
6. Fill in:
   - **Name:** `schoolbell-api`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** `backend`
7. Scroll to **Advanced**
8. Add Environment Variables:
   ```
   SUPABASE_URL=https://xxxxxxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NODE_ENV=production
   ```
9. Click **Create Web Service**
10. Wait 3-5 minutes for deployment
11. Get your API URL from dashboard (e.g., `https://schoolbell-api.onrender.com`)

### 2.4 Test Backend

```bash
# Test health endpoint
curl https://schoolbell-api.onrender.com/api/health

# Should return:
# {"status":"ok","message":"SchoolBell Backend is running"}
```

---

## STEP 3: Update Frontend & Rebuild APK

### 3.1 Update Frontend Configuration

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=https://schoolbell-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3.2 Rebuild Next.js Build

```bash
cd c:\Users\LESLINE\Desktop\SchoolBell
set PATH=C:\Users\LESLINE\nodejs;%PATH%

npm run build
```

### 3.3 Sync to Android

```bash
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
npx cap sync android
```

### 3.4 Build APK

```bash
cd android
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
gradlew.bat assembleDebug
```

New APK: `C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk`

### 3.5 Install on Phone

```bash
"C:\Users\LESLINE\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r ^
  "C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk"
```

---

## STEP 4: Host APK Online

### Option A: GitHub Releases (Free)

1. Go to GitHub repository
2. Click **Releases** → **Create a new release**
3. **Tag:** `v1.0.0`
4. **Title:** SchoolBell v1.0.0
5. Upload `app-debug.apk` file
6. Publish release
7. Share download link: `https://github.com/YOUR_USERNAME/schoolbell/releases/download/v1.0.0/app-debug.apk`

### Option B: Firebase App Distribution (Free for up to 100 testers)

1. Set up Firebase project
2. Create app distribution group
3. Upload APK through Firebase console
4. Get shareable link

### Option C: Appetize.io (Free)

1. Go to https://appetize.io
2. Upload APK
3. Get web preview link
4. Share with testers

---

## STEP 5: Test Everything

### On Your Phone:
1. Open SchoolBell app
2. Try **Sign Up** with test credentials
3. Try **Login**
4. Check **Dashboard** loads data
5. Try **Attendance** marking
6. Verify data syncs

### Monitor Backend:
```bash
# On Render dashboard, click "Logs" to see:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/students/...
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Supabase URL/key in Render env vars |
| 404 on API endpoints | Verify backend deployed successfully |
| Auth fails on app | Check API_URL in .env.local |
| APK crashes on startup | Check API connectivity, rebuild APK |
| Data not showing | Verify Supabase tables created correctly |

---

## Summary

✅ Supabase database created and configured
✅ Node.js backend deployed to Render
✅ Frontend connected to live API
✅ APK built with production credentials
✅ APK available for download online

**Your app is now in production!**

---

## Next Steps

1. Add more users in Supabase
2. Configure more bell schedules
3. Import student data via API
4. Set up notifications
5. Monitor usage on Render dashboard
