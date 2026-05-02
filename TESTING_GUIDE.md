# 🧪 SchoolBell Testing Guide - Complete

## Prerequisites ✅
- Backend environment variables set on Render
- Frontend connected to production API
- Database (Supabase) accessible
- Test data available (Test School: 363fc7ac-8256-492c-ad71-1e9e679c6801)

---

## PART 1: BACKEND API TESTING

### API Endpoints Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/students/:schoolId` | List students |
| POST | `/api/students` | Create student |
| GET | `/api/schedules/:schoolId` | List schedules |
| POST | `/api/schedules` | Create schedule |
| GET | `/api/attendance/:schoolId/:studentId` | Get attendance records |
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/reports/:schoolId` | Get attendance reports |

---

## TEST 1: Health Check ✅

**Purpose**: Verify backend is running and configured

**Command**:
```bash
curl https://schoolbell-backend.onrender.com/api/health
```

**Expected Response** (200 OK):
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

**What This Verifies**:
- ✓ Server is running
- ✓ Supabase credentials configured
- ✓ Production environment active
- ✓ All environment variables loaded

---

## TEST 2: User Signup 👤

**Purpose**: Create new user account

**Command**:
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testteacher@schoolbell.com",
    "password": "TestPassword123!",
    "full_name": "Test Teacher",
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801"
  }'
```

**Expected Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "[UUID]",
    "email": "testteacher@schoolbell.com",
    "full_name": "Test Teacher"
  }
}
```

**What This Verifies**:
- ✓ Supabase auth service working
- ✓ User profile creation functional
- ✓ Database write access available
- ✓ Email validation works

**Test Variations**:
- Missing email: Should return 400 error
- Invalid password: Should return error from Supabase
- Duplicate email: Should return 400 error
- Missing school_id: Should return 400 error

---

## TEST 3: User Login 🔑

**Purpose**: Authenticate user and get JWT token

**Command**:
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testteacher@schoolbell.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "[JWT_TOKEN_HERE]",
  "user": {
    "id": "[UUID]",
    "email": "testteacher@schoolbell.com",
    "full_name": "Test Teacher",
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "role": "teacher"
  }
}
```

**What This Verifies**:
- ✓ Authentication working
- ✓ JWT token generation functional
- ✓ User profile retrieval working
- ✓ Database read access available

**Token Info**:
- Save the token for subsequent authenticated requests
- Format: Bearer [token]
- Used in Authorization header

---

## TEST 4: Get Students 👥

**Purpose**: Retrieve list of students for a school

**Command**:
```bash
curl https://schoolbell-backend.onrender.com/api/students/363fc7ac-8256-492c-ad71-1e9e679c6801
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "[UUID]",
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "roll_number": "1",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@school.com",
    "class_name": "10A",
    "date_of_birth": "2010-01-15",
    "status": "active",
    "created_at": "2026-05-01T00:00:00.000Z"
  },
  {
    "id": "[UUID]",
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "roll_number": "2",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@school.com",
    "class_name": "10A",
    "date_of_birth": "2010-02-20",
    "status": "active",
    "created_at": "2026-05-01T00:00:00.000Z"
  }
]
```

**What This Verifies**:
- ✓ Student data retrieval working
- ✓ Database queries functional
- ✓ Filtering by school_id working
- ✓ Only active students returned

---

## TEST 5: Create Student 🎓

**Purpose**: Add new student to school

**Command**:
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "roll_number": "101",
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice@school.com",
    "class_name": "11B",
    "date_of_birth": "2009-06-10"
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": "[NEW_UUID]",
  "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
  "roll_number": "101",
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice@school.com",
  "class_name": "11B",
  "date_of_birth": "2009-06-10",
  "status": "active",
  "created_at": "2026-05-01T12:34:56.000Z"
}
```

**What This Verifies**:
- ✓ Student creation working
- ✓ Database insert functionality
- ✓ Auto-generated UUID working
- ✓ Data persistence in Supabase

---

## TEST 6: Get Schedules 🔔

**Purpose**: Retrieve bell schedules for school

**Command**:
```bash
curl https://schoolbell-backend.onrender.com/api/schedules/363fc7ac-8256-492c-ad71-1e9e679c6801
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "[UUID]",
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "name": "Morning Assembly",
    "description": "School assembly at start of day",
    "start_time": "08:00",
    "end_time": "08:15",
    "bell_type": "assembly",
    "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "is_active": true,
    "created_at": "2026-05-01T00:00:00.000Z"
  }
]
```

**What This Verifies**:
- ✓ Schedule retrieval working
- ✓ Time-based data handling
- ✓ Array filtering working
- ✓ Schedule status checks functional

---

## TEST 7: Create Schedule ⏰

**Purpose**: Add new bell schedule

**Command**:
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "name": "Lunch Break",
    "description": "Lunch time for students",
    "start_time": "12:00",
    "end_time": "13:00",
    "bell_type": "lunch",
    "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "created_by": "[user_id]"
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": "[NEW_UUID]",
  "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
  "name": "Lunch Break",
  "description": "Lunch time for students",
  "start_time": "12:00",
  "end_time": "13:00",
  "bell_type": "lunch",
  "days_of_week": ["monday", "tuesday", "wednesday", "thursday", "friday"],
  "created_by": "[user_id]",
  "is_active": true,
  "created_at": "2026-05-01T12:34:56.000Z"
}
```

