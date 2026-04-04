'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDays, format as formatDate, parse } from 'date-fns';
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';
import { useSearchParams } from 'next/navigation';

const serviceTypes = [
  'Medicare Advantage Plans',
  'Medicare Supplement Plans',
  'Prescription Drug Plans',
  'New to Medicare Guidance',
  'Enrollment Support',
  'Annual Coverage Reviews',
  'Special Enrollment Assistance',
  'Personal Medicare Consultations',
  'Agent Meeting',
];

function getNext7Days(timeZone: string) {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const utcCandidate = addDays(new Date(), i);
    const zoned = toZonedTime(utcCandidate, timeZone);
    days.push(formatDate(zoned, 'yyyy-MM-dd'));
  }
  return days;
}

export function AppointmentForm() {
  const systemTZ = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
  const searchParams = useSearchParams();
  const [timezone, setTimezone] = useState(systemTZ);
  const [form, setForm] = useState({ name: '', email: '', phone: '', serviceType: serviceTypes[0], notes: '', date: '', time: '' });
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedAppointments, setBookedAppointments] = useState<Array<{ date?: string; time?: string; timezone?: string; appointment_utc?: string }>>([]);
  const [status, setStatus] = useState<{ type: 'idle' | 'saving' | 'success' | 'error'; message?: string }>({ type: 'idle' });
  const [timeZones, setTimeZones] = useState<string[]>([]);

  useEffect(() => {
    if (typeof Intl?.supportedValuesOf === 'function') {
      setTimeZones(Intl.supportedValuesOf('timeZone'));
    } else {
      setTimeZones(['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']);
    }
  }, []);

  useEffect(() => {
    const prefillName = searchParams.get('name');
    const prefillEmail = searchParams.get('email');
    const prefillPhone = searchParams.get('phone');
    const prefillService = searchParams.get('serviceType');

    if (prefillName || prefillEmail || prefillPhone || prefillService) {
      setForm(curr => ({
        ...curr,
        name: prefillName ?? curr.name,
        email: prefillEmail ?? curr.email,
        phone: prefillPhone ?? curr.phone,
        serviceType: prefillService ?? curr.serviceType,
      }));
    }

    async function fetchAvailability() {
      try {
        const res = await fetch('/api/appointments/availability');
        if (!res.ok) throw new Error('Failed availability');
        const json = await res.json();
        if (Array.isArray(json.appointments)) {
          setBookedAppointments(json.appointments);
        } else if (json.booked) {
          // fallback compatibility
          const backlog = Object.entries(json.booked).flatMap(([date, times]: [string, string[]]) => times.map(time => ({ date, time })));
          setBookedAppointments(backlog);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAvailability();
  }, [searchParams]);

  const availableDates = useMemo(() => getNext7Days(timezone), [timezone]);

  useEffect(() => {
    const base = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    setSlots(base);
  }, []);

  const blockedTimes = useMemo(() => {
    if (!form.date) return [];

    return bookedAppointments
      .map(item => {
        try {
          if (item.appointment_utc) {
            const utcDate = new Date(item.appointment_utc);
            const local = toZonedTime(utcDate, timezone);
            return { date: formatInTimeZone(local, timezone, 'yyyy-MM-dd'), time: formatInTimeZone(local, timezone, 'HH:mm') };
          }

          if (item.timezone && item.date && item.time) {
            const parsed = parse(`${item.date} ${item.time}`, 'yyyy-MM-dd HH:mm', new Date());
            const utcFromZone = fromZonedTime(parsed, item.timezone);
            const local = toZonedTime(utcFromZone, timezone);
            return { date: formatInTimeZone(local, timezone, 'yyyy-MM-dd'), time: formatInTimeZone(local, timezone, 'HH:mm') };
          }

          if (item.date && item.time) {
            return { date: item.date, time: item.time };
          }
        } catch (err) {
          console.error('Timezone conversion failed', err);
        }

        return { date: '', time: '' };
      })
      .filter(slot => slot.date === form.date)
      .map(slot => slot.time);
  }, [bookedAppointments, form.date, timezone]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.date || !form.time) {
      setStatus({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setStatus({ type: 'saving' });

    const payload = {
      ...form,
      timezone,
    };

    const nextRes = await fetch('/api/appointments/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!nextRes.ok) {
      const errorData = await nextRes.json();
      setStatus({ type: 'error', message: errorData?.message || 'Unable to book. Please try again.' });
      return;
    }

    const data = await nextRes.json();

    setStatus({ type: 'success', message: `Appointment confirmed for ${data.appointment.date} at ${data.appointment.time} (${timezone}).` });
    setBookedAppointments(prev => [...prev, { ...form, timezone, appointment_utc: data.appointment?.appointment_utc }]);
    setForm({ name: '', email: '', phone: '', serviceType: serviceTypes[0], notes: '', date: '', time: '' });

    // Send email alert after booking confirmation (with full error handling)
    try {
      const emailRes = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: form.date,
          time: form.time,
        }),
      });

      if (!emailRes.ok) {
        console.warn('[handleSubmit] Email API returned non-OK status:', emailRes.status);
        const emailErrorData = await emailRes.json().catch(() => ({}));
        console.warn('[handleSubmit] Email error details:', emailErrorData);
      } else {
        const emailData = await emailRes.json();
        console.log('[handleSubmit] Email sent successfully:', emailData);
      }
    } catch (emailError) {
      console.error('[handleSubmit] Failed to send email alert:', emailError);
    }
  };

  return (
    <section id="book" className="container py-24">
      <h2 className="text-4xl font-bold">Book Appointment</h2>
      <p className="max-w-2xl text-slate-300">Real-time appointment slots, automatic conflict detection, Google calendar sync, SMS confirm, and admin notifications.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="glass p-6">
          <h3 className="text-2xl font-semibold">Pick your date & time</h3>
          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="text-sm text-slate-300">Select Time Zone</span>
              <select className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white" value={timezone} onChange={e => setTimezone(e.target.value)}>
                {timeZones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Date*</span>
              <select className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" value={form.date} onChange={e => setForm(s => ({ ...s, date: e.target.value, time: '' }))}>
                <option value="">Select a date</option>
                {availableDates.map(date => (
                  <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Time*</span>
              <select className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3" value={form.time} onChange={e => setForm(s => ({ ...s, time: e.target.value }))} disabled={!form.date}>
                <option value="">Select time</option>
                {slots.map(slot => (
                  <option key={slot} value={slot} disabled={blockedTimes.includes(slot)}>
                    {slot}{blockedTimes.includes(slot) ? ' (Booked)' : ''}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass p-6 space-y-4">
          <label className="block"><span className="text-sm text-slate-300">Name*</span><input value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required /></label>
          <label className="block"><span className="text-sm text-slate-300">Email*</span><input type="email" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required /></label>
          <label className="block"><span className="text-sm text-slate-300">Phone*</span><input type="tel" value={form.phone} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required /></label>
          <label className="block"><span className="text-sm text-slate-300">Service Type*</span><select value={form.serviceType} onChange={e => setForm(s => ({ ...s, serviceType: e.target.value }))} className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required>
            {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
          </select></label>
          <label className="block"><span className="text-sm text-slate-300">Notes</span><textarea value={form.notes} onChange={e => setForm(s => ({ ...s, notes: e.target.value }))} className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white min-h-[110px]" /></label>

          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-medhelp-danger px-6 py-3 font-bold text-white hover:bg-red-500 transition">Confirm Booking</button>
          {status.type !== 'idle' && <p className={`text-sm ${status.type === 'error' ? 'text-red-300' : 'text-green-300'}`}>{status.message}</p>}
        </form>
      </div>

      <div className="mt-6 text-sm text-slate-400">* Times are shown for selected timezone ({timezone}).</div>
    </section>
  );
}
