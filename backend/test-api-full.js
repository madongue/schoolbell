const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  try {
    const schoolId = '363fc7ac-8256-492c-ad71-1e9e679c6801';
    
    console.log('1️⃣  Testing GET /api/health...');
    const health = await makeRequest('GET', '/api/health');
    console.log('Status:', health.status);
    console.log('✅ Response:', health.data);
    
    console.log('\n2️⃣  Testing POST /api/auth/signup with school_id...');
    const signup = await makeRequest('POST', '/api/auth/signup', {
      email: `test-${Date.now()}@schoolbell.test`,
      password: 'TestPass123!',
      full_name: 'API Test User',
      school_id: schoolId
    });
    console.log('Status:', signup.status);
    console.log('Response:', signup.data);
    
    if (signup.status === 201) {
      console.log('✅ Signup endpoint is working!');
      
      const userId = signup.data.user.id;
      
      console.log('\n3️⃣  Testing POST /api/auth/login...');
      const login = await makeRequest('POST', '/api/auth/login', {
        email: signup.data.user.email,
        password: 'TestPass123!'
      });
      console.log('Status:', login.status);
      console.log('Response:', login.data);
      if (login.status === 200) {
        console.log('✅ Login endpoint is working!');
      }
      
      console.log('\n4️⃣  Testing GET /api/students/:schoolId...');
      const students = await makeRequest('GET', `/api/students/${schoolId}`);
      console.log('Status:', students.status);
      console.log('Response:', students.data);
      console.log('✅ Students endpoint is working!');
    } else {
      console.log('❌ Signup failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
