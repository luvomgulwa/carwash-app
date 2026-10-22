// This file creates one Supabase connection that the whole app can share.
// Use it in other files like this:
//   import { supabase } from "@/lib/supabase";

import { createClient } from "@supabase/supabase-js";

// Read the Supabase address and public key from .env.local.
// They start with NEXT_PUBLIC_ so they also work in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Stop with a clear message if the values are missing.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase settings. Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart the dev server."
  );
}

// The connection to your Supabase project.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
