import { Team } from '@/types/team';

export interface QualifiedTeam extends Team {
  seed: number;
  league: string;
  logoUrl: string;
}

export const MSI_2025_TEAMS: QualifiedTeam[] = [
  // LPL
  { name: 'Bilibili Gaming', shortName: 'BLG', region: 'LPL', seed: 1, league: 'LPL', logoUrl: '/logos/blg.webp' },
  { name: 'Top Esports', shortName: 'TES', region: 'LPL', seed: 2, league: 'LPL', logoUrl: '/logos/tes.webp' },
  // LEC
  { name: 'G2 Esports', shortName: 'G2', region: 'LEC', seed: 1, league: 'LEC', logoUrl: '/logos/g2.webp' },
  { name: 'Karmine Corp', shortName: 'KC', region: 'LEC', seed: 2, league: 'LEC', logoUrl: '/logos/kc.webp' },
  // LCK
  { name: 'Hanwha Life', shortName: 'HLE', region: 'LCK', seed: 1, league: 'LCK', logoUrl: '/logos/hle.webp' },
  { name: 'T1', shortName: 'T1', region: 'LCK', seed: 2, league: 'LCK', logoUrl: '/logos/t1.webp' },
  // LCS
  { name: 'LYON', shortName: 'LYON', region: 'LCS', seed: 1, league: 'LCS', logoUrl: '/logos/lyon.webp' },
  { name: 'Team Liquid', shortName: 'TLAW', region: 'LCS', seed: 2, league: 'LCS', logoUrl: '/logos/tlaw.webp' },
  // LCP (APAC)
  { name: 'Team Secret Whales', shortName: 'TSW', region: 'LCP', seed: 1, league: 'LCP', logoUrl: '/logos/tsw.webp' },
  { name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LCP', seed: 2, league: 'LCP', logoUrl: '/logos/dcg.webp' },
  // CBLOL
  { name: 'FURIA', shortName: 'FUR', region: 'CBLOL', seed: 1, league: 'CBLOL', logoUrl: '/logos/furia.webp' },
];

export function getTeamByShortName(shortName: string): QualifiedTeam | undefined {
  return MSI_2025_TEAMS.find((t) => t.shortName === shortName);
}

export function getTeamsByRegion(region: string): QualifiedTeam[] {
  return MSI_2025_TEAMS.filter((t) => t.region === region);
}
