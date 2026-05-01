# 🎯 SUPABASE SETUP - NEXT STEPS (Manual)

## ✅ Completed So Far

```
✓ Supabase Project: "schoolbell" Created
✓ Project URL: https://fwnxaglqcslbxsywokbl.supabase.co
✓ Database Password: WF4f8S1wwLH1Z68R (SAVE THIS!)
✓ Region: East US (North Virginia)
✓ Status: Healthy
```

---

## 📋 REMAINING STEPS

### Step 1: Complete Database Schema Setup (5 min)

**Option A: Copy-Paste (Easier)**
1. Go to SQL Editor in Supabase (you're already there)
2. Open file: `C:\Users\LESLINE\Desktop\SchoolBell\scripts\setup-database.sql`
3. Copy ALL content from the file
4. Paste into Supabase SQL Editor
5. Click **"Run"** button
6. Wait for success message

**Option B: Manual SQL Execution**
- File is ready at: `scripts/setup-database.sql`
- Contains: 7 tables, indexes, and RLS policies

### Step 2: Get Your Credentials (3 min)

Once database is set up:

1. Go to **Settings** (left sidebar)
2. Click **"API"**
3. **Copy and SAVE these values:**

```
SUPABASE_URL = https://fwnxaglqcslbxsywokbl.supabase.co

SUPABASE_ANON_KEY = (find in API settings, labeled "anon public")
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_SERVICE_ROLE_KEY = (find in API settings, labeled "service_role")
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 AFTER DATABASE SETUP

Once you have all credentials:

### Next: Set Up GitHub Repository

```bash
cd C:\Users\LESLINE\Desktop\SchoolBell

git remote add origin https://github.com/madongue/schoolbell.git

git branch -M main

git push -u origin main
```

### Then: Deploy Backend on Render

1. Go to https://dashboard.render.com
2. Create new Web Service
3. Connect your GitHub schoolbell repository
4. Configure:
   - Name: schoolbell-api
   - Environment: Node
   - Build: npm install
   - Start: node server.js
   - Root: backend
5. Add Environment Variables:
   ```
   SUPABASE_URL=https://fwnxaglqcslbxsywokbl.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   NODE_ENV=production
   ```
6. Deploy!

### Finally: Update Frontend & Rebuild APK

1. Edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://schoolbell-api.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://fwnxaglqcslbxsywokbl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
2. Run: `build-apk.bat`
3. Install APK on phone

---

## 📊 Credentials Template (Save This!)

```
SUPABASE SETUP COMPLETE:
┌─────────────────────────────────────────┐
│ Project: schoolbell                     │
│ URL: fwnxaglqcslbxsywokbl.supabase.co  │
│ Password: WF4f8S1wwLH1Z68R              │
│ Region: us-east-1                       │
│                                         │
│ ANON KEY: [copy from Settings > API]   │
│ SERVICE ROLE: [copy from Settings > API]│
└─────────────────────────────────────────┘
```

---

## ⏭️ Your Next Actions

1. **NOW**: Complete SQL schema (copy-paste into editor, click Run)
2. **THEN**: Copy API credentials from Settings
3. **NEXT**: Create GitHub repo and push code
4. **AFTER**: Deploy backend on Render
5. **FINALLY**: Update .env.local and rebuild APK

---

**Status**: Supabase project ready, awaiting SQL schema setup ✅