**What This Verifies**:
- ✓ Schedule creation working
- ✓ Complex data structures supported
- ✓ Array handling in database
- ✓ Timestamps generated correctly

---

## TEST 8: Record Attendance ✅

**Purpose**: Mark student attendance

**Command**:
```bash
curl -X POST https://schoolbell-backend.onrender.com/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "student_id": "[student_uuid]",
    "date": "2026-05-01",
    "status": "present",
    "recorded_by": "[user_id]"
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": "[NEW_UUID]",
  "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
  "student_id": "[student_uuid]",
  "date": "2026-05-01",
  "status": "present",
  "recorded_by": "[user_id]",
  "created_at": "2026-05-01T12:34:56.000Z"
}
```

**What This Verifies**:
- ✓ Attendance recording working
- ✓ Date handling correct
- ✓ Status validation functional
- ✓ User tracking in records

---

## TEST 9: Get Attendance Records 📋

**Purpose**: Retrieve attendance history for student

**Command**:
```bash
curl https://schoolbell-backend.onrender.com/api/attendance/363fc7ac-8256-492c-ad71-1e9e679c6801/[student_id]
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "[UUID]",
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "student_id": "[student_uuid]",
    "date": "2026-05-01",
    "status": "present",
    "recorded_by": "[user_id]",
    "created_at": "2026-05-01T12:34:56.000Z"
  }
]
```

**What This Verifies**:
- ✓ Attendance retrieval working
- ✓ Historical data query functional
- ✓ Date-based filtering working
- ✓ Record persistence verified

---

## TEST 10: Get Reports 📊

**Purpose**: Retrieve attendance statistics and reports

**Command**:
```bash
curl https://schoolbell-backend.onrender.com/api/reports/363fc7ac-8256-492c-ad71-1e9e679c6801
```

**Expected Response** (200 OK):
```json
[
  {
    "id": "[UUID]",
    "school_id": "363fc7ac-8256-492c-ad71-1e9e679c6801",
    "report_name": "May Attendance",
    "generated_date": "2026-05-01",
    "month": "05",
    "year": "2026",
    "generated_by": "[user_id]",
    "created_at": "2026-05-01T12:34:56.000Z"
  }
]
```

**What This Verifies**:
- ✓ Report generation working
- ✓ Aggregation queries functional
- ✓ Statistics calculation correct
- ✓ Report storage in database

---

## PART 2: FRONTEND UI TESTING

### Test Environment
- URL: http://localhost:3000 (dev) or https://schoolbell.app (production)
- Browser: Chrome, Firefox, Safari, or Edge
- Device: Desktop, Tablet, Mobile

---

## TEST 11: Login Page UI 🖥️

**Steps**:
1. Navigate to login page
2. Verify page elements displayed:
   - Email input field
   - Password input field
   - Sign In button
   - "Create account" link
   - School logo (if applicable)
3. Try empty login (should show validation error)
4. Try invalid credentials (should show error message)
5. Try correct credentials:
   - Email: testteacher@schoolbell.com
   - Password: TestPassword123!
6. Should redirect to dashboard after successful login

**Expected UI Elements**:
- ✓ Clean, professional layout
- ✓ Clear error messages
- ✓ Loading indicator during login
- ✓ Password visibility toggle
- ✓ Remember me checkbox (optional)

---

## TEST 12: Signup Page UI 📝

**Steps**:
1. Click "Create account" on login page
2. Verify form fields:
   - Full Name
   - Email
   - Password
   - Confirm Password
   - School Selector (dropdown)
   - Terms & Conditions checkbox
