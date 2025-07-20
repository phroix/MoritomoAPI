import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

interface CustomJwtPayload extends JwtPayload {
  user_metadata?: {
    role?: string;
  };
}

const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded) {
        res.status(401).json({ error: "Ungültiges oder abgelaufenes Token" });
        return;
      }

      const payload = decoded as CustomJwtPayload;

      if (payload.user_metadata?.role !== "admin") {
        return res.status(403).json({ error: "Nicht berechtigt" });
      }

      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Error in authMiddleware" });
  }
};

export default adminAuthMiddleware;
