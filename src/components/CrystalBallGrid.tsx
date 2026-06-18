'use client';

import { useState } from 'react';
import CrystalBallCard from './CrystalBallCard';
import { CRYSTAL_BALL_QUESTIONS } from '@/data/crystal-ball-questions';
import { CrystalBallCategory } from '@/types/crystal-ball';

const categories: { key: CrystalBallCategory; label: string; color: string }[] = [
  { key: 'champions', label: 'Champions', color: 'text-purple-400 border-purple-500/30' },
  { key: 'players', label: 'Players', color: 'text-blue-400 border-blue-500/30' },
  { key: 'teams', label: 'Teams', color: 'text-emerald-400 border-emerald-500/30' },
  { key: 'other', label: 'Other', color: 'text-gray-400 border-gray-500/30' },
];

export default function CrystalBallGrid() {
  const [activeCategory, setActiveCategory] = useState<CrystalBallCategory | 'all'>('all');

  const filteredQuestions = activeCategory === 'all'
    ? CRYSTAL_BALL_QUESTIONS
    : CRYSTAL_BALL_QUESTIONS.filter((q) => q.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-bold text-[var(--foreground)]">MSI 2025</h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--accent-gold-dim)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/20">
          Crystal Ball
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-[var(--foreground)] text-[var(--background)]'
              : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--card-border)]'
          }`}
        >
          All ({CRYSTAL_BALL_QUESTIONS.length})
        </button>
        {categories.map((cat) => {
          const count = CRYSTAL_BALL_QUESTIONS.filter((q) => q.category === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeCategory === cat.key
                  ? `${cat.color.split(' ')[0]} bg-[var(--card-bg)] border ${cat.color.split(' ')[1]}`
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--card-border)]'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((q) => (
          <CrystalBallCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  );
}
