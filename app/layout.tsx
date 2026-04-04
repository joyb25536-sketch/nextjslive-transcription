import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MedHelp - Trusted Medicare Insurance',
  description: 'Professional Medicare insurance planning and appointment booking for seniors and families.',
  keywords: 'Medicare, Insurance, Health Plans, Medicare Advantage, Prescription Drug Plan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[radial-gradient(circle_at_top,#0a1f3a,_#020814_45%,_#030916_100%)] text-white">
        {children}
      </body>
    </html>
  );
}