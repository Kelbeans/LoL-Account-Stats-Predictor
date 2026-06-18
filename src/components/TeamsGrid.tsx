'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MSI_2025_TEAMS, QualifiedTeam } from '@/data/teams';
import { TEAM_LOGOS } from '@/data/team-logos';

interface LiveTeam {
  name: string;
  region: string;
  seed: number;
  logoUrl: string | null;
  players: { ign: string; role: string }[];
  coaches: string[];
}

const regionColors: Record<string, string> = {
  LCK: 'bg-red-500/10 text-red-400 border-red-500/20',
  LEC: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  LCS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  LPL: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  LCP: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  CBLOL: 'bg-green-500/10 text-green-400 border-green-500/20',
  PCS: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  VCS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

const roleImages: Record<string, string> = {
  Top: '/roles/top.svg',
  Jungle: '/roles/jungle.svg',
  Mid: '/roles/mid.svg',
  Bot: '/roles/bot.svg',
  Support: '/roles/support.svg',
};

export default function TeamsGrid() {
  const [liveTeams, setLiveTeams] = useState<LiveTeam[]>([]);
  const [tournament, setTournament] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tournament')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTournament(data.tournament);
          setLiveTeams(data.teams);
        }
      })
      .catch(() => setError('Failed to fetch live tournament data'))
      .finally(() => setLoading(false));
  }, []);

  const displayTeams = liveTeams.length > 0 ? liveTeams : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          {tournament || 'MSI 2026'}
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20">
          {loading ? 'Loading...' : 'Live Data'}
        </span>
      </div>

      {error && (
        <div className="bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 rounded-xl p-4">
          <p className="text-sm text-red-300">{error}</p>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">Showing cached team data below</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-shimmer bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl h-24" />
          ))}
        </div>
      ) : displayTeams ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayTeams.map((team) => (
            <LiveTeamCard key={team.name} team={team} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MSI_2025_TEAMS.map((team) => (
            <FallbackTeamCard key={team.shortName} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}

function LiveTeamCard({ team }: { team: LiveTeam }) {
  const [showModal, setShowModal] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const logoUrl = team.logoUrl || TEAM_LOGOS[team.name] || null;

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
        {logoUrl ? (
          <img src={logoUrl} alt={team.name} width={48} height={48} className="w-12 h-12 rounded-lg object-contain" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-[var(--card-border)] flex items-center justify-center">
            <span className="text-sm font-bold text-[var(--foreground-muted)]">{team.name.slice(0, 2)}</span>
          </div>
        )}
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
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${regionColors[team.region] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
              {team.region}
            </span>
            <span className="text-xs text-[var(--foreground-muted)]">Seed #{team.seed}</span>
          </div>
        </div>
      </div>

      {showModal && (
        <LiveTeamModal team={team} cardRef={cardRef} logoUrl={logoUrl} />
      )}
    </div>
  );
}

function LiveTeamModal({ team, cardRef, logoUrl }: { team: LiveTeam; cardRef: React.RefObject<HTMLDivElement | null>; logoUrl: string | null }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const modalHeight = 350;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow > modalHeight ? rect.bottom + 8 : rect.top - modalHeight - 8;
      const left = Math.min(rect.left, window.innerWidth - 360);
      setPos({ top: Math.max(8, top), left: Math.max(8, left) });
    }
  }, [cardRef]);

  return createPortal(
    <div
      className="fixed z-[9999] w-[340px] max-h-[380px] overflow-y-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xl shadow-black/60 pointer-events-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="bg-[var(--background-secondary)] p-4 border-b border-[var(--card-border)] flex items-center gap-4">
        {logoUrl ? (
          <img src={logoUrl} alt={team.name} width={56} height={56} className="w-14 h-14 rounded-xl object-contain" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-[var(--card-border)] flex items-center justify-center">
            <span className="text-lg font-bold text-[var(--foreground-muted)]">{team.name.slice(0, 3)}</span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">{team.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${regionColors[team.region] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
              {team.region}
            </span>
            <span className="text-[10px] text-[var(--foreground-muted)]">Seed #{team.seed}</span>
          </div>
        </div>
      </div>

      {team.players.length > 0 && (
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted)] font-semibold mb-3">Roster</p>
          <div className="space-y-2">
            {team.players.map((player) => (
              <div key={player.ign} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[var(--background-secondary)] flex items-center justify-center p-0.5">
                  <img src={roleImages[player.role] || roleImages.Mid} alt={player.role} className="w-full h-full" />
                </div>
                <span className="text-xs text-[var(--foreground-muted)] w-14">{player.role}</span>
                <span className="text-sm font-semibold text-[var(--foreground)]">{player.ign}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {team.coaches.length > 0 && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
            <span className="text-xs text-[var(--foreground-muted)]">Coach:</span>
            <span className="text-sm font-medium text-[var(--foreground)]">{team.coaches.join(', ')}</span>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

function FallbackTeamCard({ team }: { team: QualifiedTeam }) {
  return (
    <div className="card-hover bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center gap-4">
      <img src={team.logoUrl} alt={team.shortName} width={48} height={48} className="w-12 h-12 rounded-lg object-contain" />
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold text-[var(--foreground)] truncate">{team.name}</p>
        <span className="text-xs text-[var(--foreground-muted)]">{team.league} Seed #{team.seed}</span>
      </div>
      <span className="text-lg font-bold text-[var(--foreground-muted)]">{team.shortName}</span>
    </div>
  );
}
