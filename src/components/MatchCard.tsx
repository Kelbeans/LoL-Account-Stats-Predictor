'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Match } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 hover:border-[var(--accent-cyan)] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{match.stage}</span>
        {prediction && (
          <span className="text-xs font-bold text-[var(--accent-gold)]">
            {prediction.confidence}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex-1 text-center p-2 rounded ${
          prediction?.predictedWinner === match.team1.name
            ? 'bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]'
            : ''
        }`}>
          <p className="font-semibold text-sm">{match.team1.shortName}</p>
          <p className="text-xs text-gray-400">{match.team1.region}</p>
        </div>
        <span className="text-gray-500 text-xs">vs</span>
        <div className={`flex-1 text-center p-2 rounded ${
          prediction?.predictedWinner === match.team2.name
            ? 'bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]'
            : ''
        }`}>
          <p className="font-semibold text-sm">{match.team2.shortName}</p>
          <p className="text-xs text-gray-400">{match.team2.region}</p>
        </div>
      </div>
      {prediction ? (
        <div className="mt-3 text-xs text-gray-300">
          <p className="font-medium text-[var(--accent-cyan)]">
            {prediction.predictedWinner} ({prediction.predictedScore})
          </p>
          <p className="mt-1 text-gray-400 line-clamp-2">{prediction.reasoning}</p>
        </div>
      ) : (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-3 w-full py-2 text-xs font-medium rounded bg-[var(--accent-cyan)] text-black hover:bg-[var(--accent-cyan)]/80 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Predicting...' : 'Generate Prediction'}
        </button>
      )}
      <Link
        href={`/match/${match.id}`}
        className="mt-2 block text-center text-xs text-gray-400 hover:text-[var(--accent-cyan)] transition-colors"
      >
        Details &rarr;
      </Link>
    </div>
  );
}
