import { NextResponse } from 'next/server';
import { getLocation } from '../../../lib/database';

export async function GET() {
  try {
    const loc = await getLocation();
    const location = loc ? `${loc.city} - ${loc.address}` : 'Chicago, IL';
    return NextResponse.json({ location });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json({ location: 'Chicago, IL' });
  }
}
