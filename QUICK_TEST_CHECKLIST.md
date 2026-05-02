# 🧪 SchoolBell - Quick Testing Checklist

## ⚠️ PREREQUISITES - MUST COMPLETE FIRST

Before running any tests, ensure:

- [ ] Render environment variables configured (see RENDER_MANUAL_CONFIG.md)
- [ ] Backend deployment complete (check status)
- [ ] Backend health check passing: `curl https://schoolbell-backend.onrender.com/api/health`
- [ ] Frontend `.env.local` configured correctly
- [ ] Supabase database accessible and populated with test data
- [ ] Test school exists (ID: 363fc7ac-8256-492c-ad71-1e9e679c6801)

---

## BACKEND API TESTS (10 Tests)

### Quick Test with cURL

Copy and paste these commands one at a time in terminal:

#### ✅ 1. Health Check
```bash
curl https://schoolbell-backend.onrender.com/api/health
```
**Expected**: 200 OK with `status: "ok"`

#### ✅ 2. Create Test User (Signup)
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"testteacher@schoolbell.com\",\"password\":\"TestPassword123!\",\"full_name\":\"Test Teacher\",\"school_id\":\"363fc7ac-8256-492c-ad71-1e9e679c6801\"}"
```
**Expected**: 201 Created with user data

#### ✅ 3. Login Test
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"testteacher@schoolbell.com\",\"password\":\"TestPassword123!\"}"
```
**Expected**: 200 OK with JWT token

#### ✅ 4. Get Students List
```bash
curl https://schoolbell-backend.onrender.com/api/students/363fc7ac-8256-492c-ad71-1e9e679c6801
```
**Expected**: 200 OK with student array

#### ✅ 5. Create Student
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d "{\"school_id\":\"363fc7ac-8256-492c-ad71-1e9e679c6801\",\"roll_number\":\"101\",\"first_name\":\"TestStudent\",\"last_name\":\"One\",\"email\":\"student@school.com\",\"class_name\":\"10A\",\"date_of_birth\":\"2010-01-15\"}"
```
**Expected**: 201 Created with student data

#### ✅ 6. Get Schedules
```bash
curl https://schoolbell-backend.onrender.com/api/schedules/363fc7ac-8256-492c-ad71-1e9e679c6801
```
**Expected**: 200 OK with schedule array

#### ✅ 7. Create Schedule
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/schedules \
  -H "Content-Type: application/json" \
  -d "{\"school_id\":\"363fc7ac-8256-492c-ad71-1e9e679c6801\",\"name\":\"Morning Bell\",\"description\":\"School starts\",\"start_time\":\"08:00\",\"end_time\":\"08:15\",\"bell_type\":\"start\",\"days_of_week\":[\"monday\",\"tuesday\",\"wednesday\",\"thursday\",\"friday\"],\"created_by\":\"admin\"}"
```
**Expected**: 201 Created with schedule data

#### ✅ 8. Record Attendance
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/attendance \
  -H "Content-Type: application/json" \
  -d "{\"school_id\":\"363fc7ac-8256-492c-ad71-1e9e679c6801\",\"student_id\":\"[STUDENT_ID_FROM_TEST_4_OR_5]\",\"date\":\"2026-05-01\",\"status\":\"present\",\"recorded_by\":\"admin\"}"
