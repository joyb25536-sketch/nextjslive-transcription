'use client';

import { useEffect, useState } from 'react';

interface LocationEvent {
  id: number;
  title: string;
  event_date: string;
  location: string;
  start_time: string;
  end_time: string;
  status: string;
  description?: string;
}

export function LocationCalendar() {
  const [events, setEvents] = useState<LocationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/location-events');
        if (!res.ok) {
          console.warn('⚠ Failed to fetch location events (status:', res.status + ')');
          setEvents([]);
          setError(null);
          return;
        }
        const json = await res.json();
        const eventsData = Array.isArray(json.events) ? json.events : [];
        setEvents(eventsData);
        if (eventsData.length === 0) {
          console.info('No location events configured yet');
        }
      } catch (err) {
        console.error('✗ Error loading calendar events:', err);
        setEvents([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) return <div className="text-slate-300 text-center py-8">Loading calendar...</div>;
  if (error) return <div className="text-slate-400 text-center py-8">Calendar temporarily unavailable</div>;

  const buildDateMap = events.reduce((acc, event) => {
    if (!event.event_date) return acc;
    if (!acc[event.event_date]) acc[event.event_date] = [];
    acc[event.event_date].push(event);
    return acc;
  }, {} as Record<string, LocationEvent[]>);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return (
    <section id="monthly-calendar" className="container py-24">
      <h2 className="text-4xl font-bold">Where to Find Me This Month</h2>
      <p className="mt-2 text-slate-300">All location events are pulled from the unified location calendar.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: daysInMonth }, (_, idx) => {
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(idx + 1).padStart(2, '0')}`;
          const dayEvents = buildDateMap[dateKey] || [];
          return (
            <article key={dateKey} className="glass p-4 rounded-2xl shadow-md min-h-[140px] transition hover:-translate-y-1">
              <h3 className="font-bold">{new Date(dateKey).toLocaleDateString()}</h3>
              {dayEvents.length === 0 ? (
                <p className="text-slate-400">No location events</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {dayEvents.map(event => (
                    <li key={event.id} className="border-t border-white/10 pt-2">
                      <div className="font-semibold">{event.title}</div>
                      <div>{event.location}</div>
                      <div className="text-slate-300">{event.start_time} - {event.end_time}</div>
                      <div className="text-slate-200">{event.status}</div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
