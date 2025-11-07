import { Request, Response } from "express";
import { ReqWithSupabase } from "../../types/SupabaseClient";

const getTransactions = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { date, id, from, to, keep_data, type } = req.query;
    const keepDataBoolean = keep_data === "true";

    let query = supabase
      .from("zaimu_transactions")
      .select("*")
      .range(Number(from), Number(to));

    if (type === "once") {
      query = query.eq("overview_id", id);
      query = query.eq("date", date);
    }

    if (type === "monthly" && keepDataBoolean) {
      query = query.eq("overview_id", id);
    }

    if (type === "monthly" && !keepDataBoolean) {
      query = query.eq("overview_id", id);
      query = query.eq("date", date);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getTransactionsAmount = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { date, overview_id, from, to } = req.query;

    let query = supabase
      .from("zaimu_transactions")
      .select("*")
      .range(Number(from), Number(to));

    if (overview_id) {
      query = query.eq("overview_id", overview_id);
    }
    if (date) {
      query = query.eq("date", date);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createTransaction = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const body = req.body;

    const { data, error } = await supabase
      .from("zaimu_transactions")
      .insert(body)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateTransaction = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const id = req.params.id;
    const body = req.body;

    const { data, error } = await supabase
      .from("zaimu_transactions")
      .update(body)
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTransaction = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const id = req.params.id;

    const { data, error } = await supabase
      .from("zaimu_transactions")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const transactionController = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
