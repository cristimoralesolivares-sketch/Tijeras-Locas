import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
export const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. Running in local offline mode.'
  );
}

// Provide generic safe placeholders to avoid library throwing "supabaseUrl is required" on export load
const activeUrl = isSupabaseConfigured ? supabaseUrl : 'https://dummy-placeholder-project.supabase.co';
const activeKey = isSupabaseConfigured ? supabaseAnonKey : 'dummy-key';

export const supabase = createClient(activeUrl, activeKey);

