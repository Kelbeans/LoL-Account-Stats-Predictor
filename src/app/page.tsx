import TournamentTabs from '@/components/TournamentTabs';
import BracketView from '@/components/BracketView';
import CrystalBallGrid from '@/components/CrystalBallGrid';

export default function Home() {
  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          LoL Pick&apos;em Predictor
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          AI-powered predictions for your MSI &amp; Worlds Pick&apos;em
        </p>
      </header>
      <TournamentTabs>
        <BracketView />
        <CrystalBallGrid />
      </TournamentTabs>
    </main>
  );
}
