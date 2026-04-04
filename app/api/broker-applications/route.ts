import { NextRequest, NextResponse } from 'next/server';
import { getBrokerApplications, addBrokerApplication, updateBrokerApplication } from '../../../lib/database';

export async function GET() {
  try {
    const applications = await getBrokerApplications();
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ applications: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;
    const experience = formData.get('experience') as string;
    const licenseStatus = formData.get('licenseStatus') as string;
    const message = formData.get('message') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!fullName || !email || !phone || !city || !experience) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let resumeUrl = null;
    if (resumeFile) {
      // For localhost, store resume filename (in production, upload to S3/storage)
      resumeUrl = `resume-${Date.now()}-${fullName.replace(/\s+/g, '-')}.pdf`;
    }

    const newApplication = await addBrokerApplication({
      full_name: fullName,
      email,
      phone,
      city,
      experience_level: experience,
      license_status: licenseStatus,
      message,
      resume_url: resumeUrl,
      status: 'pending',
    });

    // Send admin notification (best-effort)
    await fetch('http://localhost:3000/api/notifications/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'agent_application',
        applicantName: fullName,
        applicantEmail: email,
        experience: experience,
        city: city,
      }),
    }).catch(() => null);

    return NextResponse.json({ id: newApplication.id, message: 'Application submitted' }, { status: 201 });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const updated = updateBrokerApplication(id, { status });
    if (!updated) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ application: updated });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
