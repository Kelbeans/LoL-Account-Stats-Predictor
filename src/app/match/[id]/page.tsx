'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Match } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';

const MATCHES: Match[] = [
  { id: 'msi-2025-ub-sf-1', team1: { name: 'T1', shortName: 'T1', region: 'LCK' }, team2: { name: 'Team Liquid', shortName: 'TLAW', region: 'LCS' }, tournament: 'MSI 2025', stage: 'Upper Bracket SF' },
  { id: 'msi-2025-ub-sf-2', team1: { name: 'Karmine Corp', shortName: 'KC', region: 'LEC' }, team2: { name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LJL' }, tournament: 'MSI 2025', stage: 'Upper Bracket SF' },
  { id: 'msi-2025-ub-f', team1: { name: 'T1', shortName: 'T1', region: 'LCK' }, team2: { name: 'Karmine Corp', shortName: 'KC', region: 'LEC' }, tournament: 'MSI 2025', stage: 'Upper Bracket Final' },
  { id: 'msi-2025-lb-sf', team1: { name: 'Team Liquid', shortName: 'TLAW', region: 'LCS' }, team2: { name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LJL' }, tournament: 'MSI 2025', stage: 'Lower Bracket SF' },
  { id: 'msi-2025-lb-f', team1: { name: 'Karmine Corp', shortName: 'KC', region: 'LEC' }, team2: { name: 'TBD', shortName: 'TBD', region: '—' }, tournament: 'MSI 2025', stage: 'Lower Bracket Final' },
  { id: 'msi-2025-grand-final', team1: { name: 'T1', shortName: 'T1', region: 'LCK' }, team2: { name: 'TBD', shortName: 'TBD', region: '—' }, tournament: 'MSI 2025', stage: 'Grand Final' },
];

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const match = MATCHES.find((m) => m.id === params.id);

  if (!match) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--foreground-muted)]">Match not found.</p>
          <button onClick={() => router.back()} className="mt-4 text-sm text-[var(--accent-cyan)] hover:underline">
            Go back
          </button>
        </div>
      </main>
    );
  }

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match),
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-cyan)]/3 to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-cyan)] mb-8 transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to bracket
          </button>

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden mb-6">
            <div className="bg-[var(--background-secondary)] px-6 py-3 border-b border-[var(--card-border)] flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)]">
                {match.tournament}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-cyan)]">
                {match.stage}
              </span>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-center gap-6">
                <TeamPanel
                  shortName={match.team1.shortName}
                  fullName={match.team1.name}
                  region={match.team1.region}
                  isWinner={prediction?.predictedWinner === match.team1.name}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--card-border)] bg-[var(--background)] flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--foreground-muted)]">VS</span>
                  </div>
                  {prediction && (
                    <span className="text-[10px] font-mono font-bold text-[var(--accent-gold)] bg-[var(--accent-gold-dim)] px-2.5 py-1 rounded-full">
                      {prediction.predictedScore}
                    </span>
                  )}
                </div>
                <TeamPanel
                  shortName={match.team2.shortName}
                  fullName={match.team2.name}
                  region={match.team2.region}
                  isWinner={prediction?.predictedWinner === match.team2.name}
                />
              </div>
            </div>
          </div>

          {prediction ? (
            <div className="space-y-4">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
                <div className="bg-[var(--accent-cyan)]/5 px-6 py-3 border-b border-[var(--accent-cyan)]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[var(--accent-cyan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <span className="text-sm font-bold text-[var(--accent-cyan)]">AI Prediction</span>
                  </div>
                  <ConfidenceBar value={prediction.confidence} />
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-[var(--background-secondary)] rounded-xl p-4 border border-[var(--card-border)]">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Predicted Winner</p>
                      <p className="text-xl font-bold text-[var(--accent-cyan)]">{prediction.predictedWinner}</p>
                    </div>
                    <div className="bg-[var(--background-secondary)] rounded-xl p-4 border border-[var(--card-border)]">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-1">Score</p>
                      <p className="text-xl font-bold text-[var(--accent-gold)]">{prediction.predictedScore}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-2">Reasoning</p>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed">{prediction.reasoning}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-3">Key Factors</p>
                    <div className="space-y-2">
                      {prediction.keyFactors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shrink-0" />
                          <p className="text-sm text-[var(--foreground-muted)]">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 border-t border-[var(--card-border)] flex items-center justify-between bg-[var(--background-secondary)]">
                  <span className="text-[10px] text-[var(--foreground-muted)]">
                    Generated {new Date(prediction.generatedAt).toLocaleString()}
                  </span>
                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--accent-cyan)] hover:underline disabled:opacity-50"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {loading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="px-10 py-4 text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[var(--accent-cyan)] to-[#0099cc] text-black hover:shadow-[0_0_30px_var(--accent-cyan-dim)] disabled:opacity-50 transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Generating Prediction...
                  </span>
                ) : (
                  'Generate AI Prediction'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TeamPanel({ shortName, fullName, region, isWinner }: {
  shortName: string;
  fullName: string;
  region: string;
  isWinner: boolean;
}) {
  return (
    <div className={`flex-1 text-center p-6 rounded-xl transition-all duration-300 ${
      isWinner
        ? 'bg-[var(--accent-cyan)]/8 border-2 border-[var(--accent-cyan)]/50 shadow-[0_0_30px_var(--accent-cyan-dim)]'
        : 'bg-[var(--background-secondary)] border border-[var(--card-border)]'
    }`}>
      {isWinner && (
        <div className="flex justify-center mb-2">
          <svg className="w-5 h-5 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
          </svg>
        </div>
      )}
      <p className={`text-3xl font-bold tracking-tight ${isWinner ? 'text-[var(--accent-cyan)]' : 'text-[var(--foreground)]'}`}>
        {shortName}
      </p>
      <p className="text-sm text-[var(--foreground-muted)] mt-1">{fullName}</p>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mt-2 opacity-60">
        {region}
      </p>
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 70 ? 'bg-[var(--accent-green)]' : value >= 50 ? 'bg-[var(--accent-gold)]' : 'bg-[var(--accent-red)]';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full bg-[var(--card-border)] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-bold text-[var(--accent-gold)]">{value}%</span>
    </div>
  );
}
