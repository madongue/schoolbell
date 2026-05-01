# SchoolBell - Complete Setup Instructions

## ⏱️ Total Setup Time: ~60 minutes

---

## 📊 PART 1: CREATE SUPABASE PROJECT & DATABASE (5 min)

### Step 1: Go to Supabase
1. Go to: https://supabase.com/dashboard
2. Make sure you're logged in

### Step 2: Create New Project
1. Click **"New project"** button (top right)
2. **Project name**: `schoolbell`
3. **Password**: Create a strong password (save it!)
4. **Region**: Select closest to your location
5. Click **"Create new project"**
6. ⏳ Wait 3-5 minutes for setup

### Step 3: Set Up Database Schema
1. Once project loads, go to **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy the entire content from: `scripts/setup-database.sql`
4. Paste it into the SQL editor
5. Click **"Run"** button
6. ✅ Wait for completion

### Step 4: Get Your Credentials
1. Go to **"Settings"** → **"API"** (left sidebar)
2. **Copy and save these values:**

```
SUPABASE_URL = https://xxx.supabase.co
SUPABASE_ANON_KEY = eyJxxx...
SUPABASE_SERVICE_ROLE_KEY = eyJxxx...
```

**⚠️ Keep these safe! Don't share them!**

---

## 🔗 PART 2: PUSH CODE TO GITHUB (5 min)

Your Git repository is already initialized locally. Now push it to GitHub:

### Step 1: Create GitHub Repository
1. Go to: https://github.com/new
2. **Repository name**: `schoolbell`
3. **Description**: School Bell Attendance Management System
4. **Visibility**: Public (so you can host APK online)
5. Click **"Create repository"**

### Step 2: Get Your Repository URL
- Copy this URL: `https://github.com/madongue/schoolbell.git`
- (Replace `madongue` with your actual username if different)

### Step 3: Push Code from Your PC

Open **Command Prompt** and run these commands:

```bash
cd C:\Users\LESLINE\Desktop\SchoolBell

git remote add origin https://github.com/madongue/schoolbell.git

git branch -M main

git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🚀 PART 3: DEPLOY BACKEND ON RENDER (15 min)

### Step 1: Go to Render
1. Go to: https://dashboard.render.com
2. If not logged in, click **"Sign up"** or **"Sign in with GitHub"**

### Step 2: Create Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **`schoolbell`** repository
5. Click **"Connect"**

### Step 3: Configure Deployment
Fill in these settings:

- **Name**: `schoolbell-api`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**

### Step 4: Add Environment Variables
Click **"Advanced"** and add these variables:

```
SUPABASE_URL = https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJxxx...
NODE_ENV = production
```

(Use the values you copied from Supabase in Part 1)

### Step 5: Deploy
1. Click **"Create Web Service"**
2. ⏳ Wait 3-5 minutes for deployment
3. Once deployed, you'll see: **"Live"** in green
4. Copy your URL: `https://schoolbell-api.onrender.com`

**⚠️ Save this URL - you'll need it next!**

---

## ⚙️ PART 4: UPDATE FRONTEND CONFIG (2 min)

### Edit `.env.local` in Your Project

Open: `C:\Users\LESLINE\Desktop\SchoolBell\.env.local`

Update these values:

```
NEXT_PUBLIC_API_URL=https://schoolbell-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

**Save the file!**

---

## 📱 PART 5: REBUILD APK WITH LIVE BACKEND (30 min)

### Quick Method: Run Build Script
1. Go to: `C:\Users\LESLINE\Desktop\SchoolBell`
2. Double-click: **`build-apk.bat`**
3. ⏳ Wait 20-30 minutes
4. ✅ APK built successfully!

### Manual Method (if script doesn't work):
```bash
cd C:\Users\LESLINE\Desktop\SchoolBell

set PATH=C:\Users\LESLINE\nodejs;%PATH%

npm run build

set ANDROID_HOME=C:\Users\LESLINE\AppData\Local\Android\Sdk

npx cap sync android

cd android

gradlew.bat assembleDebug
```

**Your new APK is at:**
```
C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## ✅ PART 6: INSTALL & TEST (5 min)

### Install on Phone
1. Connect your Android phone via USB
2. Enable USB debugging on phone
3. Run this command:

```bash
"C:\Users\LESLINE\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r ^
  "C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk"
```

### Test the App
1. Open **SchoolBell** on your phone
2. **Sign up** with test email: `test@test.com`
3. **Log in** with same credentials
4. You should see the **Dashboard**
5. ✅ Data syncs from backend!

---

## 🌐 PART 7: HOST APK ONLINE (10 min)

### Create GitHub Release

1. Go to: https://github.com/madongue/schoolbell
2. Click **"Releases"** (right side)
3. Click **"Create a new release"**
4. **Tag**: `v1.0.0`
5. **Title**: `SchoolBell v1.0.0`
6. Drag and drop your APK file
7. Click **"Publish release"**

### Share the Download Link
Your APK is now available at:
```
https://github.com/madongue/schoolbell/releases/download/v1.0.0/app-debug.apk
```

Share this link with anyone to install! 🎉

---

## 📋 CREDENTIALS CHECKLIST

As you complete each step, save these:

```
☐ Supabase URL: ___________________________________
☐ Supabase Anon Key: ___________________________________
☐ Supabase Service Role Key: ___________________________________
☐ Render Backend URL: ___________________________________
☐ GitHub Repository: https://github.com/madongue/schoolbell
☐ APK Download Link: ___________________________________
```

---

## 🔍 VERIFY EVERYTHING WORKS

After deployment, verify:

- [ ] Supabase project created
- [ ] Database tables created (SQL ran successfully)
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend responds to: https://schoolbell-api.onrender.com/api/health
- [ ] .env.local updated with credentials
- [ ] APK rebuilt successfully
- [ ] APK installed on phone
- [ ] App sign up works
- [ ] App login works
- [ ] Dashboard loads data from backend
- [ ] APK download link works

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Supabase won't create project | Check you have organization selected, try different region |
| GitHub push fails | Run: `git remote -v` to verify remote is set correctly |
| Render deployment fails | Check "Root Directory" is set to `backend` |
| Backend URL shows error | Wait 5 minutes and refresh, check env vars |
| APK build fails | Check .env.local is valid, run gradle clean first |
| App crashes on login | Check API_URL in .env.local is correct |
| Backend doesn't respond | Check environment variables in Render settings |

---

## 📚 NEXT STEPS

Once everything is working:

1. **Add real users** - Create school and admin accounts
2. **Import students** - Add student data to database
3. **Configure bells** - Set up attendance bell schedules
4. **Test attendance** - Mark attendance and check reports
5. **Share APK** - Distribute to teachers/staff

---

## 📞 SUPPORT

For detailed info:
- `README_BACKEND.md` - Backend overview
- `backend/README.md` - Backend documentation
- `DEPLOYMENT_GUIDE.md` - Detailed deployment help
- `HOST_APK_ONLINE.md` - More APK hosting options

---

**You're ready to deploy! 🚀**
