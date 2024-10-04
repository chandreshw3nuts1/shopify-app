import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export async function sendEmail({to, subject, html, fromName, replyTo="" }) {

  const mailOptions = {
    from: `${fromName} <${process.env.EMAIL_USER}>`, // Custom name and email
    to,
    subject,
    html,
    replyTo 
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, error };
  }
}
