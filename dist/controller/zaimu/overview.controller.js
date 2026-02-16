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
exports.overviewController = void 0;
const getOverviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = req.supabase;
        const { date, user_id, from, to } = req.query;
        const filterTypeMonthly = "monthly";
        const filterTypeOnce = "once";
        const { data, error } = yield supabase
            .from("zaimu_overviews")
            .select("*")
            .eq("user_id", user_id)
            .or(`type.eq.${filterTypeMonthly},and(type.eq.${filterTypeOnce},date.eq.${date})`)
            .range(Number(from), Number(to));
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const getOverviewAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const supabase = req.supabase;
        const { date, id, keep_data, type } = req.query;
        const keepDataBoolean = keep_data === "true";
        let totalAmount = 0;
        const { data: overviewData, error: overviewError } = yield supabase.from("zaimu_overviews").select("multi").eq("id", Number(id));
        // for (const overview of overviews) {
        let query = supabase.from("zaimu_transactions").select("amount,type");
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
        const { data, error } = yield query;
        if (error) {
            console.error("Error loading transactions:", error.message);
            return res.status(400).json({ error: error.message });
        }
        const subtotal = (_a = data === null || data === void 0 ? void 0 : data.reduce((acc, curr) => {
            return acc + (curr.type === "positive" ? curr.amount : -curr.amount);
        }, 0)) !== null && _a !== void 0 ? _a : 0;
        totalAmount += subtotal;
        let paidAmmount = totalAmount * ((_c = (_b = overviewData === null || overviewData === void 0 ? void 0 : overviewData[0]) === null || _b === void 0 ? void 0 : _b.multi) !== null && _c !== void 0 ? _c : 1);
        return res.status(200).json({ totalAmount, paidAmmount });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const createOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = req.supabase;
        const body = req.body;
        const { data, error } = yield supabase
            .from("zaimu_overviews")
            .insert(body)
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
const updateOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = req.supabase;
        const id = req.params.id;
        const body = req.body;
        const { data, error } = yield supabase
            .from("zaimu_overviews")
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
const deleteOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supabase = req.supabase;
        const id = req.params.id;
        const { data, error } = yield supabase
            .from("zaimu_overviews")
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
exports.overviewController = {
    getOverviews,
    getOverviewAmount,
    createOverview,
    updateOverview,
    deleteOverview,
};
