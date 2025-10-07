// src/routes/auth.routes.ts
import express from "express";
import { query } from "../config/database";
import { verifyPassword, signToken } from "../config/auth";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";


const router = express.Router();

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Find user by email
      const result = await query(
        "SELECT id, email, password_hash, name FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = result.rows[0];

      // Verify password
      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = signToken({
        userId: user.id,
        email: user.email,
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
