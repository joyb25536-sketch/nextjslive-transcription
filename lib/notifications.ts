import nodemailer from 'nodemailer';
import Twilio from 'twilio';

const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.SMTP_HOST) return;
  await transport.sendMail({
    from: process.env.SMTP_FROM_EMAIL || 'no-reply@medhelp.com',
    to,
    subject,
    text,
  });
}

export async function sendSms(to: string, body: string) {
  if (!twilioSid || !twilioToken || !twilioNumber) return;
  const client = Twilio(twilioSid, twilioToken);
  await client.messages.create({ from: twilioNumber, to, body });
}
