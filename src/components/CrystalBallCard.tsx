'use client';

import { useState } from 'react';
import { CrystalBallQuestion, CrystalBallPrediction } from '@/types/crystal-ball';

interface CrystalBallCardProps {
  question: CrystalBallQuestion;
}

const categoryColors: Record<string, string> = {
  champions: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  players: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  teams: 'bg-green-500/20 text-green-300 border-green-500/30',
  other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

export default function CrystalBallCard({ question }: CrystalBallCardProps) {
  const [prediction, setPrediction] = useState<CrystalBallPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crystal-ball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          tournamentContext: 'MSI 2025 Play-ins. Teams include T1 (LCK), Karmine Corp (LEC), Team Liquid (LCS), Deep Cross Gaming (LJL), and others from emerging regions. Current meta favors engage supports, scaling ADCs, and flexible solo laners.',
        }),
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error('Crystal ball prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-4 hover:border-[var(--accent-gold)] transition-colors flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded border ${categoryColors[question.category]}`}>
          {question.category.toUpperCase()}
        </span>
        <span className="text-xs font-bold text-[var(--accent-gold)]">
          {question.points} pts
        </span>
      </div>
      <p className="text-sm text-[var(--foreground)] mb-4 flex-1">{question.question}</p>
      {prediction ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[var(--accent-cyan)]">{prediction.answer}</p>
            <span className="text-xs text-[var(--accent-gold)]">{prediction.confidence}%</span>
          </div>
          <p className="text-xs text-gray-400">{prediction.reasoning}</p>
          <button
            onClick={handlePredict}
            className="text-xs text-gray-500 hover:text-[var(--accent-cyan)] transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-2 text-xs font-medium rounded bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/80 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Predicting...' : 'MAKE PICK'}
        </button>
      )}
    </div>
  );
}
