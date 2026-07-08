
import { createClient } from '@supabase/supabase-js'
// or
// These come from .env.local (and, once deployed, from Vercel's
// Environment Variables settings too — see setup notes).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);