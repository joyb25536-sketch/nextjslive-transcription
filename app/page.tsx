import { Navbar } from './components/Navbar';
import { Services } from './components/Services';
import { AppointmentForm } from './components/AppointmentForm';
import { LocationMap } from './components/LocationMap';
import { LocationCalendar } from './components/LocationCalendar';
import { AboutSection } from './components/AboutSection';
import { JoinTeam } from './components/JoinTeam';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main>
      <Navbar />
      <section id="home" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f3a]/90 via-[#091d3a]/70 to-[#020714]/90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 blur-md" />
        <div className="container relative z-10 py-24 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-medhelp-800/70 px-4 py-1 text-sm text-cyan-200">Premium Medicare Insurance</p>
              <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl">Your Trusted Health Insurance Agency</h1>
              <p className="max-w-xl text-lg text-slate-300">MedHelp delivers personalized Medicare planning and ongoing support across Medicare Advantage, Supplement, and Part D plans. Book a free consultation with our licensed experts.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#book" className="rounded-full bg-medhelp-danger px-8 py-3 text-base font-bold text-white shadow-lg hover:scale-105 transition">Schedule a Free Consultation</a>
                <a href="#services" className="rounded-full border border-white/30 px-8 py-3 text-base text-white/90 hover:text-white hover:bg-white/10 transition">Learn More</a>
              </div>
              <div className="pt-3 text-sm text-slate-300">Trusted by hundreds of clients for Medicare plan recommendations and year-round policy reviews.</div>
            </div>
            <div className="glass p-8 backdrop-blur-2xl shadow-2xl">
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <span className="text-7xl">🩺</span>
                <h2 className="text-2xl font-bold">MedHelp</h2>
                <p className="text-center text-slate-200">Secure, compliant insurance access with enhanced claims and renewal management.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Services />
      <Suspense fallback={<div className="container py-24">Loading booking form...</div>}>
        <AppointmentForm />
      </Suspense>
      <LocationMap />
      <LocationCalendar />
      <AboutSection />
      <JoinTeam />
      <ContactSection />
      <Footer />

      <a href="#book" className="fixed bottom-6 right-4 z-50 inline-flex items-center rounded-full bg-medhelp-danger px-5 py-3 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105 lg:hidden">Book Appointment</a>
    </main>
  );
}