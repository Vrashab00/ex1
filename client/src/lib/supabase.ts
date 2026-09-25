import { createClient } from '@supabase/supabase-js';

// Retrieve credentials securely from Vite environment variables - never hardcoded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Warning: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in environment variables. Please check your .env file.'
  );
}

// Safe fallback client if environment variables are not yet configured
const clientUrl = supabaseUrl || 'https://placeholder.supabase.co';
const clientKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
