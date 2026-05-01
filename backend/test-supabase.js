const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Creating Supabase client with:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test 1: Simple health check
console.log('\n--- Test 1: Checking Supabase connection ---');
(async () => {
  try {
    const { data, error } = await supabase.from('schools').select('count', { count: 'exact' }).limit(1);
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Database connection successful!');
      console.log('Schools table count:', data ? data.length : 0);
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }

  // Test 2: Auth admin
  console.log('\n--- Test 2: Testing auth admin ---');
  try {
    const { data: users, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Auth Error:', authError);
    } else {
      console.log('✅ Auth admin successful!');
      console.log('Total users:', users ? users.users.length : 0);
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }

  // Test 3: Create a test user
  console.log('\n--- Test 3: Creating test user ---');
  const testEmail = `test-${Date.now()}@schoolbell.test`;
  try {
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
    });
    if (createError) {
      console.error('❌ Create Error:', createError);
    } else {
      console.log('✅ User created successfully!');
      console.log('User ID:', user.user.id);
      
      // Clean up
      await supabase.auth.admin.deleteUser(user.user.id);
      console.log('✅ Test user deleted');
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
})();
