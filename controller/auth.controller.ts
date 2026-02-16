import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import { ReqWithSupabase } from "../types/SupabaseClient";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(400).json({ error: error?.message || "Login failed" });
    }

    return res.status(200).json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req: ReqWithSupabase, res: Response) => {
  try {
    let { error } = await req.supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const authController = {
  login,
  logout,
};