3. Try submitting empty form (should show validation)
4. Try weak password (should show error)
5. Try mismatched passwords (should show error)
6. Fill form correctly with:
   - Full Name: Test User
   - Email: testuser@schoolbell.com
   - Password: TestPass123!
   - School: Test School
7. Submit form - should create account and redirect to login

**Expected UI Elements**:
- ✓ Form validation messages
- ✓ Password strength indicator
- ✓ School dropdown populated
- ✓ Submit button disabled on loading
- ✓ Link to existing account

---

## TEST 13: Dashboard UI 📱

**Steps**:
1. Login successfully
2. Verify dashboard displays:
   - Welcome message with user name
   - Navigation sidebar/menu
   - Quick stats cards (if applicable):
     - Total students
     - Present today
     - Absent today
   - Recent activities list
   - Navigation buttons to:
     - Students
     - Attendance
     - Reports
     - Settings
3. Check responsive design:
   - Desktop: Full layout
   - Tablet: Adjusted layout
   - Mobile: Collapsed menu

**Expected UI Elements**:
- ✓ User profile dropdown
- ✓ Logout button
- ✓ Dashboard cards with data
- ✓ Search/filter options
- ✓ Clear visual hierarchy

---

## TEST 14: Students Page UI 👥

**Steps**:
1. Click on "Students" in navigation
2. Verify page displays:
   - List of all students for school
   - Student cards showing:
     - Roll number
     - Name
     - Class
     - Status
   - Action buttons:
     - View Details
     - Edit
     - Mark Attendance
   - Search/filter bar
   - Add Student button
3. Click search and try filtering by:
   - Name
   - Class
   - Roll number
4. Try adding new student:
   - Click "Add Student" button
   - Fill form with student data
   - Submit and verify added to list

**Expected UI Elements**:
- ✓ Student list formatted clearly
- ✓ Search functionality responsive
- ✓ Add button prominent and accessible
- ✓ Edit/delete options working
- ✓ Status indicator visible

---

## TEST 15: Attendance Page UI ✅

**Steps**:
1. Navigate to Attendance section
2. Verify components:
   - Date picker
   - Class/section selector
   - Student list with checkboxes
   - Save button
3. Test date picker:
   - Select different dates
   - Verify attendance records load
4. Test marking attendance:
   - Check boxes for students
   - Mark as "Present", "Absent", "Leave"
   - Add remarks (if applicable)
   - Click Save
   - Verify confirmation message
5. Verify saved data reflected in list

**Expected UI Elements**:
- ✓ Clear date selection
- ✓ Easy-to-use checkboxes
- ✓ Status dropdown/buttons
- ✓ Save confirmation
- ✓ Undo option (if applicable)

---

## TEST 16: Reports Page UI 📊

**Steps**:
1. Navigate to Reports section
2. Verify available report types:
   - Attendance Summary
   - Daily Report
   - Weekly Report
   - Monthly Report
3. Select Month report:
   - Choose month and year
   - Select students or all
   - Click Generate
4. View generated report:
   - Data displayed correctly
   - Attendance percentages calculated
   - Export options available (PDF, Excel)
5. Test export:
   - Click Download PDF
   - Verify file downloads
   - Open and verify content

**Expected UI Elements**:
- ✓ Clear filter options
- ✓ Report preview
- ✓ Export buttons
- ✓ Print option
- ✓ Data visualization (charts, if applicable)

---

## TEST 17: Settings Page ⚙️

**Steps**:
1. Navigate to Settings
2. Verify sections:
   - Profile Settings
   - Account Security
   - School Information
   - Notification Preferences
3. Test profile update:
   - Edit name
   - Edit email
   - Save changes
   - Verify update confirmed
4. Test password change:
   - Enter old password
   - Enter new password
   - Confirm new password
   - Save - should require re-login
5. Test logout:
   - Click Logout
   - Verify redirect to login

**Expected UI Elements**:
- ✓ Profile picture upload
- ✓ Form validation
- ✓ Confirmation dialogs
- ✓ Success/error messages
- ✓ Account deletion warning

---

## TEST 18: Responsive Design 📲

**Desktop View**:
- ✓ Full sidebar navigation
- ✓ Multi-column layouts
- ✓ Proper spacing and margins
- ✓ All buttons easily clickable

**Tablet View (iPad-size)**:
- ✓ Sidebar collapses to hamburger
- ✓ Content adapts to width
- ✓ Touch-friendly buttons
- ✓ Horizontal scrolling where needed

