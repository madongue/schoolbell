const express = require('express');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

console.log('=== SUPABASE DIAGNOSTICS ===\n');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
console.log('Key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('\n=== TESTING CONNECTION ===\n');

// Test 1: Direct query
(async () => {
  try {
    console.log('Test 1: Fetching from schools table...');
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error);
    } else {
      console.log('✅ Success! Got data:', data);
    }
  } catch (e) {
    console.log('❌ Exception:', e.message);
  }

  // Test 2: Check auth
  try {
    console.log('\nTest 2: Testing auth admin...');
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Error:', error);
    } else {
      console.log('✅ Success! Users:', data?.users?.length || 0);
    }
  } catch (e) {
    console.log('❌ Exception:', e.message);
  }

  process.exit(0);
})();
