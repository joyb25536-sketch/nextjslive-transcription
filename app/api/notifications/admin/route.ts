import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, applicantName, applicantEmail, experience, city } = body;

  if (!type) {
    return NextResponse.json({ message: 'Invalid notification' }, { status: 400 });
  }

  // For localhost, just log the notification
  // In production, this would send via Twilio + email
  console.log(`[NOTIFICATION] ${type}:`, {
    applicantName,
    applicantEmail,
    experience,
    city,
    timestamp: new Date().toISOString(),
  });

  // Simulate sending to admin
  // In production:
  // await sendEmail(ADMIN_EMAIL, `New ${type}`, ...);
  // await sendSms(ADMIN_PHONE, `New ${type}: ${applicantName}`);

  return NextResponse.json({ message: 'Notification sent' }, { status: 200 });
}
