import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://placeholder.supabase.co'
);

// Instantiate Supabase client directly using environment variables
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false, // Disables localStorage session persistence as required
      autoRefreshToken: true,
    },
  }
);

export function getSupabaseClient(): SupabaseClient {
  return supabase;
}
