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
      query = query.eq("overview_id", Number(id));
      query = query.eq("date", date as string);
    }

    if (type === "monthly" && keepDataBoolean) {
      query = query.eq("overview_id", Number(id));
    }

    if (type === "monthly" && !keepDataBoolean) {
      query = query.eq("overview_id", Number(id));
      query = query.eq("date", date as string);
    }

    // Sortiere nach created_at, neueste zuerst
    query = query.order("created_at", { ascending: true });

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
      query = query.eq("overview_id", Number(overview_id));
    }
    if (date) {
      query = query.eq("date", date as string);
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

    let { data, error } = await supabase
      .from("zaimu_transactions")
      .insert(body)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // data.created_at = new Date().toISOString();
    console.log(data);

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
      .eq("id", Number(id))
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
      .eq("id", Number(id))
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
