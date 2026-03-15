import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Validate that supabaseUrl is an actual URL, otherwise fallback to prevent hard crash
try {
  new URL(supabaseUrl);
} catch (e) {
  // If it's not a valid URL (like user pasting a key instead of URL), fallback to a dummy URL
  supabaseUrl = "https://dummy-url-prevent-crash.supabase.co";
}

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
