import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { query } from "../config/database";
import { sendContactEmail } from "../config/email";

const router = Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    try {
      // 1️⃣ Save to DB
      await query(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)",
        [name, email, subject, message]
      );

      // 2️⃣ Send email via Resend
      await sendContactEmail({ name, email, subject, message });

      console.log("✅ Contact form submitted and email sent");

      return res.status(201).json({
        success: true,
        message:
          "Message sent successfully. Check your inbox for confirmation.",
      });
    } catch (error: any) {
      console.error("❌ Contact form error:", error.message || error);
      return res.status(500).json({
        success: false,
        error: "Failed to send message. Please try again later.",
      });
    }
  }
);

export default router;
