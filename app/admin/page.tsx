'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, MapPin, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    agents: 0,
    locations: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [aptRes, agentRes, locRes] = await Promise.all([
          fetch('/api/appointments/availability'),
          fetch('/api/broker-applications'),
          fetch('/api/location-events'),
        ]);

        const aptData = aptRes.ok ? await aptRes.json() : { appointments: [] };
        const agentData = agentRes.ok ? await agentRes.json() : { applications: [] };
        const locData = locRes.ok ? await locRes.json() : { events: [] };

        setStats({
          appointments: (aptData.appointments || []).length,
          agents: (agentData.applications || []).length,
          locations: (locData.events || []).length,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link href="/admin/appointments" className="glass p-6 rounded-2xl hover:border-medhelp-danger border border-white/20 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Appointments</p>
              <h3 className="text-4xl font-bold">{stats.appointments}</h3>
            </div>
            <Calendar size={40} className="text-medhelp-danger opacity-30" />
          </div>
        </Link>

        <Link href="/admin/agents" className="glass p-6 rounded-2xl hover:border-medhelp-danger border border-white/20 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Agent Applications</p>
              <h3 className="text-4xl font-bold">{stats.agents}</h3>
            </div>
            <Users size={40} className="text-medhelp-danger opacity-30" />
          </div>
        </Link>

        <Link href="/admin/locations" className="glass p-6 rounded-2xl hover:border-medhelp-danger border border-white/20 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Location Events</p>
              <h3 className="text-4xl font-bold">{stats.locations}</h3>
            </div>
            <MapPin size={40} className="text-medhelp-danger opacity-30" />
          </div>
        </Link>
      </div>

      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/admin/locations" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition flex items-center gap-3">
            <MapPin size={24} className="text-medhelp-danger" />
            <span>Manage Locations</span>
          </Link>
          <Link href="/admin/agents" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition flex items-center gap-3">
            <Users size={24} className="text-medhelp-danger" />
            <span>Review Agent Applications</span>
          </Link>
          <Link href="/admin/appointments" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition flex items-center gap-3">
            <Calendar size={24} className="text-medhelp-danger" />
            <span>View All Appointments</span>
          </Link>
          <Link href="/" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition flex items-center gap-3">
            <Settings size={24} className="text-medhelp-danger" />
            <span>Back to Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
