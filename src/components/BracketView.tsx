'use client';

import { useState, useCallback, useEffect } from 'react';
import { Match } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';
import { Team } from '@/types/team';
import { TEAM_LOGOS } from '@/data/team-logos';
import { loadFromStorage, saveToStorage, loadAllPredictions } from '@/lib/storage';

const TBD_TEAM: Team = { name: 'TBD', shortName: '---', region: '—' };

const INITIAL_MATCHES: Record<string, Match> = {
  'ub-sf-1': {
    id: 'msi-2025-ub-sf-1',
    team1: { name: 'T1', shortName: 'T1', region: 'LCK' },
    team2: { name: 'Team Liquid', shortName: 'TLAW', region: 'LCS' },
    tournament: 'MSI 2025',
    stage: 'Upper Bracket SF',
  },
  'ub-sf-2': {
    id: 'msi-2025-ub-sf-2',
    team1: { name: 'Karmine Corp', shortName: 'KC', region: 'LEC' },
    team2: { name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LJL' },
    tournament: 'MSI 2025',
    stage: 'Upper Bracket SF',
  },
};


export default function BracketView() {
  const [matches, setMatches] = useState<Record<string, Match>>(INITIAL_MATCHES);
  const [predictions, setPredictions] = useState<Record<string, MatchPrediction>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedPredictions = loadAllPredictions<MatchPrediction>('bracket:');
    if (Object.keys(savedPredictions).length > 0) {
      setPredictions(savedPredictions);
    }
    const savedMatches = loadFromStorage<Record<string, Match>>('bracket:matches');
    if (savedMatches) {
      setMatches((prev) => ({ ...prev, ...savedMatches }));
    }
  }, []);

  const handlePredict = async (matchKey: string) => {
    const match = matches[matchKey];
    if (!match || match.team1.name === 'TBD' || match.team2.name === 'TBD') return;

    setLoading((prev) => ({ ...prev, [matchKey]: true }));
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setPredictions((prev) => ({ ...prev, [matchKey]: data }));
        saveToStorage(`bracket:${matchKey}`, data);
        propagateResults(matchKey, data, match);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading((prev) => ({ ...prev, [matchKey]: false }));
    }
  };

  const propagateResults = (matchKey: string, prediction: MatchPrediction, match: Match) => {
    const winner = prediction.predictedWinner === match.team1.name ? match.team1 : match.team2;
    const loser = prediction.predictedWinner === match.team1.name ? match.team2 : match.team1;

    setMatches((prev) => {
      const updated = { ...prev };

      if (matchKey === 'ub-sf-1') {
        updated['ub-final'] = {
          id: 'msi-2025-ub-final',
          team1: winner,
          team2: prev['ub-final']?.team2 || TBD_TEAM,
          tournament: 'MSI 2025',
          stage: 'Upper Bracket Final',
        };
        updated['lb-sf'] = {
          id: 'msi-2025-lb-sf',
          team1: loser,
          team2: prev['lb-sf']?.team2 || TBD_TEAM,
          tournament: 'MSI 2025',
          stage: 'Lower Bracket SF',
        };
      }

      if (matchKey === 'ub-sf-2') {
        updated['ub-final'] = {
          id: 'msi-2025-ub-final',
          team1: prev['ub-final']?.team1 || TBD_TEAM,
          team2: winner,
          tournament: 'MSI 2025',
          stage: 'Upper Bracket Final',
        };
        updated['lb-sf'] = {
          id: 'msi-2025-lb-sf',
          team1: prev['lb-sf']?.team1 || TBD_TEAM,
          team2: loser,
          tournament: 'MSI 2025',
          stage: 'Lower Bracket SF',
        };
      }

      if (matchKey === 'ub-final') {
        updated['grand-final'] = {
          id: 'msi-2025-grand-final',
          team1: winner,
          team2: prev['grand-final']?.team2 || TBD_TEAM,
          tournament: 'MSI 2025',
          stage: 'Grand Final',
        };
        updated['lb-final'] = {
          id: 'msi-2025-lb-final',
          team1: prev['lb-final']?.team1 || TBD_TEAM,
          team2: loser,
          tournament: 'MSI 2025',
          stage: 'Lower Bracket Final',
        };
      }

      if (matchKey === 'lb-sf') {
        updated['lb-final'] = {
          id: 'msi-2025-lb-final',
          team1: winner,
          team2: prev['lb-final']?.team2 || TBD_TEAM,
          tournament: 'MSI 2025',
          stage: 'Lower Bracket Final',
        };
      }

      if (matchKey === 'lb-final') {
        updated['grand-final'] = {
          id: 'msi-2025-grand-final',
          team1: prev['grand-final']?.team1 || TBD_TEAM,
          team2: winner,
          tournament: 'MSI 2025',
          stage: 'Grand Final',
        };
      }

      saveToStorage('bracket:matches', updated);
      return updated;
    });
  };

  const isReady = (matchKey: string) => {
    const match = matches[matchKey];
    return match && match.team1.name !== 'TBD' && match.team2.name !== 'TBD';
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">MSI 2025</h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20">
          Bracket Stage
        </span>
      </div>

      {/* UPPER BRACKET */}
      <div>
        <div className="flex items-center gap-6 overflow-x-auto pb-4">
          {/* Round 1: Semifinals */}
          <div className="flex flex-col gap-6 shrink-0">
            <BracketSlot
              match={matches['ub-sf-1']}
              prediction={predictions['ub-sf-1']}
              loading={loading['ub-sf-1']}
              onPredict={() => handlePredict('ub-sf-1')}
              ready={true}
            />
            <BracketSlot
              match={matches['ub-sf-2']}
              prediction={predictions['ub-sf-2']}
              loading={loading['ub-sf-2']}
              onPredict={() => handlePredict('ub-sf-2')}
              ready={true}
            />
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-8 h-px bg-[var(--card-border)]" />
          </div>

          {/* Round 2: Upper Final */}
          <div className="shrink-0">
            <BracketSlot
              match={matches['ub-final']}
              prediction={predictions['ub-final']}
              loading={loading['ub-final']}
              onPredict={() => handlePredict('ub-final')}
              ready={isReady('ub-final')}
            />
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-8 h-px bg-[var(--card-border)]" />
          </div>

          {/* Grand Final */}
          <div className="shrink-0">
            <BracketSlot
              match={matches['grand-final']}
              prediction={predictions['grand-final']}
              loading={loading['grand-final']}
              onPredict={() => handlePredict('grand-final')}
              ready={isReady('grand-final')}
              isGrandFinal
            />
          </div>
        </div>
      </div>

      {/* LOWER BRACKET */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wide">Lower Bracket</h3>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-center">
            <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Lower Bracket - Semifinals</p>
            <p className="text-[10px] text-[var(--accent-gold)]">10 pts / Pick</p>
          </div>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-center">
            <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Lower Bracket - Finals</p>
            <p className="text-[10px] text-[var(--accent-gold)]">20 pts / Pick</p>
          </div>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto pb-4">
          {/* LB Semis */}
          <div className="shrink-0">
            <BracketSlot
              match={matches['lb-sf']}
              prediction={predictions['lb-sf']}
              loading={loading['lb-sf']}
              onPredict={() => handlePredict('lb-sf')}
              ready={isReady('lb-sf')}
            />
          </div>

          {/* Connector */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-8 h-px bg-[var(--card-border)]" />
          </div>

          {/* LB Finals */}
          <div className="shrink-0">
            <BracketSlot
              match={matches['lb-final']}
              prediction={predictions['lb-final']}
              loading={loading['lb-final']}
              onPredict={() => handlePredict('lb-final')}
              ready={isReady('lb-final')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BracketSlot({ match, prediction, loading, onPredict, ready, isGrandFinal }: {
  match: Match | undefined;
  prediction: MatchPrediction | undefined;
  loading: boolean | undefined;
  onPredict: () => void;
  ready: boolean;
  isGrandFinal?: boolean;
}) {
  const hasTBD = !match || match.team1.name === 'TBD' || match.team2.name === 'TBD';
  const canPredict = ready && !hasTBD && !prediction;

  return (
    <div
      className={`w-[280px] rounded-xl border overflow-hidden transition-all duration-200 ${
        isGrandFinal
          ? 'border-[var(--accent-gold)]/40 shadow-[0_0_20px_var(--accent-gold-dim)]'
          : prediction
            ? 'border-[var(--accent-cyan)]/30 shadow-[0_0_10px_var(--accent-cyan-dim)]'
            : 'border-[var(--card-border)]'
      } ${canPredict ? 'cursor-pointer hover:border-[var(--accent-cyan)]/50 hover:shadow-[0_0_15px_var(--accent-cyan-dim)]' : ''}`}
      onClick={canPredict ? onPredict : undefined}
    >
      {/* Team 1 */}
      <TeamRow
        team={match?.team1}
        isWinner={prediction?.predictedWinner === match?.team1.name}
        isTBD={!match || match.team1.name === 'TBD'}
      />

      {/* Divider */}
      <div className="h-px bg-[var(--card-border)]" />

      {/* Team 2 */}
      <TeamRow
        team={match?.team2}
        isWinner={prediction?.predictedWinner === match?.team2.name}
        isTBD={!match || match.team2.name === 'TBD'}
      />

      {/* Prediction info or action */}
      {loading && (
        <div className="bg-[var(--accent-cyan)]/5 px-4 py-2.5 border-t border-[var(--card-border)] flex items-center justify-center gap-2">
          <span className="w-3 h-3 border-2 border-[var(--accent-cyan)]/30 border-t-[var(--accent-cyan)] rounded-full animate-spin" />
          <span className="text-xs text-[var(--accent-cyan)]">Predicting...</span>
        </div>
      )}
      {prediction && (
        <div className="bg-[var(--accent-cyan)]/5 px-4 py-2.5 border-t border-[var(--card-border)] flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--accent-cyan)]">{prediction.predictedScore}</span>
          <span className="text-xs text-[var(--accent-gold)]">{prediction.confidence}% confidence</span>
        </div>
      )}
      {canPredict && !loading && (
        <div className="bg-[var(--background-secondary)] px-4 py-2.5 border-t border-[var(--card-border)] text-center">
          <span className="text-xs text-[var(--accent-cyan)] font-semibold">Click to predict</span>
        </div>
      )}
    </div>
  );
}

function TeamRow({ team, isWinner, isTBD }: {
  team: Team | undefined;
  isWinner: boolean;
  isTBD: boolean;
}) {
  if (isTBD || !team) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 bg-[var(--card-bg)] opacity-40">
        <div className="w-8 h-8 rounded-lg bg-[var(--card-border)] flex items-center justify-center">
          <span className="text-xs text-[var(--foreground-muted)]">?</span>
        </div>
        <span className="text-base font-medium text-[var(--foreground-muted)]">---</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${
      isWinner
        ? 'bg-[var(--accent-cyan)]/8'
        : 'bg-[var(--card-bg)]'
    }`}>
      <TeamLogo shortName={team.shortName} />
      <span className={`text-base font-bold flex-1 ${
        isWinner ? 'text-[var(--accent-cyan)]' : 'text-[var(--foreground)]'
      }`}>
        {team.shortName}
      </span>
      {isWinner && (
        <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </div>
  );
}

function TeamLogo({ shortName }: { shortName: string }) {
  const src = TEAM_LOGOS[shortName];
  if (!src) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[var(--card-border)] flex items-center justify-center">
        <span className="text-[10px] font-bold text-[var(--foreground-muted)]">{shortName.slice(0, 2)}</span>
      </div>
    );
  }
  /* eslint-disable @next/next/no-img-element */
  return <img src={src} alt={shortName} width={32} height={32} className="w-8 h-8 rounded-lg" />;
}
