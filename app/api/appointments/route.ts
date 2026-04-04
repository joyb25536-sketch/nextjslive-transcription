import { NextRequest, NextResponse } from 'next/server';
import { getAppointments, addAppointment } from '../../../lib/database';

export async function GET() {
  return NextResponse.json({ message: 'Use /availability or /book' }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;
  if (path.endsWith('/availability')) {
    const appointments = getAppointments();
    const booked = appointments.reduce((acc, item) => {
      if (!item.date || !item.time) return acc;
      acc[item.date] = [...(acc[item.date] || []), item.time];
      return acc;
    }, {} as Record<string, string[]>);
    return NextResponse.json({ booked });
  }
  if (path.endsWith('/book')) {
    const body = await req.json();
    const { name, email, phone, serviceType, notes, date, time } = body;

    if (!name || !email || !phone || !serviceType || !date || !time) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const appointments = getAppointments();
    const conflict = appointments.find(apt => apt.date === date && apt.time === time);

    if (conflict) {
      return NextResponse.json({ message: 'Slot already booked' }, { status: 409 });
    }

    const newAppointment = addAppointment({ name, email, phone, service_type: serviceType, notes, date, time });
    // TODO: call Twilio + Google Calendar sync and email.
    return NextResponse.json({ appointment: newAppointment, message: 'Booked' }, { status: 201 });
  }

  return NextResponse.json({ message: 'Endpoint not found' }, { status: 404 });
}
