'use client';
import { useEffect, useState } from 'react';

export function LocationMap() {
  const [place, setPlace] = useState('Chicago, IL');

  useEffect(() => {
    fetch('/api/location').then(r => r.json()).then(data => setPlace(data?.location || 'Chicago, IL')).catch(() => {});
  }, []);

  const encoded = encodeURIComponent(place);
  const mapSrc = `https://maps.google.com/maps?q=${encoded}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location" className="container py-24">
      <h2 className="text-4xl font-bold">Today’s Location</h2>
      <p className="mt-2 text-slate-300">Real-time location updates from the admin dashboard.</p>
      <div className="mt-5 glass overflow-hidden">
        <iframe title="MedHelp location" src={mapSrc} width="100%" height="450" className="border-0" loading="lazy"></iframe>
      </div>
      <p className="mt-3 text-lg">Today’s Location: <strong className="text-white">{place}</strong></p>
    </section>
  );
}
