'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MSI_2025_TEAMS, QualifiedTeam } from '@/data/teams';

const regionColors: Record<string, string> = {
  LCK: 'bg-red-500/10 text-red-400 border-red-500/20',
  LEC: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LCS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  LPL: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  LCP: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  CBLOL: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const roleIcons: Record<string, string> = {
  Top: 'M4 4h7v7H4V4z',
  Jungle: 'M12 2l4 8-4 4-4-4 4-8z',
  Mid: 'M12 2l10 10-10 10L2 12 12 2z',
  Bot: 'M4 13h7v7H4v-7z',
  Support: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
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
  const [showModal, setShowModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const regionStyle = regionColors[team.league] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShowModal(true), 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowModal(false);
  };

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center gap-4 cursor-pointer">
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
            <span className="text-xs text-[var(--foreground-muted)]">Seed #{team.seed}</span>
          </div>
        </div>
        <span className="text-lg font-bold text-[var(--foreground-muted)]">{team.shortName}</span>
      </div>

      {showModal && (
        <TeamModal team={team} cardRef={cardRef} />
      )}
    </div>
  );
}

function TeamModal({ team, cardRef }: { team: QualifiedTeam; cardRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const regionStyle = regionColors[team.league] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const modalHeight = 400;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow > modalHeight ? rect.bottom + 8 : rect.top - modalHeight - 8;
      const left = Math.min(rect.left, window.innerWidth - 360);
      setPos({ top: Math.max(8, top), left: Math.max(8, left) });
    }
  }, [cardRef]);

  return createPortal(
    <div
      className="fixed z-[9999] w-[340px] max-h-[400px] overflow-y-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xl shadow-black/60 pointer-events-none"
      style={{ top: pos.top, left: pos.left }}
    >
      {/* Header */}
      <div className="bg-[var(--background-secondary)] p-4 border-b border-[var(--card-border)] flex items-center gap-4">
        {/* eslint-disable @next/next/no-img-element */}
        <img
          src={team.logoUrl}
          alt={team.shortName}
          width={56}
          height={56}
          className="w-14 h-14 rounded-xl object-contain"
        />
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">{team.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${regionStyle}`}>
              {team.league}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">Seed #{team.seed}</span>
          </div>
        </div>
      </div>

      {/* Titles */}
      {team.titles && (
        <div className="px-4 py-2 border-b border-[var(--card-border)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--accent-gold)] font-semibold">{team.titles}</p>
        </div>
      )}

      {/* Roster */}
      {team.players && team.players.length > 0 && (
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] font-semibold mb-3">Roster</p>
          <div className="space-y-2">
            {team.players.map((player) => (
              <div key={player.ign} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[var(--background-secondary)] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[var(--foreground-muted)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d={roleIcons[player.role] || roleIcons.Mid} />
                  </svg>
                </div>
                <span className="text-xs text-[var(--foreground-muted)] w-14">{player.role}</span>
                <span className="text-sm font-semibold text-[var(--foreground)]">{player.ign}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach */}
      {team.coach && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
            <span className="text-xs text-[var(--foreground-muted)]">Coach:</span>
            <span className="text-sm font-medium text-[var(--foreground)]">{team.coach}</span>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