```
**Expected**: 201 Created with attendance record

#### ✅ 9. Get Attendance
```bash
curl https://schoolbell-backend.onrender.com/api/attendance/363fc7ac-8256-492c-ad71-1e9e679c6801/[STUDENT_ID]
```
**Expected**: 200 OK with attendance array

#### ✅ 10. Get Reports
```bash
curl https://schoolbell-backend.onrender.com/api/reports/363fc7ac-8256-492c-ad71-1e9e679c6801
```
**Expected**: 200 OK with reports array

---

## FRONTEND UI TESTS (Manual - Run in Browser)

### Test Environment
- **Dev**: http://localhost:3000
- **Production**: [Your frontend URL]

### Test Flow

#### 🔐 Test 1: Login Page
1. Navigate to `/login`
2. **Verify elements exist:**
   - Email input field
   - Password input field
   - Sign In button
   - "Don't have an account?" link to signup

3. **Test empty submission:**
   - Leave fields empty
   - Click Sign In
   - See required field errors

4. **Test wrong credentials:**
   - Email: wrong@email.com
   - Password: WrongPass123!
   - Click Sign In
   - See error message

5. **Test correct login:**
   - Email: `testteacher@schoolbell.com`
   - Password: `TestPassword123!`
   - Click Sign In
   - Should redirect to `/dashboard`

**Checklist:**
- [ ] Page loads without errors
- [ ] Error messages clear and helpful
- [ ] Button disabled during submission
- [ ] Sign up link works
- [ ] Successful login redirects correctly

---

#### 📝 Test 2: Signup Page
1. Click "Don't have an account?" from login
2. Verify signup form has fields:
   - Full Name
   - Email
   - Password
   - Confirm Password
   - School Selector (dropdown)
   - Sign Up button

3. **Test validation:**
   - Leave fields empty → Show required errors
   - Enter weak password → Show strength feedback
   - Mismatched passwords → Show error
   - Invalid email → Show format error

4. **Test successful signup:**
   - Full Name: Test User 2
   - Email: newuser@schoolbell.com
   - Password: TestPass456!
   - Confirm: TestPass456!
   - School: Test School
   - Click Sign Up
   - Should show success and redirect to login

**Checklist:**
- [ ] All form fields present
- [ ] Validation working
- [ ] Error messages helpful
- [ ] Sign up successful
- [ ] Redirects to login

---

#### 📊 Test 3: Dashboard
1. Login successfully (Test 1)
2. Verify dashboard displays:
   - "Dashboard" heading
   - "Welcome to Smart School Bell system" message
   - Stats cards showing:
     - [ ] Total Students (number)
     - [ ] Schedules (number)
     - [ ] Present Today (number)
     - [ ] Absent Today (number)
   - Navigation sidebar with links

3. **Test navigation:**
   - Click "Students" → Goes to students page
   - Click "Attendance" → Goes to attendance page
   - Click "Schedules" → Goes to schedules page
   - Click "Reports" → Goes to reports page
   - Click "Settings" → Goes to settings page

4. **Test responsive design:**
   - Desktop: All elements visible, sidebar on left
   - Mobile: Hamburger menu present, content full-width

**Checklist:**
- [ ] Stats cards load with data
- [ ] Navigation links working
- [ ] No console errors
- [ ] Responsive layout correct
- [ ] User welcome message shows

---

#### 👥 Test 4: Students Page
1. Click "Students" in navigation
2. Verify page shows:
   - "Students" heading
   - Search/filter bar
   - "Add Student" button
   - Student list/table with columns:
     - Roll Number
     - Name
     - Email
     - Class
     - Status

3. **Test search functionality:**
   - Type student name in search
   - Results filter in real-time
   - Clear search → Shows all again

4. **Test add student:**
   - Click "Add Student" button
   - Form appears with fields:
     - Roll Number
     - First Name
     - Last Name
     - Email
     - Class
     - Date of Birth
   - Fill with test data
   - Click Save
   - New student appears in list

5. **Test edit student:**
   - Find student in list
   - Click Edit button (if available)
   - Modify data
   - Click Save
   - Changes reflected in list

**Checklist:**
- [ ] Student list loads
- [ ] Search filters work
- [ ] Add student dialog opens
- [ ] Form validation works
- [ ] Student saved successfully
- [ ] List updates

---

#### ✅ Test 5: Attendance Page
1. Click "Attendance" in navigation
2. Verify page shows:
   - Date picker
   - Class/Section selector
   - Student list with checkboxes
   - Status buttons (Present/Absent/Leave)
   - Save button

3. **Test date selection:**
   - Pick different dates
   - Student list updates (if attendance exists for date)

4. **Test marking attendance:**
   - Select today's date
   - Check box for first student
   - Click "Present" or "Absent"
   - Do this for 3-4 students
   - Click "Save"
   - See success message

5. **Test viewing saved attendance:**
   - Go back to same date
   - See previous entries still marked

**Checklist:**
- [ ] Date picker works
- [ ] Student list appears
- [ ] Checkboxes functional
- [ ] Status buttons work
- [ ] Save records attendance
- [ ] Can view previous records

---

#### 📋 Test 6: Schedules Page
1. Click "Schedules" in navigation
2. Verify page shows:
   - List of schedules
   - Schedule details (time, days, type)
   - "Add Schedule" button
   - Edit/Delete options

3. **Test adding schedule:**
   - Click "Add Schedule"
   - Form shows:
     - Schedule Name
     - Description
     - Start Time
     - End Time
     - Bell Type
     - Days of Week (checkboxes)
   - Fill example:
     - Name: Lunch Break
     - Start: 12:00
     - End: 13:00
     - Days: Mon-Fri
   - Click Save
   - New schedule appears in list

**Checklist:**
- [ ] Schedule list loads
- [ ] Add schedule dialog works
- [ ] Time picker functional
- [ ] Days selection works
- [ ] Schedule saved

---

#### 📊 Test 7: Reports Page
1. Click "Reports" in navigation
2. Verify page shows:
   - Report type selector
   - Date/period selector
   - Generate button
   - View reports section

3. **Test generating report:**
   - Select "Monthly Report"
   - Choose current month and year
   - Click "Generate"
   - Report displays with data:
     - Student attendance stats
     - Percentages
     - Present/Absent counts

4. **Test export:**
   - Click "Download PDF" button
   - File should download
   - Open and verify content

**Checklist:**
- [ ] Report page loads
- [ ] Report generation works
- [ ] Data displays correctly
- [ ] Export buttons present
- [ ] Download works

---

#### ⚙️ Test 8: Settings Page
1. Click profile icon/settings menu
2. Navigate to Settings
3. Verify sections:
   - Profile Information (name, email)
   - Password Change
   - Preferences
   - Logout button

4. **Test profile update:**
   - Click Edit next to name
   - Change name
   - Click Save
   - See confirmation message
   - Name updates in header

5. **Test logout:**
   - Click Logout button
   - Redirected to login page
   - Cannot access dashboard without re-login

**Checklist:**
- [ ] Settings page loads
- [ ] Profile edit works
- [ ] Changes save
- [ ] Logout functional
- [ ] Session cleared

---

#### 📱 Test 9: Responsive Design
Test on different screen sizes:

**Desktop (1920x1080):**
- [ ] Full sidebar navigation visible
- [ ] Multi-column layouts work
- [ ] All content readable
- [ ] Buttons easily clickable

**Tablet (768x1024):**
- [ ] Sidebar collapses to hamburger
- [ ] Content adapts properly
- [ ] Touch-friendly button sizes
- [ ] No horizontal scrolling

**Mobile (375x667):**
- [ ] Full-screen navigation drawer
- [ ] Single column layout
- [ ] Large touch targets (44x44px)
- [ ] Text readable without zoom
- [ ] No horizontal scroll

**Checklist:**
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] No layout broken
- [ ] All content accessible

---

#### ⚠️ Test 10: Error Handling
1. **Test network error:**
   - Disconnect from internet
   - Try to perform action
   - See user-friendly error message
   - Retry option available

2. **Test validation errors:**
   - Leave required fields empty
   - Submit form
   - See validation messages
   - Error messages clear

3. **Test timeout:**
   - Wait for response
   - If takes >5 seconds, should show spinner
   - After 30 seconds, should show error
   - Retry option available

**Checklist:**
- [ ] Error messages helpful
- [ ] Loading states visible
- [ ] Can retry actions
- [ ] No JavaScript errors in console

---

## Quick Status Checks

### Backend Status
- [ ] API responds to health check
- [ ] All endpoints accessible
- [ ] No 500 errors in responses
- [ ] Database queries work
- [ ] Error responses have helpful messages

### Frontend Status
- [ ] Login page loads
- [ ] Can sign up new user
- [ ] Can login successfully
- [ ] Dashboard displays data
- [ ] Navigation works
- [ ] No console errors
- [ ] Responsive on mobile

### Integration Status
- [ ] Frontend connects to backend API
- [ ] Data flows from API to UI
- [ ] Actions save to database
- [ ] Changes reflect in UI

---

## Test Results Template

**Test Date**: _______________
**Environment**: Production / Development
**Tester**: _______________

**Backend Tests**:
| Test | Status | Notes |
|------|--------|-------|
| 1. Health Check | ✓/✗ | |
| 2. Signup | ✓/✗ | |
| 3. Login | ✓/✗ | |
| 4. Get Students | ✓/✗ | |
| 5. Create Student | ✓/✗ | |
| 6. Get Schedules | ✓/✗ | |
| 7. Create Schedule | ✓/✗ | |
| 8. Record Attendance | ✓/✗ | |
| 9. Get Attendance | ✓/✗ | |
| 10. Get Reports | ✓/✗ | |

**Frontend UI Tests**:
| Test | Status | Notes |
|------|--------|-------|
| 1. Login Page | ✓/✗ | |
| 2. Signup Page | ✓/✗ | |
| 3. Dashboard | ✓/✗ | |
| 4. Students Page | ✓/✗ | |
| 5. Attendance Page | ✓/✗ | |
| 6. Schedules Page | ✓/✗ | |
| 7. Reports Page | ✓/✗ | |
| 8. Settings | ✓/✗ | |
| 9. Responsive Design | ✓/✗ | |
| 10. Error Handling | ✓/✗ | |

**Issues Found**:
1. ________________
   - Expected: ________________
   - Actual: ________________
   - Severity: High/Medium/Low

**Overall Status**: PASS ✓ / FAIL ✗ / NEEDS FIXES ⚠️

---

## Troubleshooting

### Backend Not Responding
```
Check:
1. Render environment variables set
2. Backend logs in Render dashboard
3. Health endpoint: curl https://schoolbell-backend.onrender.com/api/health
4. Restart service if needed
```

### Signup/Login Failing
```
Check:
1. Supabase credentials valid
2. User exists in database
3. Password correct
4. Email format valid
5. Database tables exist
```

### Frontend Not Displaying Data
```
Check:
1. Backend API responding
2. Browser console for errors
3. Network tab in dev tools
4. .env.local configured
5. CORS enabled on backend
```

### Attendance Not Saving
```
Check:
1. Student ID valid
2. Date format correct (YYYY-MM-DD)
3. Status valid (present/absent)
4. Database permissions
5. Render logs for errors
```

---

## When Tests Pass ✅

1. Backend API fully functional
2. Frontend UI responsive and intuitive
3. Data flows correctly end-to-end
4. Error handling working
5. Ready for production use

**Next Steps**:
- [ ] Deploy to production
- [ ] Create admin account
- [ ] Upload APK to GitHub
- [ ] Train users
- [ ] Monitor performance

---

**Last Updated**: 2026-05-01
**Status**: Ready for Testing
**Estimated Testing Time**: 45-60 minutes
