"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
// interface CustomJwtPayload extends JwtPayload {
//   user_metadata?: {
//     role?: string;
//     isAsignedToKebap?: boolean;
//   };
// }
const authMiddleware = (req, res, next) => {
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
            if (err || !decoded) {
                res.status(401).json({ error: "Ungültiges oder abgelaufenes Token" });
                return;
            }
            // const payload = decoded as CustomJwtPayload;
            // if (
            //   payload.user_metadata?.role === "owner" &&
            //   !payload.user_metadata?.isAsignedToKebap
            // ) {
            //   res.status(401).json({ error: "Nicht berechtigt" });
            //   return;
            // }
            next();
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error in authMiddleware" });
    }
};
exports.default = authMiddleware;
