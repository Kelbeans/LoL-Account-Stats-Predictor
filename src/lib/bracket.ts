import { Match, TournamentBracket } from '@/types/match';
import { Team } from '@/types/team';

export interface LeaguepediaMatchRow {
  Team1: string;
  Team2: string;
  Winner: string;
  'DateTime UTC': string;
  BestOf?: string;
  Tab: string;
  Team1Score?: string;
  Team2Score?: string;
}

const TBD_TEAM: Team = { name: 'TBD', shortName: '---', region: '—' };

const KNOWN_TEAMS: Record<string, { shortName: string; region: string }> = {
  'Bilibili Gaming': { shortName: 'BLG', region: 'LPL' },
  'Top Esports': { shortName: 'TES', region: 'LPL' },
  'G2 Esports': { shortName: 'G2', region: 'LEC' },
  'Karmine Corp': { shortName: 'KC', region: 'LEC' },
  'Hanwha Life Esports': { shortName: 'HLE', region: 'LCK' },
  'T1': { shortName: 'T1', region: 'LCK' },
  'LYON': { shortName: 'LYON', region: 'LCS' },
  'Team Liquid': { shortName: 'TLAW', region: 'LCS' },
  'Team Secret Whales': { shortName: 'TSW', region: 'LCP' },
  'Deep Cross Gaming': { shortName: 'DCG', region: 'LCP' },
  'FURIA': { shortName: 'FUR', region: 'CBLOL' },
};

