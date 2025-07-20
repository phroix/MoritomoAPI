"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
const adminAuthMiddleware = (req, res, next) => {
    if (!secret) {
        res.status(500).json({ error: "JWT secret is not configured" });
        return;
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: "Kein Token übermittelt" });
            return;
        }
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            var _a;
            if (err || !decoded) {
                res.status(401).json({ error: "Ungültiges oder abgelaufenes Token" });
                return;
            }
            const payload = decoded;
            if (((_a = payload.user_metadata) === null || _a === void 0 ? void 0 : _a.role) !== "admin") {
                return res.status(403).json({ error: "Nicht berechtigt" });
            }
            next();
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error in authMiddleware" });
    }
};
exports.default = adminAuthMiddleware;
