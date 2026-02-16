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
exports.authController = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY, {
            auth: {
                persistSession: false,
                detectSessionInUrl: false,
                autoRefreshToken: false,
            },
        });
        const { data, error } = yield supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error || !data.session) {
            return res.status(400).json({ error: (error === null || error === void 0 ? void 0 : error.message) || "Login failed" });
        }
        return res.status(200).json({
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { error } = yield req.supabase.auth.signOut();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.authController = {
    login,
    logout,
};
