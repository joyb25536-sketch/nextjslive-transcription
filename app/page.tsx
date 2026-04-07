import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      
      {/* HERO SECTION - STATIC */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f3a]/90 via-[#091d3a]/70 to-[#020714]/90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 blur-md" />
        
        <div className="container relative z-10 py-24 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-medhelp-800/70 px-4 py-1 text-sm text-cyan-200">
                Premium Medicare Insurance
              </p>
              <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl">
                Your Trusted Health Insurance Agency
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                MedHelp delivers personalized Medicare planning. Our online booking system is currently undergoing maintenance. Please check back soon.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {/* Changed from <a> to <div> to disable clicking */}
                <div className="rounded-full bg-slate-600 px-8 py-3 text-base font-bold text-white shadow-lg cursor-not-allowed">
                  Booking Currently Unavailable
                </div>
              </div>
              
              <div className="pt-3 text-sm text-slate-300">
                Contact us directly for Medicare plan recommendations and policy reviews.
              </div>
            </div>

            <div className="glass p-8 backdrop-blur-2xl shadow-2xl">
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <span className="text-7xl">🩺</span>
                <h2 className="text-2xl font-bold">MedHelp</h2>
                <p className="text-center text-slate-200">
                  Site maintenance in progress. Secure, compliant insurance access will return shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLACEHOLDERS FOR REMOVED SECTIONS */}
      <section className="bg-[#020714] py-20 text-center border-t border-white/10">
        <div className="container">
            <h2 className="text-3xl font-bold text-white mb-4">Under Maintenance</h2>
            <p className="text-slate-400">We are currently updating our systems to serve you better.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
