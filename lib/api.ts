const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Auth API calls
export const authApi = {
  async signup(email: string, password: string, full_name: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name }),
      });
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Signup failed' };
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  },
};

// Students API calls
export const studentsApi = {
  async getAll(schoolId: string) {
    try {
      const response = await fetch(`${API_URL}/api/students/${schoolId}`);
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch students' };
    }
  },

  async create(studentData: any) {
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to create student' };
    }
  },
};

// Schedules API calls
export const schedulesApi = {
  async getAll(schoolId: string) {
    try {
      const response = await fetch(`${API_URL}/api/schedules/${schoolId}`);
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch schedules' };
    }
  },

  async create(scheduleData: any) {
    try {
      const response = await fetch(`${API_URL}/api/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData),
      });
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to create schedule' };
    }
  },
};

// Attendance API calls
export const attendanceApi = {
  async getStudentAttendance(schoolId: string, studentId: string) {
    try {
      const response = await fetch(
        `${API_URL}/api/attendance/${schoolId}/${studentId}`
      );
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch attendance' };
    }
  },

  async getDailyAttendance(schoolId: string, date?: string) {
    try {
      const query = date ? `?date=${date}` : '';
      const response = await fetch(
        `${API_URL}/api/attendance/daily/${schoolId}${query}`
      );
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch daily attendance' };
    }
  },

  async mark(attendanceData: any) {
    try {
      const response = await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to mark attendance' };
    }
  },
};

// Reports API calls
export const reportsApi = {
  async getAll(schoolId: string) {
    try {
      const response = await fetch(`${API_URL}/api/reports/${schoolId}`);
      return await response.json();
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch reports' };
    }
  },
};

// Health check
export const apiHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return await response.json();
  } catch (error) {
    return { error: 'Backend unreachable' };
  }
};
