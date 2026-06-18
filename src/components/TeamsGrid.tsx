'use client';

import { MSI_2025_TEAMS, QualifiedTeam } from '@/data/teams';

const regionColors: Record<string, string> = {
  LCK: 'bg-red-500/10 text-red-400 border-red-500/20',
  LEC: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LCS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  LPL: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  LJL: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  PCS: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  VCS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  CBLOL: 'bg-green-500/10 text-green-400 border-green-500/20',
  LLA: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function TeamsGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">MSI 2025</h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20">
          Qualified Teams
        </span>
        <span className="text-xs text-[var(--foreground-muted)]">
          {MSI_2025_TEAMS.length} teams
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MSI_2025_TEAMS.map((team) => (
          <TeamCard key={team.shortName} team={team} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: QualifiedTeam }) {
  const regionStyle = regionColors[team.league] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  return (
    <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center gap-4">
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src={team.logoUrl}
        alt={team.shortName}
        width={48}
        height={48}
        className="w-12 h-12 rounded-lg object-contain"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-[var(--foreground)] truncate">{team.name}</p>
          {team.seed === 1 && (
            <svg className="w-4 h-4 text-[var(--accent-gold)] shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${regionStyle}`}>
            {team.league}
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">{team.region}</span>
        </div>
      </div>
      <span className="text-lg font-bold text-[var(--foreground-muted)]">{team.shortName}</span>
    </div>
  );
}
