import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
const secret = process.env.JWT_SECRET;

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!secret) {
    res.status(500).json({ error: "JWT secret is not configured" });
    return;
  }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded) {
        res.status(401).json({ error: "Ungültiges oder abgelaufenes Token" });
        return;
      }

      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Error in authMiddleware" });
  }
};

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

export async function withSupabase(
  req: any,
  _res: Response,
  next: NextFunction
) {
  const access = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const refresh = req.headers["x-refresh-token"] as string | undefined;

  const client = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
    global: access
      ? { headers: { Authorization: `Bearer ${access}` } }
      : undefined,
  });

  if (access && refresh) {
    const { data, error } = await client.auth.setSession({
      access_token: access,
      refresh_token: refresh,
    });
    if (error) {
      console.warn("setSession failed:", error.message);
    }
  }

  req.supabase = client;
  next();
}

export default authMiddleware;
