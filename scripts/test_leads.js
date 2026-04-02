require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testInsert() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // We need to act as a user, or we won't pass RLS.
  // Actually, since we are using anon key without auth, we can't insert due to RLS!
  // BUT the web app uses SSR auth! Let me just try to select workspaces to get an idea if leads table exists.
  
  // So instead, let me use service_role key to bypass RLS and see if the 'leads' table actually exists.
  // Wait, I don't have service_role, only anon key... 
  // Let me just check if the leads table exists by ignoring RLS via REST API or catching the specific error.

  const { data, error } = await supabase.from('leads').select('*').limit(1);
  console.log("Error:", error);
}

testInsert();
