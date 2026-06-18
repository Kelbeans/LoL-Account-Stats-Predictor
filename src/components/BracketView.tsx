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

  const upperSF = matches.filter((m) => m.stage === 'Upper Bracket SF');
  const upperFinal = matches.filter((m) => m.stage === 'Upper Bracket Final');
  const lowerSF = matches.filter((m) => m.stage === 'Lower Bracket SF');
  const lowerFinal = matches.filter((m) => m.stage === 'Lower Bracket Final');
  const grandFinal = matches.filter((m) => m.stage === 'Grand Final');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-bold text-[var(--foreground)]">MSI 2025</h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20">
          Bracket Stage
        </span>
      </div>

      <section>
        <StageDivider label="Upper Bracket" sublabel="Semifinals" color="cyan" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {upperSF.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section>
        <StageDivider label="Upper Bracket" sublabel="Final" color="cyan" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 max-w-md mx-auto gap-4 mt-4">
          {upperFinal.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section>
        <StageDivider label="Lower Bracket" sublabel="Semifinals" color="gold" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {lowerSF.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section>
        <StageDivider label="Lower Bracket" sublabel="Final" color="gold" />
        <div className="grid grid-cols-1 max-w-md mx-auto gap-4 mt-4">
          {lowerFinal.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      <section>
        <StageDivider label="Grand Final" color="purple" />
        <div className="grid grid-cols-1 max-w-lg mx-auto gap-4 mt-4">
          {grandFinal.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StageDivider({ label, sublabel, color }: { label: string; sublabel?: string; color: 'cyan' | 'gold' | 'purple' }) {
  const colors = {
    cyan: 'from-[var(--accent-cyan)]/30 text-[var(--accent-cyan)]',
    gold: 'from-[var(--accent-gold)]/30 text-[var(--accent-gold)]',
    purple: 'from-[var(--accent-purple)]/30 text-[var(--accent-purple)]',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`h-px flex-1 bg-gradient-to-r ${colors[color]} to-transparent`} />
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wider ${colors[color].split(' ')[1]}`}>
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] text-[var(--foreground-muted)]">{sublabel}</span>
        )}
      </div>
      <div className={`h-px flex-1 bg-gradient-to-l ${colors[color]} to-transparent`} />
    </div>
  );
}
