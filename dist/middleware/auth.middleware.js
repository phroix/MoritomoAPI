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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withSupabase = withSupabase;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabase_js_1 = require("@supabase/supabase-js");
const secret = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
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
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err || !decoded) {
                res.status(401).json({ error: "Ungültiges oder abgelaufenes Token" });
                return;
            }
            next();
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error in authMiddleware" });
    }
};
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
function withSupabase(req, _res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const access = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace(/^Bearer\s+/i, "");
        const refresh = req.headers["x-refresh-token"];
        const client = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY, {
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
            const { data, error } = yield client.auth.setSession({
                access_token: access,
                refresh_token: refresh,
            });
            if (error) {
                console.warn("setSession failed:", error.message);
            }
        }
        req.supabase = client;
        next();
    });
}
exports.default = authMiddleware;