export function toTeam(rawName: string): Team {
  const name = rawName.replace(/\s*\(.*\)\s*/g, '').trim();
  if (!name || name === 'TBD') return TBD_TEAM;

  const known = KNOWN_TEAMS[name];
  if (known) return { name, ...known };

  const words = name.split(/\s+/);
  const shortName = words.length > 1
    ? words.map((w) => w[0]).join('').toUpperCase()
    : name.slice(0, 5).toUpperCase();
  return { name, shortName, region: '—' };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildBracket(tournament: string, rows: LeaguepediaMatchRow[]): TournamentBracket {
  const sorted = [...rows].sort((a, b) => (a['DateTime UTC'] || '').localeCompare(b['DateTime UTC'] || ''));
  const stages: TournamentBracket['stages'] = [];
  const stagesByName = new Map<string, Match[]>();

  for (const row of sorted) {
    const team1 = toTeam(row.Team1);
    const team2 = toTeam(row.Team2);

    const match: Match = {
      id: slugify(`${tournament}-${row.Tab}-${row['DateTime UTC']}`),
      team1,
      team2,
      tournament,
      stage: row.Tab,
      date: row['DateTime UTC'],
    };

    if (row.Winner === '1' || row.Winner === '2') {
      const winner = row.Winner === '1' ? team1 : team2;
      const score = row.Team1Score && row.Team2Score ? `${row.Team1Score}-${row.Team2Score}` : '';
      match.result = { winner: winner.name, score };
    }

    let stageMatches = stagesByName.get(row.Tab);
    if (!stageMatches) {
      stageMatches = [];
      stagesByName.set(row.Tab, stageMatches);
      stages.push({ name: row.Tab, matches: stageMatches });
    }
    stageMatches.push(match);
  }

  return { tournament, stages };
}

export function formatTournamentName(tournament: string): string {
  const msi = tournament.match(/^(\d{4}) Mid-Season Invitational$/);
  if (msi) return `MSI ${msi[1]}`;
  const worlds = tournament.match(/^(\d{4}) Season World Championship$/);
  if (worlds) return `Worlds ${worlds[1]}`;
  return tournament;
}

interface SlotSource {
  stage: number;
  match: number;
  take: 'winner' | 'loser';
}

interface WiringEntry {
  stage: number;
  match: number;
  team1: SlotSource;
  team2: SlotSource;
}

// Stage-array indexes for the wiring below: 0 = Round 1, 1 = Round 2, 2 = Round 3, 3 = Round 4, 4 = Finals.
// MSI 8-team double elimination. Round 1 = 4 upper QFs + 2 LB openers (losers pair by play day,
// as on the official Pick'em bracket). LB Round 2 cross-matches to avoid immediate rematches.
const DOUBLE_ELIM_WIRING: WiringEntry[] = [
  { stage: 0, match: 4, team1: { stage: 0, match: 0, take: 'loser' }, team2: { stage: 0, match: 1, take: 'loser' } },
  { stage: 0, match: 5, team1: { stage: 0, match: 2, take: 'loser' }, team2: { stage: 0, match: 3, take: 'loser' } },
  { stage: 1, match: 0, team1: { stage: 0, match: 0, take: 'winner' }, team2: { stage: 0, match: 1, take: 'winner' } },
  { stage: 1, match: 1, team1: { stage: 0, match: 2, take: 'winner' }, team2: { stage: 0, match: 3, take: 'winner' } },
  { stage: 1, match: 2, team1: { stage: 0, match: 4, take: 'winner' }, team2: { stage: 1, match: 1, take: 'loser' } },
  { stage: 1, match: 3, team1: { stage: 0, match: 5, take: 'winner' }, team2: { stage: 1, match: 0, take: 'loser' } },
  { stage: 3, match: 0, team1: { stage: 1, match: 0, take: 'winner' }, team2: { stage: 1, match: 1, take: 'winner' } },
  { stage: 2, match: 0, team1: { stage: 1, match: 2, take: 'winner' }, team2: { stage: 1, match: 3, take: 'winner' } },
  { stage: 3, match: 1, team1: { stage: 3, match: 0, take: 'loser' }, team2: { stage: 2, match: 0, take: 'winner' } },
  { stage: 4, match: 0, team1: { stage: 3, match: 0, take: 'winner' }, team2: { stage: 3, match: 1, take: 'winner' } },
];

function resolveOutcome(match: Match, predictions: Record<string, { predictedWinner: string }>): { winner: Team; loser: Team } | null {
  if (match.team1.name === 'TBD' || match.team2.name === 'TBD') return null;

  const winnerName = match.result?.winner || predictions[match.id]?.predictedWinner;
  if (winnerName === match.team1.name) return { winner: match.team1, loser: match.team2 };
  if (winnerName === match.team2.name) return { winner: match.team2, loser: match.team1 };
  return null;
}

function findKnockoutStageIndexes(bracket: TournamentBracket): (number | null)[] {
  const findStage = (pattern: RegExp, minMatches: number) => {
    const index = bracket.stages.findIndex((s) => pattern.test(s.name) && s.matches.length >= minMatches);
    return index === -1 ? null : index;
  };

  return [
    findStage(/round 1/i, 6),
    findStage(/round 2/i, 4),
    findStage(/round 3/i, 1),
    findStage(/round 4/i, 2),
    findStage(/^(?!.*round).*final/i, 1),
  ];
}

export function projectBracket(
  bracket: TournamentBracket,
  predictions: Record<string, { predictedWinner: string }>,
): TournamentBracket {
  const stageIndexes = findKnockoutStageIndexes(bracket);
  if (stageIndexes.some((i) => i === null)) return bracket;

  const projected: TournamentBracket = {
    ...bracket,
    stages: bracket.stages.map((s) => ({ ...s, matches: s.matches.map((m) => ({ ...m })) })),
  };
  const matchAt = (source: { stage: number; match: number }) =>
    projected.stages[stageIndexes[source.stage]!].matches[source.match];

  for (const entry of DOUBLE_ELIM_WIRING) {
    const target = matchAt(entry);
    for (const slot of ['team1', 'team2'] as const) {
      if (target[slot].name !== 'TBD') continue;
      const outcome = resolveOutcome(matchAt(entry[slot]), predictions);
      if (!outcome) continue;
      target[slot] = outcome[entry[slot].take];
      target[`${slot}Projected`] = true;
    }
  }

  return projected;
}

export interface BracketColumn {
  title: string;
  matches: Match[];
}

export interface KnockoutLayout {
  upper: BracketColumn[];
  lower: BracketColumn[];
  otherStages: TournamentBracket['stages'];
}

export function getKnockoutLayout(bracket: TournamentBracket): KnockoutLayout | null {
  const stageIndexes = findKnockoutStageIndexes(bracket);
  if (stageIndexes.some((i) => i === null)) return null;

  const [r1, r2, r3, r4, finals] = stageIndexes.map((i) => bracket.stages[i!].matches);
  const knockoutStages = new Set(stageIndexes);

  return {
    upper: [
      { title: 'Quarterfinals', matches: r1.slice(0, 4) },
      { title: 'Semifinals', matches: r2.slice(0, 2) },
      { title: 'Upper Final', matches: [r4[0]] },
      { title: 'Grand Final', matches: [finals[0]] },
    ],
    lower: [
      { title: 'Lower Round 1', matches: r1.slice(4, 6) },
      { title: 'Lower Round 2', matches: r2.slice(2, 4) },
      { title: 'Lower Semifinal', matches: [r3[0]] },
      { title: 'Lower Final', matches: [r4[1]] },
    ],
    otherStages: bracket.stages.filter((_, i) => !knockoutStages.has(i)),
  };
}

export interface PlayInLayout {
  upper: BracketColumn[];
  lower: BracketColumn[];
  stageNames: string[];
}

// MSI play-in: 4-team double elimination spread across four day tabs.
// Day 1 = two openers; Day 2 = winners final + elimination match; Day 3 = losers final; Day 4 = play-in final.
export function getPlayInLayout(bracket: TournamentBracket): PlayInLayout | null {
  const dayStages = [
    { pattern: /play-?in day 1/i, minMatches: 2 },
    { pattern: /play-?in day 2/i, minMatches: 2 },
    { pattern: /play-?in day 3/i, minMatches: 1 },
    { pattern: /play-?in day 4/i, minMatches: 1 },
  ].map(({ pattern, minMatches }) =>
    bracket.stages.find((s) => pattern.test(s.name) && s.matches.length >= minMatches) || null
  );
  if (dayStages.some((s) => s === null)) return null;

  const [d1, d2, d3, d4] = dayStages as TournamentBracket['stages'];

  return {
    upper: [
      { title: 'Opening Round', matches: d1.matches.slice(0, 2) },
      { title: 'Winners Final', matches: [d2.matches[0]] },
      { title: 'Play-In Final', matches: [d4.matches[0]] },
    ],
    lower: [
      { title: 'Elimination Match', matches: [d2.matches[1]] },
      { title: 'Losers Final', matches: [d3.matches[0]] },
    ],
    stageNames: [d1.name, d2.name, d3.name, d4.name],
  };
}

export function getCurrentStageName(bracket: TournamentBracket): string | null {
  if (bracket.stages.length === 0) return null;

  for (const stage of bracket.stages) {
    if (stage.matches.some((m) => !m.result)) return stage.name;
  }
  return bracket.stages[bracket.stages.length - 1].name;
}
