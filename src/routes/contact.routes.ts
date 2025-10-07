import { Router } from "express";
import { query } from "../config/database";
import { sendContactEmail } from "../config/email"; // ✅ add this
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = Router();

// POST /api/contact - Submit contact form
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, subject, message } = req.body;

      // 1️⃣ Save to DB
      await query(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
        [name, email, subject, message]
      );

      // 2️⃣ Send Email
      await sendContactEmail({ name, email, subject, message });

      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);

export default router;
