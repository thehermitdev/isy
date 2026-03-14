/// <reference types="node" />
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: signInData, error: signInError } = await supabasePublic.auth.signInWithPassword({
    email: 'admin@crm.com',
    password: 'password123',
  });

  if (signInError) {
    console.error('Sign In Error:', signInError);
    return;
  }

  const token = signInData.session?.access_token || '';
  console.log('Token created:', token.substring(0, 20));

  const { data: userData, error: getUserError } = await supabasePublic.auth.getUser(token);
  if (getUserError) {
    console.error('Get User Error:', getUserError);
  } else {
    console.log('User fetched OK:', userData.user?.id);
  }
}

main();
