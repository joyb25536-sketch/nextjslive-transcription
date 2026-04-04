'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

interface AgentApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  experience_level: string;
  license_status: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminAgentsPage() {
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await fetch('/api/broker-applications');
      if (res.ok) {
        const { applications } = await res.json();
        setApplications(applications);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/broker-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        loadApplications();
      }
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8">Agent Applications</h1>

      {loading ? (
        <div>Loading...</div>
      ) : applications.length === 0 ? (
        <div className="glass p-8 text-center text-slate-300">No applications yet</div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="glass p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h3 className="text-xl font-bold">{app.full_name}</h3>
                  <p className="text-sm text-slate-300">{app.email}</p>
                  <p className="text-sm text-slate-400">{app.phone} • {app.city}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-bold mb-2 ${
                    app.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : app.status === 'approved'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {app.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-slate-400">
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded mb-4 text-sm text-slate-300">
                <p><strong>Experience:</strong> {app.experience_level}</p>
                <p><strong>License:</strong> {app.license_status}</p>
                <p><strong>Message:</strong> {app.message}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(app.id, 'approved')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button
                  onClick={() => updateStatus(app.id, 'rejected')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
