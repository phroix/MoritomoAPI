import { Request } from "express";
import type { SupabaseClient } from '@supabase/supabase-js';

export type ReqWithSupabase = Request & {
  supabase: SupabaseClient;
  user?: any;
};
