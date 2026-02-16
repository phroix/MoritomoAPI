import { Request, Response } from "express";
import { ReqWithSupabase } from "../../types/SupabaseClient";

const getOverviews = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const { date, user_id, from, to } = req.query;

    const filterTypeMonthly = "monthly";
    const filterTypeOnce = "once";

    const { data, error } = await supabase
      .from("zaimu_overviews")
      .select("*")
      .eq("user_id", user_id)
      .or(
        `type.eq.${filterTypeMonthly},and(type.eq.${filterTypeOnce},date.eq.${date})`
      )
      .range(Number(from), Number(to));

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOverviewAmount = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;
    const { date, id, keep_data, type } = req.query;
    const keepDataBoolean = keep_data === "true";
    let totalAmount = 0;

    // for (const overview of overviews) {
    let query = supabase.from("zaimu_transactions").select("amount,type");

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
      console.error("Error loading transactions:", error.message);
      return res.status(400).json({ error: error.message });
    }

    const subtotal =
      data?.reduce((acc, curr) => {
        return acc + (curr.type === "positive" ? curr.amount : -curr.amount);
      }, 0) ?? 0;

    totalAmount += subtotal;

    return res.status(200).json(totalAmount);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createOverview = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const body = req.body;

    const { data, error } = await supabase
      .from("zaimu_overviews")
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

const updateOverview = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const id = req.params.id;
    const body = req.body;

    const { data, error } = await supabase
      .from("zaimu_overviews")
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

const deleteOverview = async (req: ReqWithSupabase, res: Response) => {
  try {
    const supabase = req.supabase;

    const id = req.params.id;

    const { data, error } = await supabase
      .from("zaimu_overviews")
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

export const overviewController = {
  getOverviews,
  getOverviewAmount,
  createOverview,
  updateOverview,
  deleteOverview,
};
