'use client';

import { useState, useCallback } from 'react';
import { Match } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';
import { Team } from '@/types/team';

const TBD_TEAM: Team = { name: 'TBD', shortName: '???', region: '—' };

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

  const getWinner = useCallback((matchKey: string): Team | null => {
    const pred = predictions[matchKey];
    const match = matches[matchKey];
    if (!pred || !match) return null;
    if (pred.predictedWinner === match.team1.name) return match.team1;
    if (pred.predictedWinner === match.team2.name) return match.team2;
    return null;
  }, [predictions, matches]);

  const getLoser = useCallback((matchKey: string): Team | null => {
    const pred = predictions[matchKey];
    const match = matches[matchKey];
    if (!pred || !match) return null;
    if (pred.predictedWinner === match.team1.name) return match.team2;
    if (pred.predictedWinner === match.team2.name) return match.team1;
    return null;
  }, [predictions, matches]);

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
        propagateResults(matchKey, data);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading((prev) => ({ ...prev, [matchKey]: false }));
    }
  };

  const propagateResults = (matchKey: string, prediction: MatchPrediction) => {
    const match = matches[matchKey];
    if (!match) return;

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

      return updated;
    });
  };

  const isReady = (matchKey: string) => {
    const match = matches[matchKey];
    return match && match.team1.name !== 'TBD' && match.team2.name !== 'TBD';
  };

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
          <BracketMatchCard
            match={matches['ub-sf-1']}
            prediction={predictions['ub-sf-1']}
            loading={loading['ub-sf-1']}
            onPredict={() => handlePredict('ub-sf-1')}
            ready={true}
          />
          <BracketMatchCard
            match={matches['ub-sf-2']}
            prediction={predictions['ub-sf-2']}
            loading={loading['ub-sf-2']}
            onPredict={() => handlePredict('ub-sf-2')}
            ready={true}
          />
        </div>
      </section>

      <section>
        <StageDivider label="Upper Bracket" sublabel="Final" color="cyan" />
        <div className="max-w-md mx-auto mt-4">
          <BracketMatchCard
            match={matches['ub-final']}
            prediction={predictions['ub-final']}
            loading={loading['ub-final']}
            onPredict={() => handlePredict('ub-final')}
            ready={isReady('ub-final')}
          />
        </div>
      </section>

      <section>
        <StageDivider label="Lower Bracket" sublabel="Semifinals" color="gold" />
        <div className="max-w-md mx-auto mt-4">
          <BracketMatchCard
            match={matches['lb-sf']}
            prediction={predictions['lb-sf']}
            loading={loading['lb-sf']}
            onPredict={() => handlePredict('lb-sf')}
            ready={isReady('lb-sf')}
          />
        </div>
      </section>

      <section>
        <StageDivider label="Lower Bracket" sublabel="Final" color="gold" />
        <div className="max-w-md mx-auto mt-4">
          <BracketMatchCard
            match={matches['lb-final']}
            prediction={predictions['lb-final']}
            loading={loading['lb-final']}
            onPredict={() => handlePredict('lb-final')}
            ready={isReady('lb-final')}
          />
        </div>
      </section>

      <section>
        <StageDivider label="Grand Final" color="purple" />
        <div className="max-w-lg mx-auto mt-4">
          <BracketMatchCard
            match={matches['grand-final']}
            prediction={predictions['grand-final']}
            loading={loading['grand-final']}
            onPredict={() => handlePredict('grand-final')}
            ready={isReady('grand-final')}
          />
        </div>
      </section>
    </div>
  );
}

function BracketMatchCard({ match, prediction, loading, onPredict, ready }: {
  match: Match | undefined;
  prediction: MatchPrediction | undefined;
  loading: boolean | undefined;
  onPredict: () => void;
  ready: boolean;
}) {
  if (!match) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-dashed rounded-xl p-6 text-center opacity-40">
        <p className="text-sm text-[var(--foreground-muted)]">Waiting for earlier predictions...</p>
      </div>
    );
  }

  const hasTBD = match.team1.name === 'TBD' || match.team2.name === 'TBD';
  const isWinner = (teamName: string) => prediction?.predictedWinner === teamName;

  return (
    <div className={`card-hover bg-[var(--card-bg)] border rounded-xl overflow-hidden ${
      prediction ? 'border-[var(--accent-cyan)]/30' : 'border-[var(--card-border)]'
    }`}>
      <div className="bg-[var(--background-secondary)] px-4 py-2 flex items-center justify-between border-b border-[var(--card-border)]">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--foreground-muted)]">
          {match.stage}
        </span>
        {prediction && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            <span className="text-[10px] font-bold text-[var(--accent-gold)]">
              {prediction.confidence}% conf
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-stretch gap-3">
          <TeamSlot
            team={match.team1}
            isWinner={isWinner(match.team1.name)}
            isTBD={match.team1.name === 'TBD'}
          />
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-[var(--card-border)] bg-[var(--background)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[var(--foreground-muted)]">VS</span>
            </div>
          </div>
          <TeamSlot
            team={match.team2}
            isWinner={isWinner(match.team2.name)}
            isTBD={match.team2.name === 'TBD'}
          />
        </div>

        {prediction ? (
          <div className="mt-4 pt-3 border-t border-[var(--card-border)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--accent-cyan)]">
                {prediction.predictedWinner}
              </span>
              <span className="text-[10px] font-mono text-[var(--accent-gold)] bg-[var(--accent-gold-dim)] px-2 py-0.5 rounded">
                {prediction.predictedScore}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
              {prediction.reasoning}
            </p>
          </div>
        ) : ready && !hasTBD ? (
          <button
            onClick={onPredict}
            disabled={!!loading}
            className="mt-4 w-full py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[var(--accent-cyan)] to-[#0099cc] text-black hover:shadow-[0_0_20px_var(--accent-cyan-dim)] disabled:opacity-50 transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Predicting...
              </span>
            ) : (
              'Predict Winner'
            )}
          </button>
        ) : (
          <div className="mt-4 py-2.5 text-center text-[11px] text-[var(--foreground-muted)] border border-dashed border-[var(--card-border)] rounded-lg">
            Predict earlier matches first
          </div>
        )}
      </div>
    </div>
  );
}

function TeamSlot({ team, isWinner, isTBD }: { team: Team; isWinner: boolean; isTBD: boolean }) {
  if (isTBD) {
    return (
      <div className="flex-1 rounded-lg p-3 text-center bg-[var(--background-secondary)] border border-dashed border-[var(--card-border)] opacity-50">
        <p className="text-lg font-bold text-[var(--foreground-muted)]">???</p>
        <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">TBD</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 relative rounded-lg p-3 text-center transition-all duration-300 ${
      isWinner
        ? 'bg-[var(--accent-cyan)]/8 border border-[var(--accent-cyan)]/40 shadow-[inset_0_0_20px_var(--accent-cyan-dim)]'
        : 'bg-[var(--background-secondary)] border border-transparent'
    }`}>
      {isWinner && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
          <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
          </svg>
        </div>
      )}
      <p className={`text-lg font-bold tracking-tight ${isWinner ? 'text-[var(--accent-cyan)]' : 'text-[var(--foreground)]'}`}>
        {team.shortName}
      </p>
      <p className="text-[10px] font-medium text-[var(--foreground-muted)] mt-0.5 uppercase tracking-wider">
        {team.region}
      </p>
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
