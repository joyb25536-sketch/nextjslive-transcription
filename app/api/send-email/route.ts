import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('send-email body:', body);
    const { name, email, phone, date, time } = body;

    const { data, error } = await resend.emails.send({
      from: 'MedHelp Alerts <onboarding@resend.dev>',
      to: ['joyb25536@gmail.com'],
      subject: `New Appointment: ${name}`,
      text: `
        You have a new booking request!

        Customer Details:
        - Name: ${name}
        - Email: ${email}
        - Phone: ${phone}

        Appointment Details:
        - Date: ${date}
        - Time: ${time}

        Please contact the client to confirm.
      `,
    });

    if (error) {
      console.error('Resend send error:', error);
      return NextResponse.json({ error: 'Resend failed to send email', details: error }, { status: 500 });
    }

    console.log('send-email success:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}