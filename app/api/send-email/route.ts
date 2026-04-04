import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[send-email] Received body:', JSON.stringify(body, null, 2));

    const { name, email, phone, date, time } = body;

    if (!name || !email || !date || !time) {
      console.error('[send-email] Missing required fields:', { name, email, date, time });
      return NextResponse.json(
        { error: 'Missing required fields: name, email, date, time' },
        { status: 400 }
      );
    }

    console.log('[send-email] Sending email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'MedHelp Alerts <onboarding@resend.dev>',
      to: 'paola929medhelp@gmail.com',
      subject: `New Appointment: ${name}`,
      text: `You have a new booking request!

Customer Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Appointment Details:
- Date: ${date}
- Time: ${time}

Please contact the client to confirm.`,
    });

    if (error) {
      console.error('[send-email] Resend error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { success: false, error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    console.log('[send-email] Email sent successfully:', data);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[send-email] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}