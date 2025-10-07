import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../config/auth"

export interface AuthRequest extends Request {
  user?: {
    userId: number
    email: string
  }
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return res.status(403).json({ error: "Invalid or expired token" })
  }

  req.user = payload
  next()
}
