'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About Us' },
  { href: '#services', label: 'Medicare Services' },
  { href: '#book', label: 'Book Appointment' },
  { href: '/find-me', label: 'Find Me' },
  { href: '#team', label: 'Become Agent' },
  { href: '#contact', label: 'Contact' },
  { href: '/admin', label: 'Admin', external: true },
];

export function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-xl bg-slate-900/80 backdrop-blur-xl' : 'absolute top-0 left-0 right-0'} transition-all duration-300`}>
      <div className="container flex items-center justify-between py-4">
        <Link href="#home" className="text-2xl font-extrabold tracking-tight text-white">
          MedHelp
        </Link>

        <button className="lg:hidden p-2 border rounded-md border-white/20" onClick={() => setOpen(v => !v)}>
          <span>{open ? '✕' : '☰'}</span>
        </button>

        <nav className={`absolute lg:static left-0 top-16 w-full lg:w-auto bg-slate-900/85 lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-0 transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'} overflow-hidden lg:max-h-full`}>
          <ul className="lg:flex items-center gap-6 p-4 lg:p-0">
            {links.map(link => (
              <li key={link.href}>
                {(link as any).external ? (
                  <a href={link.href} className="text-sm lg:text-base text-slate-100 hover:text-white transition">
                    {link.label}
                  </a>
                ) : (
                  <a href={link.href} className="text-sm lg:text-base text-slate-100 hover:text-white transition">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <a href="#book" className="inline-flex items-center rounded-full bg-medhelp-danger px-5 py-2 text-sm font-semibold text-white hover:shadow-lg transition">
                Book an Appointment
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
