const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SchoolBell Backend is running' });
});

// === AUTH ROUTES ===
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name, school_id } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create user via Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email,
          full_name,
          school_id: school_id || null,
          role: 'teacher',
        },
      ]);

    if (profileError) throw profileError;

    res.status(201).json({
      message: 'User created successfully',
      user: { id: data.user.id, email, full_name },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      message: 'Login successful',
      token: data.session.access_token,
      user: profile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

// === STUDENTS ROUTES ===
app.get('/api/students/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', schoolId)
      .eq('status', 'active');

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const {
      school_id,
      roll_number,
      first_name,
      last_name,
      date_of_birth,
      email,
      class_name,
    } = req.body;

    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          school_id,
          roll_number,
          first_name,
          last_name,
          date_of_birth,
          email,
          class_name,
          status: 'active',
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: error.message });
  }
});

// === SCHEDULES ROUTES ===
app.get('/api/schedules/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('school_id', schoolId)
      .eq('is_active', true);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/schedules', async (req, res) => {
  try {
    const {
      school_id,
      name,
      description,
      start_time,
      end_time,
      bell_type,
      days_of_week,
      created_by,
    } = req.body;

    const { data, error } = await supabase
      .from('schedules')
      .insert([
        {
          school_id,
          name,
          description,
          start_time,
          end_time,
          bell_type,
          days_of_week,
          created_by,
          is_active: true,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// === ATTENDANCE ROUTES ===
app.get('/api/attendance/:schoolId/:studentId', async (req, res) => {
  try {
    const { schoolId, studentId } = req.params;

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('school_id', schoolId)
      .eq('student_id', studentId)
      .order('attendance_date', { ascending: false })
      .limit(30);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { school_id, student_id, attendance_date, status, marked_by, notes } =
      req.body;

    const { data, error } = await supabase
      .from('attendance')
      .insert([
        {
          school_id,
          student_id,
          attendance_date,
          status,
          marked_by,
          notes,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/daily/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { date } = req.query;

    let query = supabase
      .from('attendance')
      .select('*')
      .eq('school_id', schoolId);

    if (date) {
      query = query.eq('attendance_date', date);
    }

    const { data, error } = await query.order('marked_at', {
      ascending: false,
    });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching daily attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

// === REPORTS ROUTES ===
app.get('/api/reports/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: error.message });
  }
});

// === ERROR HANDLING ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SchoolBell Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
