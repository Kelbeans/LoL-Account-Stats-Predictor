'use client';

import { useState } from 'react';
import MatchCard from './MatchCard';
import { Match } from '@/types/match';

const SAMPLE_MATCHES: Match[] = [
  {
    id: 'msi-2025-ub-sf-1',
    team1: { name: 'T1', shortName: 'T1', region: 'LCK' },
    team2: { name: 'Team Liquid', shortName: 'TLAW', region: 'LCS' },
    tournament: 'MSI 2025',
    stage: 'Upper Bracket SF',
  },
  {
    id: 'msi-2025-ub-sf-2',
    team1: { name: 'Karmine Corp', shortName: 'KC', region: 'LEC' },
    team2: { name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LJL' },
    tournament: 'MSI 2025',
    stage: 'Upper Bracket SF',
  },
  {
    id: 'msi-2025-ub-f',
    team1: { name: 'T1', shortName: 'T1', region: 'LCK' },
    team2: { name: 'Karmine Corp', shortName: 'KC', region: 'LEC' },
    tournament: 'MSI 2025',
    stage: 'Upper Bracket Final',
  },
  {
    id: 'msi-2025-lb-sf',
    team1: { name: 'Team Liquid', shortName: 'TLAW', region: 'LCS' },
    team2: { name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LJL' },
    tournament: 'MSI 2025',
    stage: 'Lower Bracket SF',
  },
  {
    id: 'msi-2025-lb-f',
    team1: { name: 'Karmine Corp', shortName: 'KC', region: 'LEC' },
    team2: { name: 'TBD', shortName: 'TBD', region: '—' },
    tournament: 'MSI 2025',
    stage: 'Lower Bracket Final',
  },
  {
    id: 'msi-2025-grand-final',
    team1: { name: 'T1', shortName: 'T1', region: 'LCK' },
    team2: { name: 'TBD', shortName: 'TBD', region: '—' },
    tournament: 'MSI 2025',
    stage: 'Grand Final',
  },
];

export default function BracketView() {
  const [matches] = useState<Match[]>(SAMPLE_MATCHES);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-[var(--accent-gold)]">MSI 2025 — Bracket</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
