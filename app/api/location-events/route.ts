export async function GET() {
  try {
    const events = await getLocationEvents();
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ events: [] });
  }
}

export async function POST(req: NextRequest) {
  const { title, event_date, location, start_time, end_time, status, description } = await req.json();

  if (!title || !event_date || !location || !start_time || !end_time) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newEvent = await addLocationEvent({
      title,
      event_date,
      location,
      start_time,
      end_time,
      status: status ?? 'Available',
      description,
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
