import { Request } from "express";
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export type ReqWithSupabase = Request & {
  supabase: SupabaseClient<Database>;
  user?: any;
};
