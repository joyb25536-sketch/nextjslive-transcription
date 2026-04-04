import { NextRequest, NextResponse } from 'next/server';
import { getAppointments, addAppointment } from '../../../lib/database';

export async function GET() {
  try {
    const appointments = await getAppointments();
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ appointments: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;
  
  if (path.endsWith('/availability')) {
    try {
      const appointments = await getAppointments();
      const booked = appointments.reduce((acc, item) => {
        if (!item.date || !item.time) return acc;
        acc[item.date] = [...(acc[item.date] || []), item.time];
        return acc;
      }, {} as Record<string, string[]>);
      return NextResponse.json({ booked, appointments });
    } catch (error) {
      console.error('Error fetching availability:', error);
      return NextResponse.json({ booked: {}, appointments: [] });
    }
  }
  
  if (path.endsWith('/book')) {
    try {
      const body = await req.json();
      const { name, email, phone, serviceType, notes, date, time, timezone } = body;

      if (!name || !email || !phone || !serviceType || !date || !time) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }

      const appointments = await getAppointments();
      let conflict = appointments.find(apt => apt.date === date && apt.time === time);

      if (conflict) {
        return NextResponse.json({ message: 'Slot already booked' }, { status: 409 });
      }

      const newAppointment = await addAppointment({ 
        name, 
        email, 
        phone, 
        service_type: serviceType, 
        notes, 
        date, 
        time,
        timezone 
      });
      
      return NextResponse.json({ appointment: newAppointment, message: 'Booked' }, { status: 201 });
    } catch (error) {
      console.error('Error booking appointment:', error);
      return NextResponse.json({ message: 'Failed to book appointment' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Endpoint not found' }, { status: 404 });
}
