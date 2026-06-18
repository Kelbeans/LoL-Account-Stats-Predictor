import TournamentTabs from '@/components/TournamentTabs';
import BracketView from '@/components/BracketView';
import CrystalBallGrid from '@/components/CrystalBallGrid';
import TeamsGrid from '@/components/TeamsGrid';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/5 via-transparent to-[var(--accent-gold)]/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent-cyan)]/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-gold)] flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
                  Pick&apos;em Predictor
                </h1>
                <p className="text-xs text-[var(--foreground-muted)]">
                  AI-powered predictions for MSI &amp; Worlds
                </p>
              </div>
            </div>
          </header>

          <TournamentTabs>
            <BracketView />
            <CrystalBallGrid />
            <TeamsGrid />
          </TournamentTabs>
        </div>
      </div>
    </main>
  );
}
