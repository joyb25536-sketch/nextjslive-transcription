export function Footer() {
  return (
    <footer className="bg-slate-900/80 border-t border-slate-700/40 py-10">
      <div className="container flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">MedHelp</h3>
          <p className="text-slate-400">Market-leading Medicare solutions built on trust and care.</p>
        </div>
        <div className="text-slate-400">© {new Date().getFullYear()} MedHelp. All rights reserved.</div>
      </div>
    </footer>
  );
}
