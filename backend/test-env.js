const dotenv = require('dotenv');
const path = require('path');

// Explicitly load from the backend directory
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('✅ .env loaded successfully');
}

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check for any hidden characters
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log('First 20 chars:', key.substring(0, 20));
  console.log('Last 10 chars:', key.substring(key.length - 10));
  console.log('Contains space:', key.includes(' '));
  console.log('Char codes:', Array.from(key).slice(0, 10).map((c, i) => `[${i}]=${c}(${c.charCodeAt(0)})`));
}
