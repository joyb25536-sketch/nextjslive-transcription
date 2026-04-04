import { NextRequest, NextResponse } from 'next/server';
import { fromZonedTime } from 'date-fns-tz';
import { parse } from 'date-fns';
import { sendEmail, sendSms } from '../../../../lib/notifications';
import { getAppointments, addAppointment } from '../../../../lib/database';

export async function POST(req: NextRequest) {

  const body = await req.json();
  const { name, email, phone, serviceType, notes, date, time, timezone = 'UTC' } = body;

  if (!name || !email || !phone || !serviceType || !date || !time) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  let appointmentUtc = null;
  try {
    const parsedLocal = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
    appointmentUtc = fromZonedTime(parsedLocal, timezone).toISOString();
  } catch (err) {
    // fallback to UTC if invalid timezone
    appointmentUtc = new Date(`${date}T${time}:00Z`).toISOString();
  }

  // conflict check first by unified UTC field, then by date + time
  const appointments = await getAppointments();
  let conflict = appointments.find(apt => apt.appointment_utc === appointmentUtc);
  if (!conflict) {
    conflict = appointments.find(apt => apt.date === date && apt.time === time);
  }

  if (conflict) {
    return NextResponse.json({ message: 'Slot already booked' }, { status: 409 });
  }

  const appointmentPayload = {
    name,
    email,
    phone,
    service_type: serviceType,
    notes,
    date,
    time,
    timezone,
    appointment_utc: appointmentUtc,
  };

  const saved = await addAppointment(appointmentPayload);

  // Send email notification to consultant
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        date: saved.date,
        time: saved.time,
      }),
    });
  } catch (emailError) {
    console.error('Failed to send consultant email:', emailError);
    // Don't fail the booking if email fails
  }

  // Notification delivery (best-effort)
  const userSubject = `MedHelp Booking Confirmed: ${saved.service_type || saved.serviceType}`;
  const userBody = `Hi ${saved.name},\n\nYour appointment is confirmed for ${saved.date} at ${saved.time} (${timezone}).\n\nSee you soon!`; 

  const adminNumber = process.env.ADMIN_SMS_NUMBER;
  const adminEmail = process.env.ADMIN_EMAIL;

  Promise.all([
    sendEmail(saved.email, userSubject, userBody).catch(() => null),
    adminEmail ? sendEmail(adminEmail, `New Booking: ${saved.name}`, `${saved.name} booked ${saved.service_type || saved.serviceType} on ${saved.date} ${saved.time}`) : Promise.resolve(null),
    adminNumber ? sendSms(adminNumber, `New booking: ${saved.name} ${saved.service_type || saved.serviceType} ${saved.date} ${saved.time}`) : Promise.resolve(null),
    sendSms(saved.phone, `MedHelp booking confirmed for ${saved.date} at ${saved.time} (${timezone})`).catch(() => null),
  ]).catch(() => null);

  return NextResponse.json({ appointment: saved, message: 'Booked' }, { status: 201 });
}
