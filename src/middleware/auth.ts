import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
    kakaoId: string;
  };
}

export const requireUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      message: "Access token required",
      status: 401,
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired token",
      status: 403,
    });
    return;
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      message: "Access token required",
      status: 401,
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    
    if (decoded.role !== "ADMIN") {
      res.status(403).json({
        message: "Admin access required",
        status: 403,
      });
      return;
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired token",
      status: 403,
    });
    return;
  }
}; 