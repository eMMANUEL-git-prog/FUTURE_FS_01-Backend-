import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactData) => {
  try {
    // Send to YOU (portfolio owner)
    await resend.emails.send({
      from: `${process.env.SITE_NAME} <${process.env.FROM_EMAIL}>`,
      to: process.env.EMAIL_RECIPIENT!,
      replyTo: data.email, // user’s email so you can reply directly
      subject: `New Contact Message: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    // Optional: Auto-reply to sender
    await resend.emails.send({
      from: `${process.env.SITE_NAME} <${process.env.FROM_EMAIL}>`,
      to: data.email,
      subject: `Thanks for contacting ${process.env.SITE_NAME}!`,
      html: `
        <p>Hi ${data.name},</p>
        <p>Thanks for reaching out! I’ve received your message and will get back to you shortly.</p>
        <br/>
        <p>Best regards,<br/>${process.env.SITE_NAME}</p>
      `,
    });

    console.log("✅ Emails sent successfully via Resend.");
  } catch (error) {
    console.error("❌ Error sending email via Resend:", error);
    throw new Error("Failed to send email");
  }
};
