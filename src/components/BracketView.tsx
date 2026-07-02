'use client';

import { useState, useEffect } from 'react';
import { Match, TournamentBracket } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';
import { Team } from '@/types/team';
import { TEAM_LOGOS } from '@/data/team-logos';
import { formatTournamentName, getCurrentStageName, getKnockoutLayout, getPlayInLayout, projectBracket, BracketColumn } from '@/lib/bracket';
import { saveToStorage, removeFromStorage, loadAllPredictions } from '@/lib/storage';
import LoadingSpinner from './LoadingSpinner';
import ErrorCard from './ErrorCard';

export default function BracketView() {
  const [bracket, setBracket] = useState<TournamentBracket | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Record<string, MatchPrediction>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [fetchAttempt, setFetchAttempt] = useState(0);

  useEffect(() => {
    // Drop the pre-live-data snapshot so stale MSI 2025 matches never resurface
    removeFromStorage('bracket:matches');
    fetch('/api/bracket')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setFetchError(data.error);
        } else {
          setBracket(data);
          setPredictions(loadAllPredictions<MatchPrediction>('bracket:'));
        }
      })
      .catch(() => setFetchError('Failed to load bracket'));
  }, [fetchAttempt]);

  const handlePredict = async (match: Match) => {
    setLoading((prev) => ({ ...prev, [match.id]: true }));
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match),
      });
      const data = await res.json();
      if (res.ok && !data.error) {
        setPredictions((prev) => ({ ...prev, [match.id]: data }));
        saveToStorage(`bracket:${match.id}`, data);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading((prev) => ({ ...prev, [match.id]: false }));
    }
  };

  const retryFetch = () => {
    setFetchError(null);
    setBracket(null);
    setFetchAttempt((attempt) => attempt + 1);
  };

  if (fetchError) {
    return <ErrorCard message={fetchError} onRetry={retryFetch} />;
  }

  if (!bracket) {
    return (
      <div className="py-16">
        <LoadingSpinner size="lg" label="Loading live bracket..." />
      </div>
    );
  }

  const currentStage = getCurrentStageName(bracket);
  const displayBracket = projectBracket(bracket, predictions);
  const layout = getKnockoutLayout(displayBracket);
  const playInLayout = getPlayInLayout(displayBracket);
  const playInStages = new Set(playInLayout?.stageNames ?? []);

  const stageSection = (stage: { name: string; matches: Match[] }) => (
    <div key={stage.name}>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wide">{stage.name}</h3>
        {stage.name === currentStage && (
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--accent-gold-dim)] text-[var(--accent-gold)]">
            Current
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-6">
        {stage.matches.map((match) => (
          <BracketSlot
            key={match.id}
            match={match}
            prediction={predictions[match.id]}
            loading={loading[match.id]}
            onPredict={() => handlePredict(match)}
            isGrandFinal={/final/i.test(stage.name)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">{formatTournamentName(bracket.tournament)}</h2>
        {currentStage && (
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/20">
            {currentStage}
          </span>
        )}
      </div>

      {playInLayout && (
        <>
          <BracketSection
            title="Play-In"
            columns={playInLayout.upper}
            predictions={predictions}
            loading={loading}
            onPredict={handlePredict}
          />
          <BracketSection
            title="Play-In — Lower Bracket"
            columns={playInLayout.lower}
            predictions={predictions}
            loading={loading}
            onPredict={handlePredict}
          />
        </>
      )}

      {layout ? (
        <>
          {layout.otherStages.filter((s) => !playInStages.has(s.name)).map(stageSection)}
          <BracketSection
            title="Upper Bracket"
            columns={layout.upper}
            predictions={predictions}
            loading={loading}
            onPredict={handlePredict}
          />
          <BracketSection
            title="Lower Bracket"
            columns={layout.lower}
            predictions={predictions}
            loading={loading}
            onPredict={handlePredict}
          />
        </>
      ) : (
        displayBracket.stages.filter((s) => !playInStages.has(s.name)).map(stageSection)
      )}
    </div>
  );
}

function BracketSection({ title, columns, predictions, loading, onPredict }: {
  title: string;
  columns: BracketColumn[];
  predictions: Record<string, MatchPrediction>;
  loading: Record<string, boolean>;
  onPredict: (match: Match) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-bold text-[var(--foreground)] uppercase tracking-wide mb-4">{title}</h3>
      <div className="flex items-stretch gap-0 overflow-x-auto pb-4">
        {columns.map((column, i) => (
          <div key={column.title} className="flex items-stretch shrink-0">
            {i > 0 && (
              <div className="flex items-center px-1">
                <div className="w-6 h-px bg-[var(--card-border)]" />
              </div>
            )}
            <div className="flex flex-col">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2 text-center mb-4">
                <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">{column.title}</p>
              </div>
              <div className="flex flex-col justify-around gap-6 flex-1">
                {column.matches.map((match) => (
                  <BracketSlot
                    key={match.id}
                    match={match}
                    prediction={predictions[match.id]}
                    loading={loading[match.id]}
                    onPredict={() => onPredict(match)}
                    isGrandFinal={column.title === 'Grand Final'}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BracketSlot({ match, prediction, loading, onPredict, isGrandFinal }: {
  match: Match;
  prediction: MatchPrediction | undefined;
  loading: boolean | undefined;
  onPredict: () => void;
  isGrandFinal?: boolean;
}) {
  const hasTBD = match.team1.name === 'TBD' || match.team2.name === 'TBD';
  const finished = Boolean(match.result);
  const canPredict = !hasTBD && !finished && !prediction;

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
      {match.date && (
        <div className="px-4 py-1.5 bg-[var(--background-secondary)] border-b border-[var(--card-border)]">
          <span className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">
            {match.date.slice(0, 10)}
          </span>
        </div>
      )}

      {/* Team 1 */}
      <TeamRow
        team={match.team1}
        isWinner={finished ? match.result!.winner === match.team1.name : prediction?.predictedWinner === match.team1.name}
        isTBD={match.team1.name === 'TBD'}
        isProjected={match.team1Projected}
      />

      {/* Divider */}
      <div className="h-px bg-[var(--card-border)]" />

      {/* Team 2 */}
      <TeamRow
        team={match.team2}
        isWinner={finished ? match.result!.winner === match.team2.name : prediction?.predictedWinner === match.team2.name}
        isTBD={match.team2.name === 'TBD'}
        isProjected={match.team2Projected}
      />

      {/* Result, prediction info, or action */}
      {finished && (
        <div className="bg-[var(--accent-gold)]/5 px-4 py-2.5 border-t border-[var(--card-border)] flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--accent-gold)]">Final{match.result!.score ? ` ${match.result!.score}` : ''}</span>
          {prediction && (
            <span className={`text-xs ${prediction.predictedWinner === match.result!.winner ? 'text-[var(--accent-cyan)]' : 'text-red-400'}`}>
              {prediction.predictedWinner === match.result!.winner ? 'Pick correct' : 'Pick missed'}
            </span>
          )}
        </div>
      )}
      {!finished && loading && (
        <div className="bg-[var(--accent-cyan)]/5 px-4 py-2.5 border-t border-[var(--card-border)] flex items-center justify-center gap-2">
          <span className="w-3 h-3 border-2 border-[var(--accent-cyan)]/30 border-t-[var(--accent-cyan)] rounded-full animate-spin" />
          <span className="text-xs text-[var(--accent-cyan)]">Predicting...</span>
        </div>
      )}
      {!finished && prediction && (
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

function TeamRow({ team, isWinner, isTBD, isProjected }: {
  team: Team;
  isWinner: boolean;
  isTBD: boolean;
  isProjected?: boolean;
}) {
  if (isTBD) {
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
      <span className={`text-base font-bold flex-1 ${isProjected ? 'italic opacity-60' : ''} ${
        isWinner ? 'text-[var(--accent-cyan)]' : 'text-[var(--foreground)]'
      }`}>
        {team.shortName}
      </span>
      {isProjected && !isWinner && (
        <span className="text-[9px] uppercase tracking-wider text-[var(--foreground-muted)]">projected</span>
      )}
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
