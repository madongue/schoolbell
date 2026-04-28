# 🎯 Quick Deployment Checklist

## Phase 1: Supabase Setup (5 min)
- [ ] Go to https://supabase.com and sign up
- [ ] Create new project named "schoolbell"
- [ ] Wait for project to create (2-3 min)
- [ ] Go to SQL Editor
- [ ] Copy SQL from `scripts/setup-database.sql`
- [ ] Paste and run in SQL Editor
- [ ] Go to Settings → API
- [ ] Copy and save:
  - [ ] Project URL (SUPABASE_URL)
  - [ ] Service Role Secret (SUPABASE_SERVICE_ROLE_KEY)

## Phase 2: Backend Deployment (15 min)
- [ ] Go to https://github.com/new
- [ ] Create new repository "schoolbell"
- [ ] Run in terminal:
  ```bash
  cd C:\Users\LESLINE\Desktop\SchoolBell
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USER/schoolbell.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Go to https://render.com and sign up
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Set:
  - [ ] Name: `schoolbell-api`
  - [ ] Environment: Node
  - [ ] Build: `npm install`
  - [ ] Start: `node server.js`
  - [ ] Root: `backend`
- [ ] Add Environment Variables:
  - [ ] SUPABASE_URL (paste from above)
  - [ ] SUPABASE_SERVICE_ROLE_KEY (paste from above)
  - [ ] NODE_ENV=production
- [ ] Click "Create Web Service"
- [ ] Wait 3-5 min for deployment
- [ ] Copy your Render URL (e.g., https://schoolbell-api.onrender.com)

## Phase 3: Frontend Update (10 min)
- [ ] Update `C:\Users\LESLINE\Desktop\SchoolBell\.env.local`:
  ```
  NEXT_PUBLIC_API_URL=https://schoolbell-api.onrender.com
  NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```
- [ ] From Supabase, get NEXT_PUBLIC_SUPABASE_ANON_KEY from Settings → API → "anon" key
- [ ] Run in terminal:
  ```bash
  cd C:\Users\LESLINE\Desktop\SchoolBell
  set PATH=C:\Users\LESLINE\nodejs;%PATH%
  npm run build
  ```

## Phase 4: APK Build (20 min)
- [ ] Sync to Android:
  ```bash
  set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
  npx cap sync android
  ```
- [ ] Build APK:
  ```bash
  cd android
  set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
  gradlew.bat assembleDebug
  ```
- [ ] Verify APK created:
  ```
  C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk
  ```

## Phase 5: Install & Test (5 min)
- [ ] Install on phone:
  ```bash
  "C:\Users\LESLINE\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r ^
    "C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk"
  ```
- [ ] Test on phone:
  - [ ] Open SchoolBell app
  - [ ] Sign up with test email
  - [ ] Login with credentials
  - [ ] Check Dashboard loads

## Phase 6: Host APK Online (10 min)

### Option A: GitHub Releases
- [ ] Go to https://github.com/YOUR_USER/schoolbell/releases
- [ ] Click "Create a new release"
- [ ] Tag: `v1.0.0`
- [ ] Title: `SchoolBell v1.0.0`
- [ ] Upload APK file
- [ ] Publish
- [ ] Share: `https://github.com/YOUR_USER/schoolbell/releases/download/v1.0.0/app-debug.apk`

### Option B: Firebase App Distribution
- [ ] Create Firebase project
- [ ] Set up App Distribution
- [ ] Upload APK
- [ ] Share link with testers

---

## Total Time: ~65 minutes

### Commands Summary (Copy & Paste)

```bash
# Phase 3: Build
cd C:\Users\LESLINE\Desktop\SchoolBell
set PATH=C:\Users\LESLINE\nodejs;%PATH%
npm run build
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
npx cap sync android

# Phase 4: APK
cd android
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
gradlew.bat assembleDebug

# Phase 5: Install
"C:\Users\LESLINE\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r ^
  "C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk"
```

---

## Still Stuck?

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
