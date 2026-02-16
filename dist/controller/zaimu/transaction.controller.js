"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            query = query.eq("date", date);
        }
        if (type === "monthly" && keepDataBoolean) {
            query = query.eq("overview_id", Number(id));
        }
        if (type === "monthly" && !keepDataBoolean) {
            query = query.eq("overview_id", Number(id));
            query = query.eq("date", date);
        }
        // Sortiere nach created_at, neueste zuerst
        query = query.order("created_at", { ascending: true });
        const { data, error } = yield query;
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const getTransactionsAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            query = query.eq("date", date);
        }
        const { data, error } = yield query;
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = req.supabase;
        const body = req.body;
        let { data, error } = yield supabase
            .from("zaimu_transactions")
            .insert(body)
            .select();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        // data.created_at = new Date().toISOString();
        console.log(data);
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = req.supabase;
        const id = req.params.id;
        const body = req.body;
        const { data, error } = yield supabase
            .from("zaimu_transactions")
            .update(body)
            .eq("id", Number(id))
            .select();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = req.supabase;
        const id = req.params.id;
        const { data, error } = yield supabase
            .from("zaimu_transactions")
            .delete()
            .eq("id", Number(id))
            .select();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.transactionController = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};
