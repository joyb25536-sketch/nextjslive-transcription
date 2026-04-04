'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  date: string;
  time: string;
  timezone?: string;
  appointment_utc?: string;
  notes?: string;
  created_at?: string;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      } else {
        console.warn('Failed to load appointments:', res.status);
        setAppointments([]);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8">All Appointments</h1>

      {loading ? (
        <div>Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="glass p-8 text-center text-slate-300">No appointments scheduled</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Service Type</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Time</th>
                <th className="text-left py-3 px-4 font-semibold">Timezone</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-3 px-4">{apt.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-300">{apt.email}</td>
                  <td className="py-3 px-4 text-sm">{apt.service_type}</td>
                  <td className="py-3 px-4 text-sm">{apt.date}</td>
                  <td className="py-3 px-4 text-sm">{apt.time}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{apt.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