**Mobile View**:
- ✓ Full-screen navigation drawer
- ✓ Single column layout
- ✓ Touch-optimized buttons
- ✓ Readable text sizes
- ✓ No horizontal scroll

---

## TEST 19: Error Handling UI ⚠️

**Test Scenarios**:
1. Network error:
   - Disconnect internet
   - Try action
   - Verify error message shown
   - Verify retry option available

2. Server error:
   - Should display user-friendly message
   - Suggest next steps
   - Provide error ID for support

3. Validation error:
   - Invalid email format
   - Password too weak
   - Required fields empty
   - Clear error messages shown

4. Session timeout:
   - Wait for session to expire
   - Try to perform action
   - Should redirect to login
   - Show session expired message

**Expected UI Elements**:
- ✓ Clear error messages
- ✓ Helpful error icons
- ✓ Retry buttons
- ✓ Contact support link

---

## TEST 20: Performance & Loading ⚡

**Test Points**:
1. Page Load Time:
   - Login page: < 2 seconds
   - Dashboard: < 3 seconds
   - Student list: < 2 seconds

2. Search Performance:
   - Type in search
   - Results update instantly
   - No lag or freezing

3. Form Submission:
   - Show loading state
   - Disable button during submission
   - Complete within 3 seconds

4. Large Data Sets:
   - Load 100+ students
   - Page remains responsive
   - Scrolling smooth
   - Search still fast

**Expected Behavior**:
- ✓ Loading spinners visible
- ✓ No JavaScript errors
- ✓ Smooth animations
- ✓ Quick response times

---

## Test Results Summary Template

Use this template to document your testing:

```
TEST EXECUTION DATE: 2026-05-01
ENVIRONMENT: Production
TESTER: [Your Name]

BACKEND TESTS:
- [ ] Test 1: Health Check ✓/✗
- [ ] Test 2: User Signup ✓/✗
- [ ] Test 3: User Login ✓/✗
- [ ] Test 4: Get Students ✓/✗
- [ ] Test 5: Create Student ✓/✗
- [ ] Test 6: Get Schedules ✓/✗
- [ ] Test 7: Create Schedule ✓/✗
- [ ] Test 8: Record Attendance ✓/✗
- [ ] Test 9: Get Attendance Records ✓/✗
- [ ] Test 10: Get Reports ✓/✗

FRONTEND TESTS:
- [ ] Test 11: Login Page UI ✓/✗
- [ ] Test 12: Signup Page UI ✓/✗
- [ ] Test 13: Dashboard UI ✓/✗
- [ ] Test 14: Students Page UI ✓/✗
- [ ] Test 15: Attendance Page UI ✓/✗
- [ ] Test 16: Reports Page UI ✓/✗
- [ ] Test 17: Settings Page UI ✓/✗
- [ ] Test 18: Responsive Design ✓/✗
- [ ] Test 19: Error Handling UI ✓/✗
- [ ] Test 20: Performance ✓/✗

ISSUES FOUND:
1. [Description of issue]
   - Expected: [What should happen]
   - Actual: [What actually happened]
   - Severity: High/Medium/Low

OVERALL STATUS: ✓ PASS / ✗ FAIL / ⚠️ NEEDS FIXES
```

---

## Quick Testing Checklist

**Before Testing**:
- ✓ Render environment variables configured
- ✓ Backend service deployed
- ✓ Frontend connected to API
- ✓ Database accessible
- ✓ Test account created

**During Testing**:
- ✓ Document all issues
- ✓ Note response times
- ✓ Verify error messages helpful
- ✓ Check responsive design
- ✓ Test with actual data

**After Testing**:
- ✓ Compile all findings
- ✓ Prioritize issues
- ✓ Create bug reports if needed
- ✓ Plan fixes
- ✓ Re-test after fixes

---

## Known Test Data

**Test School**:
- ID: 363fc7ac-8256-492c-ad71-1e9e679c6801
- Name: Test School
- Email: admin@testschool.com

**Test User** (Teacher):
- Email: testteacher@schoolbell.com
- Password: TestPassword123!
- Name: Test Teacher
- Role: teacher

**Test Students**:
- John Doe (Roll: 1, Class: 10A)
- Jane Smith (Roll: 2, Class: 10A)
- [Add more as needed]

---

**Status**: Ready for comprehensive testing
**Last Updated**: 2026-05-01
**Next Step**: Execute test plan and document results
