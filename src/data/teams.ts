import { Team } from '@/types/team';

export interface Player {
  ign: string;
  role: 'Top' | 'Jungle' | 'Mid' | 'Bot' | 'Support';
  nationality?: string;
}

export interface QualifiedTeam extends Team {
  seed: number;
  league: string;
  logoUrl: string;
  players?: Player[];
  coach?: string;
  titles?: string;
}

export const MSI_2025_TEAMS: QualifiedTeam[] = [
  {
    name: 'Bilibili Gaming', shortName: 'BLG', region: 'LPL', seed: 1, league: 'LPL', logoUrl: '/logos/blg.webp',
    players: [{ ign: 'Bin', role: 'Top' }, { ign: 'Xun', role: 'Jungle' }, { ign: 'knight', role: 'Mid' }, { ign: 'Elk', role: 'Bot' }, { ign: 'ON', role: 'Support' }],
    coach: 'Homme', titles: 'LPL Spring 2025 Champion',
  },
  {
    name: 'Top Esports', shortName: 'TES', region: 'LPL', seed: 2, league: 'LPL', logoUrl: '/logos/tes.webp',
    players: [{ ign: '369', role: 'Top' }, { ign: 'Tian', role: 'Jungle' }, { ign: 'Creme', role: 'Mid' }, { ign: 'JackeyLove', role: 'Bot' }, { ign: 'Meiko', role: 'Support' }],
    coach: 'White', titles: 'LPL Spring 2025 Runner-up',
  },
  {
    name: 'G2 Esports', shortName: 'G2', region: 'LEC', seed: 1, league: 'LEC', logoUrl: '/logos/g2.webp',
    players: [{ ign: 'BrokenBlade', role: 'Top' }, { ign: 'Yike', role: 'Jungle' }, { ign: 'Caps', role: 'Mid' }, { ign: 'Hans Sama', role: 'Bot' }, { ign: 'Mikyx', role: 'Support' }],
    coach: 'Dylan Falco', titles: 'LEC Spring 2025 Champion',
  },
  {
    name: 'Karmine Corp', shortName: 'KC', region: 'LEC', seed: 2, league: 'LEC', logoUrl: '/logos/kc.webp',
    players: [{ ign: 'Cabochard', role: 'Top' }, { ign: 'Yike', role: 'Jungle' }, { ign: 'Nemesis', role: 'Mid' }, { ign: 'Upset', role: 'Bot' }, { ign: 'Targamas', role: 'Support' }],
    coach: 'Striker', titles: 'LEC Spring 2025 Runner-up',
  },
  {
    name: 'Hanwha Life', shortName: 'HLE', region: 'LCK', seed: 1, league: 'LCK', logoUrl: '/logos/hle.webp',
    players: [{ ign: 'Zeus', role: 'Top' }, { ign: 'Peanut', role: 'Jungle' }, { ign: 'Zeka', role: 'Mid' }, { ign: 'Viper', role: 'Bot' }, { ign: 'Delight', role: 'Support' }],
    coach: 'DanDy', titles: 'LCK Spring 2025 Champion',
  },
  {
    name: 'T1', shortName: 'T1', region: 'LCK', seed: 2, league: 'LCK', logoUrl: '/logos/t1.webp',
    players: [{ ign: 'Doran', role: 'Top' }, { ign: 'Oner', role: 'Jungle' }, { ign: 'Faker', role: 'Mid' }, { ign: 'Gumayusi', role: 'Bot' }, { ign: 'Keria', role: 'Support' }],
    coach: 'kkOma', titles: 'Worlds 2024 Champion, LCK Spring 2025 Runner-up',
  },
  {
    name: 'LYON', shortName: 'LYON', region: 'LCS', seed: 1, league: 'LCS', logoUrl: '/logos/lyon.webp',
    players: [{ ign: 'Josedeodo', role: 'Jungle' }, { ign: 'Liyab', role: 'Mid' }, { ign: 'Whitelotus', role: 'Bot' }, { ign: 'Ackerman', role: 'Top' }, { ign: 'Kain', role: 'Support' }],
    coach: 'Ksjp', titles: 'LCS Spring 2025 Champion',
  },
  {
    name: 'Team Liquid', shortName: 'TLAW', region: 'LCS', seed: 2, league: 'LCS', logoUrl: '/logos/tlaw.webp',
    players: [{ ign: 'Impact', role: 'Top' }, { ign: 'UmTi', role: 'Jungle' }, { ign: 'APA', role: 'Mid' }, { ign: 'Yeon', role: 'Bot' }, { ign: 'CoreJJ', role: 'Support' }],
    coach: 'Spawn', titles: 'LCS Spring 2025 Runner-up',
  },
  {
    name: 'Team Secret Whales', shortName: 'TSW', region: 'LCP', seed: 1, league: 'LCP', logoUrl: '/logos/tsw.webp',
    players: [{ ign: 'Kati', role: 'Top' }, { ign: 'Babip', role: 'Jungle' }, { ign: 'Topoon', role: 'Mid' }, { ign: 'Flare', role: 'Bot' }, { ign: 'Hanabi', role: 'Support' }],
    coach: 'Unknown', titles: 'LCP Spring 2025 Champion',
  },
  {
    name: 'Deep Cross Gaming', shortName: 'DCG', region: 'LCP', seed: 2, league: 'LCP', logoUrl: '/logos/dcg.webp',
    players: [{ ign: 'Evi', role: 'Top' }, { ign: 'Steal', role: 'Jungle' }, { ign: 'Aria', role: 'Mid' }, { ign: 'Yutapon', role: 'Bot' }, { ign: 'Harp', role: 'Support' }],
    coach: 'Kazu', titles: 'LCP Spring 2025 Runner-up',
  },
  {
    name: 'FURIA', shortName: 'FUR', region: 'CBLOL', seed: 1, league: 'CBLOL', logoUrl: '/logos/furia.webp',
    players: [{ ign: 'Robo', role: 'Top' }, { ign: 'Cariok', role: 'Jungle' }, { ign: 'Tutsz', role: 'Mid' }, { ign: 'Brance', role: 'Bot' }, { ign: 'Jojo', role: 'Support' }],
    coach: 'Maestro', titles: 'CBLOL Spring 2025 Champion',
  },
];

export function getTeamByShortName(shortName: string): QualifiedTeam | undefined {
  return MSI_2025_TEAMS.find((t) => t.shortName === shortName);
}

export function getTeamsByRegion(region: string): QualifiedTeam[] {
  return MSI_2025_TEAMS.filter((t) => t.region === region);
}
