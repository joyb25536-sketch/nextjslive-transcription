'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function JoinTeam() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: 'Beginner',
    license: false,
    message: '',
    resume: null as File | null,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setForm(f => ({ ...f, resume: file }));
    } else {
      setErrorMessage('Please upload a PDF file');
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!form.name || !form.email || !form.phone || !form.city) {
      setErrorMessage('Please fill all required fields');
      setStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('city', form.city);
    formData.append('experience', form.experience);
    formData.append('licenseStatus', form.license ? 'Yes' : 'No');
    formData.append('message', form.message);
    if (form.resume) {
      formData.append('resume', form.resume);
    }

    try {
      const res = await fetch('/api/broker-applications', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Submission failed');
      }

      const data = await res.json();
      setStatus('success');

      // Redirect to scheduler with prefill
      setTimeout(() => {
        router.push(
          `/scheduler?applicationId=${data.id}&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&phone=${encodeURIComponent(form.phone)}&type=agent`
        );
      }, 1500);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  };

  return (
    <section id="team" className="container py-24">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-blue-500">Join our team</h1>
        <h2 className="text-5xl font-extrabold">Start Your Career in Medicare Insurance</h2>
        <p className="mt-4 text-lg text-slate-300">Join MedHelp&apos;s growing network of independent agents and build your future in healthcare sales.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={submit} className="glass p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Full Name *</span>
              <input
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medhelp-danger"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Phone Number *</span>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medhelp-danger"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Email Address *</span>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medhelp-danger"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">City / Location *</span>
            <input
              placeholder="Chicago, IL"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medhelp-danger"
              required
            />
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Experience Level *</span>
              <select
                value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-medhelp-danger"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Experienced">Experienced</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Have License? *</span>
              <select
                value={form.license ? 'yes' : 'no'}
                onChange={e => setForm(f => ({ ...f, license: e.target.value === 'yes' }))}
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-medhelp-danger"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Why do you want to join? *</span>
            <textarea
              placeholder="Tell us about your motivation and goals..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medhelp-danger min-h-[120px]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Upload Resume (PDF Optional)</span>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-slate-300 file:bg-medhelp-danger file:border-0 file:text-white file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
            />
            {form.resume && <p className="mt-2 text-sm text-green-300">✓ {form.resume.name}</p>}
          </label>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-medhelp-danger px-6 py-4 font-bold text-white hover:bg-red-600 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Submitting...' : 'Apply Now → Schedule a Meeting'}
          </button>

          {status === 'success' && (
            <div className="p-4 bg-green-500/20 border border-green-500 rounded-xl">
              <p className="text-green-300">✓ Application submitted! Redirecting to scheduler...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl">
              <p className="text-red-300">✗ {errorMessage}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
