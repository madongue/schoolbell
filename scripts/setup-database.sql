-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  address TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  principal_name VARCHAR(255),
  establishment_year INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Users table (with role-based access)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'coordinator')),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  roll_number VARCHAR(50) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  email VARCHAR(255),
  phone VARCHAR(20),
  guardian_name VARCHAR(255),
  guardian_phone VARCHAR(20),
  class_name VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(school_id, roll_number)
);

-- Schedules table (for bell schedules)
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  bell_type VARCHAR(50) NOT NULL CHECK (bell_type IN ('morning', 'break', 'recess', 'lunch', 'dismissal', 'custom')),
  days_of_week VARCHAR[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused', 'half-day')),
  marked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  marked_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(school_id, student_id, attendance_date)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('bell', 'attendance', 'alert', 'reminder', 'system')),
  is_read BOOLEAN DEFAULT false,
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('attendance', 'performance', 'summary', 'custom')),
  title VARCHAR(255) NOT NULL,
  class_name VARCHAR(50),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  data JSONB,
  generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_name);
CREATE INDEX IF NOT EXISTS idx_attendance_school_id ON attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_schedules_school_id ON schedules(school_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_school_id ON notifications(school_id);
CREATE INDEX IF NOT EXISTS idx_reports_school_id ON reports(school_id);

-- Row Level Security (RLS) Policies
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "schools_public_read" ON schools FOR SELECT USING (true);
CREATE POLICY "schools_admin_write" ON schools FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
CREATE POLICY "schools_admin_update" ON schools FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin' AND school_id = schools.id)
);

-- RLS Policies for users
CREATE POLICY "users_school_read" ON users FOR SELECT USING (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "users_self_read" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_admin_write" ON users FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin' AND school_id = (SELECT school_id FROM users WHERE id = auth.uid()))
);

-- RLS Policies for students
CREATE POLICY "students_school_read" ON students FOR SELECT USING (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "students_teacher_write" ON students FOR UPDATE USING (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid()) AND 
  auth.uid() IN (SELECT id FROM users WHERE role IN ('teacher', 'coordinator', 'admin'))
);

-- RLS Policies for attendance
CREATE POLICY "attendance_school_read" ON attendance FOR SELECT USING (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "attendance_teacher_write" ON attendance FOR INSERT WITH CHECK (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid()) AND
  auth.uid() IN (SELECT id FROM users WHERE role IN ('teacher', 'coordinator', 'admin'))
);
CREATE POLICY "attendance_teacher_update" ON attendance FOR UPDATE USING (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid()) AND
  auth.uid() IN (SELECT id FROM users WHERE role IN ('teacher', 'coordinator', 'admin'))
);

-- RLS Policies for schedules
CREATE POLICY "schedules_school_read" ON schedules FOR SELECT USING (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "schedules_admin_write" ON schedules FOR INSERT WITH CHECK (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid()) AND
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);

-- RLS Policies for notifications
CREATE POLICY "notifications_user_read" ON notifications FOR SELECT USING (
  user_id = auth.uid() OR 
  school_id = (SELECT school_id FROM users WHERE id = auth.uid())
);

-- RLS Policies for reports
CREATE POLICY "reports_school_read" ON reports FOR SELECT USING (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid())
);
CREATE POLICY "reports_teacher_write" ON reports FOR INSERT WITH CHECK (
  school_id = (SELECT school_id FROM users WHERE id = auth.uid()) AND
  auth.uid() IN (SELECT id FROM users WHERE role IN ('teacher', 'coordinator', 'admin'))
);
