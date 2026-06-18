'use client';

import CrystalBallCard from './CrystalBallCard';
import { MSI_2025_QUESTIONS } from '@/data/crystal-ball-questions';
import { CrystalBallCategory } from '@/types/crystal-ball';

const categories: { key: CrystalBallCategory; label: string }[] = [
  { key: 'champions', label: 'Champions' },
  { key: 'players', label: 'Players' },
  { key: 'teams', label: 'Teams' },
  { key: 'other', label: 'Other' },
];

export default function CrystalBallGrid() {
  return (
    <div className="space-y-8">
      <h2 className="text-lg font-bold text-[var(--accent-gold)]">MSI 2025 — Crystal Ball</h2>
      {categories.map((cat) => {
        const questions = MSI_2025_QUESTIONS.filter((q) => q.category === cat.key);
        return (
          <div key={cat.key}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              {cat.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((q) => (
                <CrystalBallCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
