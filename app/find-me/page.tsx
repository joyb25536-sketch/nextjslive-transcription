'use client';

import { useEffect, useState, Suspense } from 'react';
import { MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

interface LocationEvent {
  id: number;
  title: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  status: string;
  description?: string;
}

function FindMeContent() {
  const [todayLocation, setTodayLocation] = useState<LocationEvent | null>(null);
  const [allLocations, setAllLocations] = useState<LocationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      try {
        const res = await fetch('/api/location-events');
        if (!res.ok) throw new Error('Failed');
        const { events } = await res.json();

        const today = new Date().toISOString().split('T')[0];
        const todayEvent = events.find((e: LocationEvent) => e.event_date === today);
        
        setTodayLocation(todayEvent || null);
        setAllLocations(events);
      } catch (err) {
        console.error('Failed to load locations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
    const interval = setInterval(loadLocations, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const openDirections = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  if (loading) {
    return <div className="container py-24 text-center">Loading location...</div>;
  }

  return (
    <section id="find-me" className="container py-24">
      <h1 className="text-5xl font-bold mb-4">Find Me on the Field</h1>
      <p className="text-lg text-slate-300 mb-12">Real-time location updates • Get directions • Book appointment</p>

      {todayLocation ? (
        <div className="max-w-3xl mx-auto mb-12">
          <div className="glass p-8 border-2 border-medhelp-danger rounded-3xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{todayLocation.title}</h2>
                <div className="flex items-center gap-2 text-medhelp-danger mb-2">
                  <MapPin size={20} />
                  <span className="text-lg">{todayLocation.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock size={20} />
                  <span>{todayLocation.start_time} - {todayLocation.end_time}</span>
                </div>
              </div>
              <div className="text-right">
                {todayLocation.status === 'Available' ? (
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle size={24} />
                    <span className="font-bold">AVAILABLE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <XCircle size={24} />
                    <span className="font-bold">NOT AVAILABLE</span>
                  </div>
                )}
              </div>
            </div>

            {todayLocation.description && (
              <p className="text-slate-300 mb-6">{todayLocation.description}</p>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => openDirections(todayLocation.location)}
                className="flex-1 rounded-full bg-medhelp-danger px-6 py-3 font-bold text-white hover:bg-red-600 transition"
              >
                Get Directions
              </button>
              {todayLocation.status === 'Available' && (
                <button
                  onClick={() => window.location.hash = '#book'}
                  className="flex-1 rounded-full border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10 transition"
                >
                  Book Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mb-12 glass p-8 rounded-3xl text-center">
          <p className="text-slate-300 mb-4">No location scheduled for today.</p>
          <p className="text-sm text-slate-400">Check the monthly calendar below for upcoming locations.</p>
        </div>
      )}

      {/* Upcoming locations */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">Upcoming Locations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {allLocations.slice(0, 8).map(event => {
            const eventDate = new Date(event.event_date);
            const today = new Date().toISOString().split('T')[0];
            const isPast = event.event_date < today;

            return (
              <div
                key={event.id}
                className={`glass p-5 rounded-2xl border transition ${
                  isPast ? 'opacity-50' : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{event.title}</h4>
                    <p className="text-sm text-slate-300">{eventDate.toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    event.status === 'Available' 
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-slate-500/20 text-slate-300'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  <MapPin size={14} className="inline mr-1" />
                  {event.location}
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  <Clock size={14} className="inline mr-1" />
                  {event.start_time} - {event.end_time}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function FindMePage() {
  return (
    <Suspense fallback={<div className="container py-24">Loading...</div>}>
      <FindMeContent />
    </Suspense>
  );
}
