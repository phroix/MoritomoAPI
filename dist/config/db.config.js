"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.supabaseAdmin = exports.supabaseAdminKey = exports.supabaseKey = exports.supabaseUrl = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
exports.supabaseUrl = "https://supabase.philroth.com";
// export const supabaseUrl = "http://127.0.0.1:54321"; //local
// const SUPABASE_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhud3NpcXBvdGV6a2h3b2Rmb3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NTY3NjcsImV4cCI6MjA1MTUzMjc2N30.APkMCWnkb14e8XMDvwruPUiqr_GhlUmMJUnygpZw8-c";
// const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'
exports.supabaseKey = process.env.SUPABASE_KEY || "";
exports.supabaseAdminKey = process.env.SUPABASE_ADMIN_KEY || "";
const options = {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
};
const supabase = (0, supabase_js_1.createClient)(exports.supabaseUrl, exports.supabaseKey, options);
exports.supabase = supabase;
const supabaseAdmin = (0, supabase_js_1.createClient)(exports.supabaseUrl, exports.supabaseAdminKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
exports.supabaseAdmin = supabaseAdmin;
