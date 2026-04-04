import { NextResponse } from 'next/server';
import { getAppointments } from '../../../../lib/database';

export async function GET() {
  try {
    const appointments = await getAppointments();

    const booked = (appointments || []).reduce((acc, item) => {
      if (!item.date || !item.time) return acc;
      acc[item.date] = [...(acc[item.date] || []), item.time];
      return acc;
    }, {} as Record<string, string[]>);

    return NextResponse.json({ booked, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ booked: {}, appointments: [] });
  }
}
