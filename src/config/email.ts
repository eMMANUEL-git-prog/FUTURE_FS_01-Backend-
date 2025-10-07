import nodemailer from "nodemailer";

// Create reusable transporter
export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send contact form email
export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const transporter = createEmailTransporter();

  // 1️⃣ Email to YOU (admin)
  const adminMail = {
    from: `"${data.name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
    replyTo: data.email,
    subject: `Portfolio Contact: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      </div>
    `,
  };

  await transporter.sendMail(adminMail);

  // 2️⃣ Auto-reply to the sender
  const confirmationMail = {
    from: `"${process.env.SITE_NAME || "Emmanuel"}" <${
      process.env.EMAIL_USER
    }>`,
    to: data.email,
    subject: `Thanks for reaching out, ${data.name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thank you for your message!</h2>
        <p>Hi ${data.name},</p>
        <p>I've received your message about "<strong>${
          data.subject
        }</strong>" and will get back to you shortly.</p>
        <p>Here’s a copy of what you sent:</p>
        <blockquote style="border-left: 4px solid #2563eb; padding-left: 12px; color: #555;">
          ${data.message.replace(/\n/g, "<br>")}
        </blockquote>
        <p>Best regards,<br><strong>${
          process.env.SITE_NAME || "Emmanuel"
        }</strong></p>
        <p style="font-size: 12px; color: #888;">This is an automated confirmation message.</p>
      </div>
    `,
  };

  await transporter.sendMail(confirmationMail);
};
