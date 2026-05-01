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
    console.log('1️⃣  Testing GET /api/health...');
    const health = await makeRequest('GET', '/api/health');
    console.log('Status:', health.status);
    console.log('Response:', health.data);
    
    console.log('\n2️⃣  Testing POST /api/auth/signup...');
    const signup = await makeRequest('POST', '/api/auth/signup', {
      email: `test-${Date.now()}@schoolbell.test`,
      password: 'TestPass123!',
      full_name: 'Test User'
    });
    console.log('Status:', signup.status);
    console.log('Response:', signup.data);
    
    if (signup.status === 201 || signup.status === 200) {
      console.log('✅ Signup endpoint is working!');
    } else {
      console.log('❌ Signup failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
