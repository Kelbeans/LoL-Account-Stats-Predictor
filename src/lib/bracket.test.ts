import { describe, it, expect } from 'vitest';
import { buildBracket, formatTournamentName, getCurrentStageName, getKnockoutLayout, getPlayInLayout, projectBracket, toTeam, LeaguepediaMatchRow } from './bracket';

const ROWS: LeaguepediaMatchRow[] = [
  { Team1: 'T1', Team2: 'Team Liquid', Winner: '1', 'DateTime UTC': '2026-06-28 03:00:00', BestOf: '5', Tab: 'Play-In Day 1' },
  { Team1: 'Karmine Corp', Team2: 'Deep Cross Gaming', Winner: '1', 'DateTime UTC': '2026-06-28 08:00:00', BestOf: '5', Tab: 'Play-In Day 1' },
  { Team1: 'Hanwha Life Esports', Team2: 'Team Secret Whales', Winner: '', 'DateTime UTC': '2026-07-03 03:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
  { Team1: 'Bilibili Gaming', Team2: 'T1', Winner: '', 'DateTime UTC': '2026-07-04 08:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
  { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-05 08:00:00', BestOf: '5', Tab: 'Bracket Round 2' },
  { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-12 08:00:00', BestOf: '5', Tab: 'Finals' },
];

describe('toTeam', () => {
  it('maps a known team name to its short name and region', () => {
    expect(toTeam('Hanwha Life Esports')).toEqual({ name: 'Hanwha Life Esports', shortName: 'HLE', region: 'LCK' });
  });

  it('maps TBD to the placeholder team', () => {
    expect(toTeam('TBD')).toEqual({ name: 'TBD', shortName: '---', region: '—' });
  });

  it('falls back to initials for unknown team names', () => {
    expect(toTeam('Some New Team')).toEqual({ name: 'Some New Team', shortName: 'SNT', region: '—' });
  });

  it('strips parenthetical qualifiers from names', () => {
    expect(toTeam('LYON (2024 American Team)')).toEqual({ name: 'LYON', shortName: 'LYON', region: 'LCS' });
  });
});

describe('buildBracket', () => {
  const bracket = buildBracket('2026 Mid-Season Invitational', ROWS);

  it('groups matches into stages by Tab, ordered by first match date', () => {
    expect(bracket.stages.map((s) => s.name)).toEqual([
      'Play-In Day 1',
      'Bracket Round 1',
      'Bracket Round 2',
      'Finals',
    ]);
    expect(bracket.stages[0].matches).toHaveLength(2);
  });

  it('sets the tournament name', () => {
    expect(bracket.tournament).toBe('2026 Mid-Season Invitational');
  });

  it('marks finished matches with the winning team name', () => {
    const finished = bracket.stages[0].matches[0];
    expect(finished.result).toEqual({ winner: 'T1', score: '' });
  });

  it('formats the score when Leaguepedia provides game counts', () => {
    const withScore = buildBracket('2026 Mid-Season Invitational', [
      { ...ROWS[0], Team1Score: '3', Team2Score: '1' },
    ]);
    expect(withScore.stages[0].matches[0].result).toEqual({ winner: 'T1', score: '3-1' });
  });

  it('leaves unfinished matches without a result', () => {
    const upcoming = bracket.stages[1].matches[0];
    expect(upcoming.result).toBeUndefined();
  });

  it('builds stable unique ids from tournament, stage and date', () => {
    const ids = bracket.stages.flatMap((s) => s.matches.map((m) => m.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe('2026-mid-season-invitational-play-in-day-1-2026-06-28-03-00-00');
  });

  it('carries the match date and stage through', () => {
    const match = bracket.stages[1].matches[1];
    expect(match.stage).toBe('Bracket Round 1');
    expect(match.date).toBe('2026-07-04 08:00:00');
  });
});

describe('formatTournamentName', () => {
  it('shortens Mid-Season Invitational pages to MSI', () => {
    expect(formatTournamentName('2026 Mid-Season Invitational')).toBe('MSI 2026');
  });

  it('shortens World Championship pages to Worlds', () => {
    expect(formatTournamentName('2025 Season World Championship')).toBe('Worlds 2025');
  });

  it('returns other tournament names unchanged', () => {
    expect(formatTournamentName('LCK 2026 Summer')).toBe('LCK 2026 Summer');
  });
});

describe('projectBracket', () => {
  const tbd = (tab: string, dt: string): LeaguepediaMatchRow => ({
    Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': dt, BestOf: '5', Tab: tab,
  });

  // Full MSI 2026 knockout: 8-team double elimination as scheduled on Leaguepedia
  const KNOCKOUT_ROWS: LeaguepediaMatchRow[] = [
    { Team1: 'Hanwha Life Esports', Team2: 'Team Secret Whales', Winner: '', 'DateTime UTC': '2026-07-03 03:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'G2 Esports', Team2: 'Top Esports', Winner: '', 'DateTime UTC': '2026-07-03 08:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'LYON', Team2: 'FURIA', Winner: '', 'DateTime UTC': '2026-07-04 03:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'Bilibili Gaming', Team2: 'T1', Winner: '', 'DateTime UTC': '2026-07-04 08:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    tbd('Bracket Round 1', '2026-07-05 03:00:00'),
    tbd('Bracket Round 1', '2026-07-06 03:00:00'),
    tbd('Bracket Round 2', '2026-07-05 08:00:00'),
    tbd('Bracket Round 2', '2026-07-06 08:00:00'),
    tbd('Bracket Round 2', '2026-07-08 03:00:00'),
    tbd('Bracket Round 2', '2026-07-08 08:00:00'),
    tbd('Bracket Round 4', '2026-07-09 08:00:00'),
    tbd('Bracket Round 3', '2026-07-10 08:00:00'),
    tbd('Bracket Round 4', '2026-07-11 08:00:00'),
    tbd('Finals', '2026-07-12 08:00:00'),
  ];

  const bracket = buildBracket('2026 Mid-Season Invitational', KNOCKOUT_ROWS);
  const stage = (name: string) => bracket.stages.find((s) => s.name === name)!;
  const qfIds = stage('Bracket Round 1').matches.slice(0, 4).map((m) => m.id);

  it('fills upper bracket semifinals with predicted quarterfinal winners', () => {
    const projected = projectBracket(bracket, {
      [qfIds[0]]: { predictedWinner: 'Hanwha Life Esports' },
      [qfIds[1]]: { predictedWinner: 'Top Esports' },
    });
    const sf1 = projected.stages.find((s) => s.name === 'Bracket Round 2')!.matches[0];
    expect(sf1.team1.shortName).toBe('HLE');
    expect(sf1.team2.shortName).toBe('TES');
    expect(sf1.team1Projected).toBe(true);
    expect(sf1.team2Projected).toBe(true);
  });

  it('drops predicted quarterfinal losers into the lower bracket, paired by play day', () => {
    const projected = projectBracket(bracket, {
      [qfIds[0]]: { predictedWinner: 'Hanwha Life Esports' },
      [qfIds[1]]: { predictedWinner: 'Top Esports' },
      [qfIds[2]]: { predictedWinner: 'FURIA' },
      [qfIds[3]]: { predictedWinner: 'T1' },
    });
    const [, , , , lb1, lb2] = projected.stages.find((s) => s.name === 'Bracket Round 1')!.matches;
    expect([lb1.team1.shortName, lb1.team2.shortName]).toEqual(['TSW', 'G2']);
    expect([lb2.team1.shortName, lb2.team2.shortName]).toEqual(['LYON', 'BLG']);
  });

  it('chains projections through later rounds down to the grand final', () => {
    const projected = projectBracket(bracket, {
      [qfIds[0]]: { predictedWinner: 'Hanwha Life Esports' },
      [qfIds[1]]: { predictedWinner: 'Top Esports' },
      [qfIds[2]]: { predictedWinner: 'FURIA' },
      [qfIds[3]]: { predictedWinner: 'T1' },
    });
    const r2 = projected.stages.find((s) => s.name === 'Bracket Round 2')!.matches;
    const sf1Prediction = { [r2[0].id]: { predictedWinner: 'Top Esports' } };
    const chained = projectBracket(bracket, {
      [qfIds[0]]: { predictedWinner: 'Hanwha Life Esports' },
      [qfIds[1]]: { predictedWinner: 'Top Esports' },
      [qfIds[2]]: { predictedWinner: 'FURIA' },
      [qfIds[3]]: { predictedWinner: 'T1' },
      ...sf1Prediction,
    });
    const ubFinal = chained.stages.find((s) => s.name === 'Bracket Round 4')!.matches[0];
    expect(ubFinal.team1.shortName).toBe('TES');
    // LB Round 2 slot 1 needs the LB R1 winner — no LB prediction was made, so it stays TBD
    const lbr2 = chained.stages.find((s) => s.name === 'Bracket Round 2')!.matches[2];
    expect(lbr2.team1.shortName).toBe('---');
  });

  it('prefers real results over predictions when propagating', () => {
    const withResult = buildBracket('2026 Mid-Season Invitational', [
      { ...KNOCKOUT_ROWS[0], Winner: '2', Team1Score: '1', Team2Score: '3' },
      ...KNOCKOUT_ROWS.slice(1),
    ]);
    const projected = projectBracket(withResult, {
      [qfIds[0]]: { predictedWinner: 'Hanwha Life Esports' },
      [qfIds[1]]: { predictedWinner: 'Top Esports' },
    });
    const sf1 = projected.stages.find((s) => s.name === 'Bracket Round 2')!.matches[0];
    expect(sf1.team1.shortName).toBe('TSW'); // real winner, not the predicted HLE
  });

  it('never overwrites teams Leaguepedia has already confirmed', () => {
    const confirmed = buildBracket('2026 Mid-Season Invitational', KNOCKOUT_ROWS.map((r, i) =>
      i === 6 ? { ...r, Team1: 'T1', Team2: 'G2 Esports' } : r
    ));
    const projected = projectBracket(confirmed, {
      [qfIds[0]]: { predictedWinner: 'Hanwha Life Esports' },
      [qfIds[1]]: { predictedWinner: 'Top Esports' },
    });
    const sf1 = projected.stages.find((s) => s.name === 'Bracket Round 2')!.matches[0];
    expect(sf1.team1.shortName).toBe('T1');
    expect(sf1.team1Projected).toBeUndefined();
  });

  it('returns the bracket unchanged when the stage shape is not the known double-elim layout', () => {
    const partial = buildBracket('2026 Mid-Season Invitational', KNOCKOUT_ROWS.slice(0, 4));
    const projected = projectBracket(partial, { [qfIds[0]]: { predictedWinner: 'Hanwha Life Esports' } });
    expect(projected).toEqual(partial);
  });
});

describe('getKnockoutLayout', () => {
  const playIn: LeaguepediaMatchRow = {
    Team1: 'T1', Team2: 'Team Liquid', Winner: '1', 'DateTime UTC': '2026-06-28 03:00:00', BestOf: '5', Tab: 'Play-In Day 1',
  };

  const KNOCKOUT_ROWS: LeaguepediaMatchRow[] = [
    playIn,
    { Team1: 'Hanwha Life Esports', Team2: 'Team Secret Whales', Winner: '', 'DateTime UTC': '2026-07-03 03:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'G2 Esports', Team2: 'Top Esports', Winner: '', 'DateTime UTC': '2026-07-03 08:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'LYON', Team2: 'FURIA', Winner: '', 'DateTime UTC': '2026-07-04 03:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'Bilibili Gaming', Team2: 'T1', Winner: '', 'DateTime UTC': '2026-07-04 08:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-05 03:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-06 03:00:00', BestOf: '5', Tab: 'Bracket Round 1' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-05 08:00:00', BestOf: '5', Tab: 'Bracket Round 2' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-06 08:00:00', BestOf: '5', Tab: 'Bracket Round 2' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-08 03:00:00', BestOf: '5', Tab: 'Bracket Round 2' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-08 08:00:00', BestOf: '5', Tab: 'Bracket Round 2' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-09 08:00:00', BestOf: '5', Tab: 'Bracket Round 4' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-10 08:00:00', BestOf: '5', Tab: 'Bracket Round 3' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-11 08:00:00', BestOf: '5', Tab: 'Bracket Round 4' },
    { Team1: 'TBD', Team2: 'TBD', Winner: '', 'DateTime UTC': '2026-07-12 08:00:00', BestOf: '5', Tab: 'Finals' },
  ];

  const bracket = buildBracket('2026 Mid-Season Invitational', KNOCKOUT_ROWS);
  const layout = getKnockoutLayout(bracket)!;

  it('splits the knockout into upper and lower bracket columns', () => {
    expect(layout.upper.map((c) => c.title)).toEqual(['Quarterfinals', 'Semifinals', 'Upper Final', 'Grand Final']);
    expect(layout.upper.map((c) => c.matches.length)).toEqual([4, 2, 1, 1]);
    expect(layout.lower.map((c) => c.title)).toEqual(['Lower Round 1', 'Lower Round 2', 'Lower Semifinal', 'Lower Final']);
    expect(layout.lower.map((c) => c.matches.length)).toEqual([2, 2, 1, 1]);
  });

  it('assigns the right matches to the right columns', () => {
    expect(layout.upper[0].matches[0].team1.shortName).toBe('HLE');
    expect(layout.upper[3].matches[0].date).toBe('2026-07-12 08:00:00'); // grand final
    expect(layout.lower[3].matches[0].date).toBe('2026-07-11 08:00:00'); // lower final = 2nd Round 4 match
    expect(layout.lower[2].matches[0].date).toBe('2026-07-10 08:00:00'); // lower semifinal = Round 3
  });

  it('keeps non-knockout stages (play-ins) separate', () => {
    expect(layout.otherStages.map((s) => s.name)).toEqual(['Play-In Day 1']);
  });

  it('returns null when the bracket does not match the double-elim shape', () => {
    const partial = buildBracket('2026 Mid-Season Invitational', KNOCKOUT_ROWS.slice(0, 5));
    expect(getKnockoutLayout(partial)).toBeNull();
  });
});

describe('getPlayInLayout', () => {
  // MSI 2026 play-in: 4-team double elimination across four day tabs
  const PLAY_IN_ROWS: LeaguepediaMatchRow[] = [
    { Team1: 'T1', Team2: 'Team Liquid', Winner: '1', 'DateTime UTC': '2026-06-28 03:00:00', BestOf: '5', Tab: 'Play-In Day 1' },
    { Team1: 'Karmine Corp', Team2: 'Deep Cross Gaming', Winner: '1', 'DateTime UTC': '2026-06-28 08:00:00', BestOf: '5', Tab: 'Play-In Day 1' },
    { Team1: 'Karmine Corp', Team2: 'T1', Winner: '2', 'DateTime UTC': '2026-06-29 03:00:00', BestOf: '5', Tab: 'Play-In Day 2' },
    { Team1: 'Deep Cross Gaming', Team2: 'Team Liquid', Winner: '2', 'DateTime UTC': '2026-06-29 08:00:00', BestOf: '5', Tab: 'Play-In Day 2' },
    { Team1: 'Karmine Corp', Team2: 'Team Liquid', Winner: '2', 'DateTime UTC': '2026-06-30 08:00:00', BestOf: '5', Tab: 'Play-In Day 3' },
    { Team1: 'T1', Team2: 'Team Liquid', Winner: '1', 'DateTime UTC': '2026-07-01 08:00:00', BestOf: '5', Tab: 'Play-In Day 4' },
  ];

  const bracket = buildBracket('2026 Mid-Season Invitational', PLAY_IN_ROWS);
  const layout = getPlayInLayout(bracket)!;

  it('splits the play-in into upper and lower bracket columns', () => {
    expect(layout.upper.map((c) => c.title)).toEqual(['Opening Round', 'Winners Final', 'Play-In Final']);
    expect(layout.upper.map((c) => c.matches.length)).toEqual([2, 1, 1]);
    expect(layout.lower.map((c) => c.title)).toEqual(['Elimination Match', 'Losers Final']);
    expect(layout.lower.map((c) => c.matches.length)).toEqual([1, 1]);
  });

  it('assigns the right matches to the right columns', () => {
    expect(layout.upper[1].matches[0].team1.shortName).toBe('KC'); // winners final = Day 2 first match
    expect(layout.lower[0].matches[0].team1.shortName).toBe('DCG'); // elimination = Day 2 second match
    expect(layout.lower[1].matches[0].date).toBe('2026-06-30 08:00:00'); // losers final = Day 3
    expect(layout.upper[2].matches[0].date).toBe('2026-07-01 08:00:00'); // play-in final = Day 4
  });

  it('reports which stages it consumed', () => {
    expect(layout.stageNames).toEqual(['Play-In Day 1', 'Play-In Day 2', 'Play-In Day 3', 'Play-In Day 4']);
  });

  it('returns null when the play-in shape is not present', () => {
    const partial = buildBracket('2026 Mid-Season Invitational', PLAY_IN_ROWS.slice(0, 3));
    expect(getPlayInLayout(partial)).toBeNull();
  });
});

describe('getCurrentStageName', () => {
  it('returns the stage of the first match without a result', () => {
    const bracket = buildBracket('2026 Mid-Season Invitational', ROWS);
    expect(getCurrentStageName(bracket)).toBe('Bracket Round 1');
  });

  it('returns the last stage when every match is finished', () => {
    const done = ROWS.map((r) => ({ ...r, Winner: '1' }));
    const bracket = buildBracket('2026 Mid-Season Invitational', done);
    expect(getCurrentStageName(bracket)).toBe('Finals');
  });

  it('returns null for an empty bracket', () => {
    const bracket = buildBracket('2026 Mid-Season Invitational', []);
    expect(getCurrentStageName(bracket)).toBeNull();
  });
});
