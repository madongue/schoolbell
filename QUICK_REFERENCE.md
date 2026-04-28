# 📋 SchoolBell Deployment - Quick Reference Card

## Print This Page for Reference! 🖨️

---

## PHASE 1: SUPABASE (5 min)

```
☐ Go to: https://supabase.com
☐ Sign up → Create Project "schoolbell"
☐ Wait 2-3 min for setup
☐ Go to: SQL Editor
☐ Paste from: scripts/setup-database.sql
☐ Click "Run"
☐ Go to: Settings → API
☐ Copy: Project URL
☐ Copy: Service Role Key
```

**Save These:**
- SUPABASE_URL: `_______________________`
- SERVICE_ROLE_KEY: `_______________________`

---

## PHASE 2: BACKEND DEPLOYMENT (15 min)

```
☐ Go to: https://github.com/new
☐ Create repo: "schoolbell"
☐ Clone to PC

☐ Open terminal:
  cd C:\Users\LESLINE\Desktop\SchoolBell
  git init
  git add .
  git commit -m "Initial"
  git remote add origin https://github.com/USER/schoolbell.git
  git push -u origin main

☐ Go to: https://render.com
☐ Sign up → New Web Service
☐ Connect GitHub → Select schoolbell
☐ Configure:
  • Name: schoolbell-api
  • Environment: Node
  • Build: npm install
  • Start: node server.js
  • Root: backend

☐ Add Environment Variables:
  SUPABASE_URL=https://xxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=xxx
  NODE_ENV=production

☐ Click: Create Web Service
☐ Wait 3-5 minutes
☐ Copy your URL
```

**Save This:**
- BACKEND_URL: `_______________________`

---

## PHASE 3: GET ANON KEY (2 min)

```
☐ Go to: Supabase → Settings → API
☐ Find: "anon public" key
☐ Copy it
```

**Save This:**
- ANON_KEY: `_______________________`

---

## PHASE 4: UPDATE & REBUILD (30 min)

Edit `C:\Users\LESLINE\Desktop\SchoolBell\.env.local`:

```
NEXT_PUBLIC_API_URL=https://schoolbell-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

**Then run:**

```bash
cd C:\Users\LESLINE\Desktop\SchoolBell
set PATH=C:\Users\LESLINE\nodejs;%PATH%
npm run build
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
npx cap sync android
cd android
gradlew.bat assembleDebug
```

**Or just double-click:**
```
build-apk.bat
```

---

## PHASE 5: TEST (5 min)

```bash
"C:\Users\LESLINE\AppData\Local\Android\Sdk\platform-tools\adb.exe" ^
  install -r ^
  "C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk"
```

**Test on phone:**
- ☐ Open SchoolBell
- ☐ Sign up (test@test.com)
- ☐ Login
- ☐ See dashboard

---

## PHASE 6: HOST ONLINE (10 min)

```
☐ Go to: https://github.com/USER/schoolbell/releases
☐ Click: Create a new release
☐ Tag: v1.0.0
☐ Upload: app-debug.apk
☐ Publish
☐ Copy download link

☐ Share link:
https://github.com/USER/schoolbell/releases/download/v1.0.0/app-debug.apk
```

---

## COMMAND COPY-PASTE BLOCK

```bash
REM Phase 2: Push to GitHub
cd C:\Users\LESLINE\Desktop\SchoolBell
git init
git add .
git commit -m "Initial SchoolBell"
git remote add origin https://github.com/YOUR_USER/schoolbell.git
git branch -M main
git push -u origin main

REM Phase 4: Build (takes 20-30 min)
cd C:\Users\LESLINE\Desktop\SchoolBell
set PATH=C:\Users\LESLINE\nodejs;%PATH%
npm run build
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
npx cap sync android
cd android
set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk
gradlew.bat assembleDebug

REM Phase 5: Install
"C:\Users\LESLINE\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r ^
  "C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk"
```

---

## CREDENTIALS TRACKER

```
Supabase:
  Project URL: ________________________
  Service Role: ________________________
  Anon Key: ________________________

Render:
  Backend URL: ________________________
  
GitHub:
  Repo: https://github.com/YOUR_USER/schoolbell

APK:
  Download: ________________________
```

---

## API ENDPOINTS (Quick Reference)

```
Sign Up:   POST /api/auth/signup
Login:     POST /api/auth/login

Students:  GET  /api/students/:schoolId
           POST /api/students

Schedules: GET  /api/schedules/:schoolId
           POST /api/schedules

Attendance: GET /api/attendance/:schoolId/:studentId
            POST /api/attendance

Reports:   GET  /api/reports/:schoolId

Health:    GET  /api/health (check if API running)
```

---

## TROUBLESHOOTING QUICK FIXES

| Error | Fix |
|-------|-----|
| Module not found | `npm install` in backend/ |
| SUPABASE connection fails | Check URL/key in .env |
| APK crashes | Check API_URL in .env.local |
| Render won't deploy | Set Root directory to "backend" |
| "Unknown app" on phone | Tap "Install anyway" |

---

## DOCUMENTATION FILES

Open these if you get stuck:

- `SETUP_SUMMARY.md` - Full overview
- `QUICK_DEPLOY.md` - Detailed checklist
- `DEPLOYMENT_GUIDE.md` - Step-by-step guide
- `backend/README.md` - Backend details
- `HOST_APK_ONLINE.md` - APK hosting options

---

## TIME BREAKDOWN

```
Phase 1 (Supabase):     5 min
Phase 2 (Render):       15 min
Phase 3 (Anon Key):     2 min
Phase 4 (Build APK):    30 min (mostly waiting)
Phase 5 (Test):         5 min
Phase 6 (Host):         10 min
               ──────────────
               Total:   67 min
```

---

## FINAL CHECKLIST

- [ ] Supabase running
- [ ] Backend deployed on Render
- [ ] Backend URL responding to /api/health
- [ ] APK built successfully
- [ ] APK installed on phone
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard shows data
- [ ] APK download link shared

---

## 🎉 DONE!

Congratulations! Your app is live!

Next: Start adding data and users! 🚀

---

**For detailed help, see the documentation files in the project root.**
