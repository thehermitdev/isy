import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Admin client for server-side operations
export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRole,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Public client for token validation (uses anon key)
export const supabasePublic = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
