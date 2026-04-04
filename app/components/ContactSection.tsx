'use client';

import { useState } from 'react';

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="container py-24">
      <h2 className="text-4xl font-bold">Contact</h2>
      <div className="mt-7 grid gap-8 lg:grid-cols-2">
        <div className="glass p-6 space-y-4">
          <p>Reach us via phone, email, or form request. Our team responds within 1 business day.</p>
          <p><strong>Phone:</strong> <a href="tel:+15165474146" className="text-medhelp-700">+1 (516) 547-4146</a></p>
          <p><strong>Email:</strong> <a href="mailto:Paola929medhelp@gmail.com" className="text-medhelp-700">hello@medhelp.com</a></p>
          <p><strong>Office:</strong> 📍 Long Island, NY</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-6 space-y-3">
          <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required />
          <textarea placeholder="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white" required />
          <button type="submit" className="rounded-full bg-medhelp-700 px-6 py-3 font-bold text-white">Send Message</button>
          {status === 'success' && <p className="text-green-300">Message sent.</p>}
          {status === 'error' && <p className="text-red-300">Submission failed.</p>}
        </form>
      </div>
    </section>
  );
}
