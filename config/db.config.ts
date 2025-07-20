import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://supabase.philroth.com";
// export const supabaseUrl = "http://127.0.0.1:54321"; //local
// const SUPABASE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhud3NpcXBvdGV6a2h3b2Rmb3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NTY3NjcsImV4cCI6MjA1MTUzMjc2N30.APkMCWnkb14e8XMDvwruPUiqr_GhlUmMJUnygpZw8-c";
// const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'
export const supabaseKey = process.env.SUPABASE_KEY || "";
export const supabaseAdminKey = process.env.SUPABASE_ADMIN_KEY || "";

const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};
const supabase = createClient(supabaseUrl, supabaseKey, options);

const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export { supabaseAdmin, supabase };
