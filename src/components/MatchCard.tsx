'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Match } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';

interface MatchCardProps {
  match: Match;
}

const regionFlags: Record<string, string> = {
  LCK: 'KR',
  LEC: 'EU',
  LCS: 'NA',
  LPL: 'CN',
  LJL: 'JP',
  PCS: 'TW',
  VCS: 'VN',
  CBLOL: 'BR',
  LLA: 'LA',
};

export default function MatchCard({ match }: MatchCardProps) {
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setPrediction(data);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const isWinner = (teamName: string) => prediction?.predictedWinner === teamName;

  return (
    <Link href={`/match/${match.id}`} className="block">
      <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden">
        <div className="bg-[var(--background-secondary)] px-4 py-2 flex items-center justify-between border-b border-[var(--card-border)]">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)]">
            {match.stage}
          </span>
          {prediction && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span className="text-[10px] font-bold text-[var(--accent-gold)]">
                {prediction.confidence}% conf
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-stretch gap-3">
            <TeamSide
              name={match.team1.shortName}
              region={match.team1.region}
              isWinner={isWinner(match.team1.name)}
              side="left"
            />
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-[var(--card-border)] bg-[var(--background)] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[var(--foreground-muted)]">VS</span>
              </div>
            </div>
            <TeamSide
              name={match.team2.shortName}
              region={match.team2.region}
              isWinner={isWinner(match.team2.name)}
              side="right"
            />
          </div>

          {prediction ? (
            <div className="mt-4 pt-3 border-t border-[var(--card-border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--accent-cyan)]">
                  {prediction.predictedWinner}
                </span>
                <span className="text-[10px] font-mono text-[var(--accent-gold)] bg-[var(--accent-gold-dim)] px-2 py-0.5 rounded">
                  {prediction.predictedScore}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                {prediction.reasoning}
              </p>
            </div>
          ) : (
            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-4 w-full py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[var(--accent-cyan)] to-[#0099cc] text-black hover:shadow-[0_0_20px_var(--accent-cyan-dim)] disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Predicting...
                </span>
              ) : (
                'Generate Prediction'
              )}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

function TeamSide({ name, region, isWinner, side }: {
  name: string;
  region: string;
  isWinner: boolean;
  side: 'left' | 'right';
}) {
  return (
    <div className={`flex-1 relative rounded-lg p-3 text-center transition-all duration-300 ${
      isWinner
        ? 'bg-[var(--accent-cyan)]/8 border border-[var(--accent-cyan)]/40 shadow-[inset_0_0_20px_var(--accent-cyan-dim)]'
        : 'bg-[var(--background-secondary)] border border-transparent'
    }`}>
      {isWinner && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
          <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
          </svg>
        </div>
      )}
      <p className={`text-lg font-bold tracking-tight ${isWinner ? 'text-[var(--accent-cyan)]' : 'text-[var(--foreground)]'}`}>
        {name}
      </p>
      <p className="text-[10px] font-medium text-[var(--foreground-muted)] mt-0.5 uppercase tracking-wider">
        {regionFlags[region] || region}
      </p>
    </div>
  );
}
