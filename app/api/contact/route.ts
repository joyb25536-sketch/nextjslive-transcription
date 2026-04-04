import { NextRequest, NextResponse } from 'next/server';
import { addContact } from '../../../lib/database';

export async function POST(req: NextRequest) {
  const { name, email, phone, message } = await req.json();
  if (!name || !email || !phone || !message) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  try {
    const newContact = await addContact({ name, email, phone, message });
    // TODO: notification
    return NextResponse.json({ message: 'Sent' }, { status: 201 });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
