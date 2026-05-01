const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  // Create a test school
  const { data: schoolData, error: schoolError } = await supabase
    .from('schools')
    .insert([
      {
        name: 'Test School',
        address: '123 Main St',
        email: 'test@school.com',
        phone: '555-0000',
        principal_name: 'John Doe',
        establishment_year: 2020,
        status: 'active'
      }
    ])
    .select();

  if (schoolError) {
    console.error('School creation error:', schoolError);
  } else {
    console.log('School created:', schoolData[0]);
    console.log('School ID:', schoolData[0].id);
    
    // Now test signup with this school
    console.log('\nTesting signup with school_id...');
    const email = `test-${Date.now()}@schoolbell.test`;
    const { data: signupData, error: signupError } = await supabase.auth.admin.createUser({
      email,
      password: 'TestPass123!',
      email_confirm: true,
    });

    if (signupError) {
      console.error('Auth user creation error:', signupError);
    } else {
      console.log('Auth user created:', signupData.user.id);

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: signupData.user.id,
            email,
            full_name: 'Test User',
            school_id: schoolData[0].id,
            role: 'teacher',
          },
        ])
        .select();

      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        console.log('✅ User profile created successfully!');
        console.log('Profile:', profileData[0]);
      }
    }
  }
})();
