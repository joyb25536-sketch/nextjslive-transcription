export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    const updated = await updateBrokerApplication(params.id, { status });
    if (!updated) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error('Error updating application:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
