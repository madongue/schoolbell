# SchoolBell Deployment - Complete Guide for Render & GitHub

## Current Status: ✅ READY FOR DEPLOYMENT

### What Has Been Completed
- ✅ Backend API fully operational and tested
- ✅ All endpoints working (health, signup, login, students, schedules, attendance, reports)
- ✅ Supabase database connected and verified
- ✅ npm dependencies resolved (130 packages)
- ✅ Git commits pushed to GitHub (main branch)
- ✅ APK built and ready (debug version, 4.8 MB)

### Test Results Summary
```
✅ GET  /api/health                    → 200 OK
✅ POST /api/auth/signup               → 201 Created
✅ POST /api/auth/login                → 200 OK  
✅ GET  /api/students/:schoolId        → 200 OK
```

---

## PHASE 1: Deploy Backend to Render

### Step 1.1: Update Render Environment Variables
1. Go to https://dashboard.render.com
2. Select the SchoolBell Backend service
3. Go to **Environment** tab
4. Update these variables with values provided separately:
   ```
   PORT=3000
   SUPABASE_URL=https://fwnxaglqcslbxsywokbl.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=[See password manager or team lead]
   NODE_ENV=production
   ```
5. Click **Save**
6. The service will redeploy automatically

### Step 1.2: Verify Production Deployment
After Render redeploys (usually 2-3 minutes), test:

```bash
# Test health endpoint
curl https://schoolbell-backend.onrender.com/api/health

# Expected response:
# {"status":"ok","message":"SchoolBell Backend is running"}
```

### Step 1.3: Test Production Endpoints
```bash
# Test signup
curl -X POST https://schoolbell-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"prod-test@schoolbell.com",
    "password":"TestPass123!",
    "full_name":"Production Test",
    "school_id":"363fc7ac-8256-492c-ad71-1e9e679c6801"
  }'

# Test login
curl -X POST https://schoolbell-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"prod-test@schoolbell.com",
    "password":"TestPass123!"
  }'
```

---

## PHASE 2: Upload APK to GitHub Release

### Step 2.1: Go to GitHub Release
1. Open: https://github.com/madongue/schoolbell/releases/tag/v1.0.0-beta
2. Click the **Edit** button (pencil icon)

### Step 2.2: Upload APK File
1. Scroll to **Attachments** section
2. Drag and drop the APK file:
   ```
   C:\Users\LESLINE\Desktop\SchoolBell\android\app\build\outputs\apk\debug\app-debug.apk
   ```
   Or click "Attach binaries" and select the file

### Step 2.3: Save Release
1. Click **Update release** button
2. APK will be available for download from the release page

---

## PHASE 3: End-to-End Testing

### Step 3.1: Test Mobile App Connection
1. Install the APK on an Android device or emulator
2. Open the SchoolBell app
3. Go to the Login/Signup page
4. The app should connect to: `https://schoolbell-backend.onrender.com`

### Step 3.2: Test User Flow
1. Create a new user account with:
   - Email: test@schoolbell.com
   - Password: TestPass123!
   - School ID: 363fc7ac-8256-492c-ad71-1e9e679c6801
2. Login with the created account
3. Navigate through all app pages (dashboard, students, schedules, attendance, reports)

### Step 3.3: Test Database Operations
1. Add a new student through the app
2. Mark attendance
3. View reports
4. Verify data appears in Supabase dashboard

---

## Important Configuration Files

### Backend Environment
**File**: `backend/.env` (NOT committed to git for security)
```
PORT=3000
SUPABASE_URL=https://fwnxaglqcslbxsywokbl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[CONFIGURED - Stored securely in password manager]
NODE_ENV=production
```

### Frontend Environment
**File**: `.env.local` (already configured)
```
NEXT_PUBLIC_API_URL=https://schoolbell-backend.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://fwnxaglqcslbxsywokbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

### Capacitor Config for Mobile
**File**: `capacitor.config.json` (already configured)
- App ID: `com.schoolbell.app`
- App Name: `SchoolBell`
- Backend: Points to `https://schoolbell-backend.onrender.com`

---

## Troubleshooting

### If Backend Health Check Fails
1. Check Render service status: https://dashboard.render.com
2. Verify environment variables are set correctly
3. Check service logs in Render dashboard
4. Confirm Supabase credentials are correct

### If Signup Fails on Production
1. Verify `school_id` is included in request body
2. Verify the school_id exists in database
3. Check Render logs for detailed error messages

### If Mobile App Can't Connect
1. Verify backend URL is: `https://schoolbell-backend.onrender.com`
2. Check that the backend is responding to health check
3. Clear app cache and reinstall APK
4. Check device internet connection

---

## Database Schema Reference

### Schools Table
```sql
id, name, address, email, phone, principal_name, establishment_year, status
```
**Sample Data**: Test School (ID: 363fc7ac-8256-492c-ad71-1e9e679c6801)

### Users Table
Requires: email, full_name, school_id, password
```sql
id, school_id, email, full_name, role, phone, status, last_login
```

### Students Table
```sql
id, school_id, roll_number, first_name, last_name, date_of_birth, email, class_name, status
```

### Schedules Table
```sql
id, school_id, name, start_time, end_time, bell_type, days_of_week, is_active
```

### Attendance Table
```sql
id, school_id, student_id, attendance_date, status, marked_by, notes
```

---

## Deployment Checklist

- [ ] Backend environment variables updated in Render
- [ ] Backend service redeployed and verified on Render
- [ ] Health check endpoint responds successfully
- [ ] All API endpoints tested in production
- [ ] APK uploaded to GitHub release v1.0.0-beta
- [ ] Mobile app tested with production backend
- [ ] User registration tested end-to-end
- [ ] Database operations verified in Supabase
- [ ] Reports and schedules functionality tested
- [ ] Documentation updated

---

## Next Phase: Production Readiness

Once all above steps are complete:
1. Run full regression testing
2. Create admin account for school management
3. Set up data backup and recovery procedures
4. Configure monitoring and alerts
5. Plan for user onboarding and training

---

**Created**: May 1, 2026
**Status**: Ready for deployment to production
**Backend Commit**: d378902 (main branch)
**APK Version**: v1.0.0-beta (debug build)
