'use client';

import { motion } from 'framer-motion';

const serviceItems = [
  { title: 'Medicare Advantage Plans', description: 'Comprehensive coverage tailored to your lifestyle.' },
  { title: 'Medicare Supplement Plans', description: 'Reduce out-of-pocket costs and improve coverage.' },
  { title: 'Prescription Drug Plans', description: 'Expert drug plan review for maximum savings.' },
  { title: 'New to Medicare Guidance', description: 'Step-by-step enrollment transitions for new beneficiaries.' },
  { title: 'Enrollment Support', description: 'Personal support for every deadline and requirement.' },
  { title: 'Annual Coverage Reviews', description: 'Check plan changes and recommend upgrades.' },
  { title: 'Special Enrollment Assistance', description: 'Help with special circumstances and qualifying events.' },
  { title: 'Personal Medicare Consultations', description: '1-to-1 planning sessions with licensed advisors.' },
  { title: 'Claims & Management Support', description: 'Ongoing support even after enrollment.' },
];

export function Services() {
  return (
    <section id="services" className="container py-24">
      <h2 className="text-4xl font-bold">Our Medicare Services</h2>
      <p className="mt-3 max-w-2xl text-slate-300">Custom services crafted for senior coverage and long-term wellness planning across Medicare parts A, B, C, D.</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceItems.map((item, idx) => (
          <motion.article
            key={item.title}
            className="glass p-6 space-y-3 hover:-translate-y-1 hover:shadow-2xl transition"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <div className="h-12 w-12 rounded-full bg-medhelp-700/20 flex items-center justify-center text-medhelp-100">🏥</div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-sm text-slate-200">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
