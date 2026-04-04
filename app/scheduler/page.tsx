'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { addDays, format } from 'date-fns';

function SchedulerContent() {
  const searchParams = useSearchParams();
  const [slots, setSlots] = useState<string[]>(['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']);
  const [form, setForm] = useState({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
    date: '',
    time: '',
    type: searchParams.get('type') || 'agent',
    applicationId: searchParams.get('applicationId') || '',
  });
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const next7 = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(new Date(), i);
      return format(d, 'yyyy-MM-dd');
    });
    setDates(next7);
  }, []);

  const handleBook = async () => {
    if (!form.date || !form.time) {
      alert('Please select a date and time');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          serviceType: 'Agent Meeting',
          date: form.date,
          time: form.time,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          notes: `Agent application scheduled meeting - ID: ${form.applicationId}`,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Schedule Your Broker Meeting</h1>
        <p className="text-slate-300 mb-8">Select a time that works best for you. We&apos;ll send you a confirmation email with meeting details.</p>

        <div className="glass p-8 space-y-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-slate-300">
              <strong>{form.name}</strong> • {form.email} • {form.phone}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-300 block mb-2">Select Date</label>
            <div className="grid grid-cols-3 gap-2">
              {dates.map(d => (
                <button
                  key={d}
                  onClick={() => setForm(f => ({ ...f, date: d, time: '' }))}
                  className={`p-3 rounded-lg border transition ${
                    form.date === d
                      ? 'bg-medhelp-danger border-medhelp-danger'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-xs text-slate-300">{new Date(d).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-sm font-semibold">{new Date(d).getDate()}</div>
                </button>
              ))}
            </div>
          </div>

          {form.date && (
            <div>
              <label className="text-sm font-semibold text-slate-300 block mb-2">Select Time</label>
              <div className="grid grid-cols-4 gap-2">
                {slots.map(s => (
                  <button
                    key={s}
                    onClick={() => setForm(f => ({ ...f, time: s }))}
                    className={`p-2 rounded-lg border transition text-sm ${
                      form.time === s
                        ? 'bg-medhelp-danger border-medhelp-danger'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {form.date && form.time && (
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
              <p className="text-green-300 text-sm">
                ✓ Meeting scheduled for {new Date(form.date).toLocaleDateString()} at {form.time}
              </p>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={loading || !form.date || !form.time}
            className="w-full rounded-full bg-medhelp-danger px-6 py-3 font-bold text-white hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Confirm Meeting'}
          </button>

          {status === 'success' && (
            <div className="p-4 bg-green-500/20 border border-green-500 rounded-xl">
              <p className="text-green-300">✓ Meeting confirmed! Check your email for details.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl">
              <p className="text-red-300">✗ Scheduling failed. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SchedulerPage() {
  return (
    <Suspense fallback={<div className="container py-24">Loading scheduler...</div>}>
      <SchedulerContent />
    </Suspense>
  );
}
