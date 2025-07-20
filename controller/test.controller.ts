import { Request, Response } from "express";
import { supabase } from "../config/db.config";
import multer from "multer";

const getTest = async (req: Request, res: Response) => {
  try {
    let { data: test, error } = await supabase.from("test").select("*");
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ data: test });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createTest = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("test")
      .insert([{ created_at: new Date().toISOString() }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ data: data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const testController = {
  getTest,
  createTest,
};
