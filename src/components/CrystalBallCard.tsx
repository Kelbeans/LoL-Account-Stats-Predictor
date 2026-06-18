'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CrystalBallQuestion, CrystalBallPrediction } from '@/types/crystal-ball';
import { MSI_2026_CONTEXT } from '@/data/tournament-context';

interface CrystalBallCardProps {
  question: CrystalBallQuestion;
}

const DDRAGON = 'https://ddragon.leagueoflegends.com/cdn/15.11.1';

const CHAMPION_NAMES: Record<string, string> = {
  rell: 'Rell',
  rumble: 'Rumble',
  kaisa: 'Kaisa',
  varus: 'Varus',
  aurora: 'Aurora',
  ahri: 'Ahri',
  orianna: 'Orianna',
  jinx: 'Jinx',
  nautilus: 'Nautilus',
  thresh: 'Thresh',
  skarner: 'Skarner',
  viego: 'Viego',
  leesin: 'LeeSin',
  ryze: 'Ryze',
  teemo: 'Teemo',
  tristana: 'Tristana',
  corki: 'Corki',
  ksante: 'KSante',
  zeri: 'Zeri',
  smolder: 'Smolder',
};

function getChampionImageUrl(answer: unknown): string | null {
  if (!answer || typeof answer !== 'string') return null;
  const lower = answer.toLowerCase().replace(/['\s-]/g, '');
  for (const [key, name] of Object.entries(CHAMPION_NAMES)) {
    if (lower.includes(key)) {
      return `${DDRAGON}/img/champion/${name}.png`;
    }
  }
  return null;
}

const categoryConfig: Record<string, { bg: string; text: string; border: string; icon: string; splash: string }> = {
  champions: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    splash: `${DDRAGON}/img/champion/Ahri.png`,
  },
  players: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    splash: `${DDRAGON}/img/champion/LeeSin.png`,
  },
  teams: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    splash: `${DDRAGON}/img/champion/Viego.png`,
  },
  other: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    splash: `${DDRAGON}/img/champion/Teemo.png`,
  },
};

export default function CrystalBallCard({ question }: CrystalBallCardProps) {
  const [prediction, setPrediction] = useState<CrystalBallPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const config = categoryConfig[question.category];

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crystal-ball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          tournamentContext: `${MSI_2026_CONTEXT.instructions}

${MSI_2026_CONTEXT.historicalTrends}`,
        }),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setPrediction(data);
      }
    } catch (err) {
      console.error('Crystal ball prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const champImage = prediction ? getChampionImageUrl(prediction.answer) : null;

  return (
    <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden flex flex-col">
      {/* Header with category image */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--card-bg)]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          {prediction && champImage ? (
            <Image src={champImage} alt={prediction.answer} width={80} height={80} className="rounded-full" />
          ) : (
            <Image src={config.splash} alt={question.category} width={80} height={80} className="rounded-full opacity-50" />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${config.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
              </svg>
              <span className={`text-xs font-bold uppercase tracking-widest ${config.text}`}>
                {question.category}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[var(--background)]/80 rounded-full px-2.5 py-1">
              <span className="text-xs font-bold text-[var(--accent-gold)]">{question.points}</span>
              <span className="text-[10px] text-[var(--foreground-muted)]">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-base text-[var(--foreground)] leading-relaxed mb-5 flex-1 font-medium">
          {question.question}
        </p>

        {prediction ? (
          <div className="space-y-4">
            {/* Champion image + answer */}
            <div className="bg-[var(--background-secondary)] rounded-xl p-4 border border-[var(--card-border)] flex items-center gap-4">
              {champImage && (
                <div className="shrink-0">
                  <Image
                    src={champImage}
                    alt={prediction.answer}
                    width={48}
                    height={48}
                    className="rounded-lg border border-[var(--accent-cyan)]/30"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">Prediction</span>
                  <ConfidenceBadge value={prediction.confidence} />
                </div>
                <p className="text-lg font-bold text-[var(--accent-cyan)] truncate">{prediction.answer}</p>
              </div>
            </div>

            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              {prediction.reasoning}
            </p>

            <button
              onClick={handlePredict}
              className="text-[11px] font-medium text-[var(--foreground-muted)] hover:text-[var(--accent-cyan)] transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh prediction
            </button>
          </div>
        ) : (
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full py-3.5 text-sm font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-[var(--accent-gold)] to-[#e09000] text-black hover:shadow-[0_0_20px_var(--accent-gold-dim)] disabled:opacity-50 transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Predicting...
              </span>
            ) : (
              'MAKE PICK'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 70 ? 'text-[var(--accent-green)]' : value >= 50 ? 'text-[var(--accent-gold)]' : 'text-[var(--accent-red)]';
  return (
    <span className={`text-xs font-bold ${color}`}>
      {value}%
    </span>
  );
}
