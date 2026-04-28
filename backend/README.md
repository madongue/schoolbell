# SchoolBell Backend API

Node.js/Express backend for the SchoolBell mobile application with Supabase PostgreSQL integration.

## Features

- ✅ User authentication (signup/login)
- ✅ Student management
- ✅ Schedule management
- ✅ Attendance tracking
- ✅ Reporting system
- ✅ CORS enabled for mobile app
- ✅ RESTful API design

## Prerequisites

- Node.js 18+
- Supabase account (free tier)
- Render account (for deployment)

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `schoolbell`
4. Choose region closest to you
5. Set a secure password
6. Click "Create new project" (wait 2-3 minutes)

### 2. Set Up Database

1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy the SQL from `../scripts/setup-database.sql`
4. Paste and run the query
5. Wait for tables to be created

### 3. Get Supabase Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `Service Role Key` (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Supabase credentials to .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run locally
npm run dev
# Server runs at http://localhost:3000
```

### 5. Test Backend

```bash
# Health check
curl http://localhost:3000/api/health

# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@schoolbell.com",
    "password":"SecurePass123",
    "full_name":"Admin User",
    "school_id":null
  }'
```

## Deploy to Render

### Step 1: Push to GitHub

```bash
# From project root
git init
git add .
git commit -m "Add SchoolBell backend"
git remote add origin https://github.com/YOUR_USERNAME/schoolbell-backend.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up or login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill in:
   - **Name:** `schoolbell-api`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Click "Advanced"
7. Add Environment Variables:
   - `SUPABASE_URL` = (from step 2)
   - `SUPABASE_SERVICE_ROLE_KEY` = (from step 2)
   - `NODE_ENV` = `production`
8. Click "Create Web Service"
9. Wait 3-5 minutes for deployment
10. Get your URL from Render dashboard (e.g., `https://schoolbell-api.onrender.com`)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Students
- `GET /api/students/:schoolId` - Get all students
- `POST /api/students` - Create new student

### Schedules
- `GET /api/schedules/:schoolId` - Get all schedules
- `POST /api/schedules` - Create new schedule

### Attendance
- `GET /api/attendance/:schoolId/:studentId` - Get student attendance
- `GET /api/attendance/daily/:schoolId?date=YYYY-MM-DD` - Get daily attendance
- `POST /api/attendance` - Mark attendance

### Reports
- `GET /api/reports/:schoolId` - Get reports

### Health
- `GET /api/health` - Check API status

## Update Frontend

Once deployed, update the frontend `.env.local`:

```
NEXT_PUBLIC_API_URL=https://schoolbell-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Then rebuild the APK.

## Troubleshooting

### Backend won't start
- Check Node version: `node -v` (needs 18+)
- Check port isn't in use: `lsof -i :3000`

### Supabase connection fails
- Verify credentials in .env
- Check Supabase project is active
- Ensure service role key is correct

### CORS errors
- CORS is already enabled in server.js
- Check mobile app is sending requests correctly

## License

MIT
