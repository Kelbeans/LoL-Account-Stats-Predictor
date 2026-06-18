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
      <main className="min-h-screen p-6 max-w-4xl mx-auto">
        <p className="text-gray-400">Match not found.</p>
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
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 hover:text-[var(--accent-cyan)] mb-6 transition-colors"
      >
        &larr; Back to bracket
      </button>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
        <div className="text-xs text-gray-400 mb-4">
          {match.tournament} &mdash; {match.stage}
        </div>
        <div className="flex items-center justify-center gap-8">
          <div className={`text-center p-4 rounded-lg flex-1 ${
            prediction?.predictedWinner === match.team1.name
              ? 'bg-[var(--accent-cyan)]/10 border-2 border-[var(--accent-cyan)]'
              : 'border border-[var(--card-border)]'
          }`}>
            <p className="text-2xl font-bold">{match.team1.shortName}</p>
            <p className="text-sm text-gray-400">{match.team1.name}</p>
            <p className="text-xs text-gray-500 mt-1">{match.team1.region}</p>
          </div>
          <div className="text-gray-500 text-lg font-bold">VS</div>
          <div className={`text-center p-4 rounded-lg flex-1 ${
            prediction?.predictedWinner === match.team2.name
              ? 'bg-[var(--accent-cyan)]/10 border-2 border-[var(--accent-cyan)]'
              : 'border border-[var(--card-border)]'
          }`}>
            <p className="text-2xl font-bold">{match.team2.shortName}</p>
            <p className="text-sm text-gray-400">{match.team2.name}</p>
            <p className="text-xs text-gray-500 mt-1">{match.team2.region}</p>
          </div>
        </div>
      </div>

      {prediction ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--accent-cyan)]">AI Prediction</h2>
            <span className="text-sm font-bold text-[var(--accent-gold)]">
              Confidence: {prediction.confidence}%
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)] rounded-lg px-4 py-2">
              <p className="text-sm text-gray-400">Winner</p>
              <p className="text-xl font-bold text-[var(--accent-cyan)]">{prediction.predictedWinner}</p>
            </div>
            <div className="bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)] rounded-lg px-4 py-2">
              <p className="text-sm text-gray-400">Score</p>
              <p className="text-xl font-bold text-[var(--accent-gold)]">{prediction.predictedScore}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Reasoning</h3>
            <p className="text-sm text-gray-400">{prediction.reasoning}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Key Factors</h3>
            <ul className="space-y-1">
              {prediction.keyFactors.map((factor, i) => (
                <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                  <span className="text-[var(--accent-cyan)]">&bull;</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
            <span className="text-xs text-gray-500">
              Generated: {new Date(prediction.generatedAt).toLocaleString()}
            </span>
            <button
              onClick={handlePredict}
              disabled={loading}
              className="text-xs text-[var(--accent-cyan)] hover:underline disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Prediction'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="px-8 py-3 font-medium rounded-lg bg-[var(--accent-cyan)] text-black hover:bg-[var(--accent-cyan)]/80 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Generating Prediction...' : 'Generate AI Prediction'}
          </button>
        </div>
      )}
    </main>
  );
}
