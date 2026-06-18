import { Team } from '@/types/team';

export interface QualifiedTeam extends Team {
  seed: number;
  league: string;
  logoUrl: string;
}

export const MSI_2025_TEAMS: QualifiedTeam[] = [
  { name: 'T1', shortName: 'T1', region: 'LCK', seed: 1, league: 'LCK', logoUrl: '/logos/t1.webp' },
  { name: 'Karmine Corp', shortName: 'KC', region: 'LEC', seed: 1, league: 'LEC', logoUrl: '/logos/kc.webp' },
  { name: 'Team Liquid', shortName: 'TLAW', region: 'LCS', seed: 1, league: 'LCS', logoUrl: '/logos/tlaw.webp' },
  { name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LJL', seed: 1, league: 'LJL', logoUrl: '/logos/dcg.webp' },
  { name: 'Top Esports', shortName: 'TES', region: 'LPL', seed: 1, league: 'LPL', logoUrl: '/logos/tes.webp' },
  { name: 'PSG Talon', shortName: 'PSG', region: 'PCS', seed: 1, league: 'PCS', logoUrl: '/logos/psg.webp' },
  { name: 'GAM Esports', shortName: 'GAM', region: 'VCS', seed: 1, league: 'VCS', logoUrl: '/logos/gam.webp' },
  { name: 'LOUD', shortName: 'LOUD', region: 'CBLOL', seed: 1, league: 'CBLOL', logoUrl: '/logos/loud.webp' },
  { name: 'Movistar R7', shortName: 'R7', region: 'LLA', seed: 1, league: 'LLA', logoUrl: '/logos/r7.webp' },
  { name: 'Fukuoka SoftBank Hawks', shortName: 'FSH', region: 'LJL', seed: 2, league: 'LJL', logoUrl: '/logos/fsh.webp' },
];

export function getTeamByShortName(shortName: string): QualifiedTeam | undefined {
  return MSI_2025_TEAMS.find((t) => t.shortName === shortName);
}

export function getTeamsByRegion(region: string): QualifiedTeam[] {
  return MSI_2025_TEAMS.filter((t) => t.region === region);
}
