'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface LocationEvent {
  id: string;
  title: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

function AdminLocationsContent() {
  const [events, setEvents] = useState<LocationEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    event_date: '',
    start_time: '09:00',
    end_time: '17:00',
    status: 'Available',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch('/api/location-events');
      if (res.ok) {
        const { events } = await res.json();
        setEvents(events);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/location-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          title: '',
          location: '',
          event_date: '',
          start_time: '09:00',
          end_time: '17:00',
          status: 'Available',
        });
        setShowForm(false);
        loadEvents();
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Location Calendar</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-full bg-medhelp-danger px-4 py-2 font-bold text-white hover:bg-red-600"
        >
          <Plus size={20} /> Add Event
        </button>
      </div>

      {showForm && (
        <div className="glass p-6 mb-6 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white"
              required
            />
            <input
              type="text"
              placeholder="Location / Address"
              value={formData.location}
              onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white"
              required
            />
            <input
              type="date"
              value={formData.event_date}
              onChange={e => setFormData(f => ({ ...f, event_date: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                value={formData.start_time}
                onChange={e => setFormData(f => ({ ...f, start_time: e.target.value }))}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white"
              />
              <input
                type="time"
                value={formData.end_time}
                onChange={e => setFormData(f => ({ ...f, end_time: e.target.value }))}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white"
              />
            </div>
            <select
              value={formData.status}
              onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white"
            >
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
              <option value="By Appointment">By Appointment</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-lg bg-medhelp-danger px-4 py-2 font-bold text-white hover:bg-red-600"
            >
              Create Event
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <div key={event.id} className="glass p-4 rounded-lg flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-slate-300">{event.location}</p>
                <p className="text-xs text-slate-400">
                  {event.event_date} • {event.start_time}-{event.end_time}
                </p>
                <span className={`text-xs font-bold mt-2 inline-block px-3 py-1 rounded ${
                  event.status === 'Available'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-slate-500/20 text-slate-300'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminLocationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLocationsContent />
    </Suspense>
  );
}
