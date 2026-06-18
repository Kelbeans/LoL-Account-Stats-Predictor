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
    players: [{ ign: 'Bin', role: 'Top' }, { ign: 'Beichuan', role: 'Jungle' }, { ign: 'knight', role: 'Mid' }, { ign: 'Elk', role: 'Bot' }, { ign: 'ON', role: 'Support' }],
    coach: 'BigWei & Easyhoon', titles: 'LPL Spring 2025 Champion',
  },
  {
    name: 'Top Esports', shortName: 'TES', region: 'LPL', seed: 2, league: 'LPL', logoUrl: '/logos/tes.webp',
    players: [{ ign: 'Flandre', role: 'Top' }, { ign: 'Tarzan', role: 'Jungle' }, { ign: 'Shanks', role: 'Mid' }, { ign: 'Hope', role: 'Bot' }, { ign: 'Kael', role: 'Support' }],
    coach: 'Tabe & Xiaobai', titles: 'LPL Spring 2025 Runner-up',
  },
  {
    name: 'G2 Esports', shortName: 'G2', region: 'LEC', seed: 1, league: 'LEC', logoUrl: '/logos/g2.webp',
    players: [{ ign: 'BrokenBlade', role: 'Top' }, { ign: 'SkewMond', role: 'Jungle' }, { ign: 'Caps', role: 'Mid' }, { ign: 'Hans Sama', role: 'Bot' }, { ign: 'Labrov', role: 'Support' }],
    coach: 'Dylan Falco', titles: 'LEC Spring 2025 Champion',
  },
  {
    name: 'Karmine Corp', shortName: 'KC', region: 'LEC', seed: 2, league: 'LEC', logoUrl: '/logos/kc.webp',
    players: [{ ign: 'Myrwn', role: 'Top' }, { ign: 'Elyoya', role: 'Jungle' }, { ign: 'Jojopyun', role: 'Mid' }, { ign: 'Supa', role: 'Bot' }, { ign: 'Alvaro', role: 'Support' }],
    coach: 'Melzhet & Zeph', titles: 'LEC Spring 2025 Runner-up',
  },
  {
    name: 'Gen.G', shortName: 'GEN', region: 'LCK', seed: 1, league: 'LCK', logoUrl: '/logos/hle.webp',
    players: [{ ign: 'Kiin', role: 'Top' }, { ign: 'Canyon', role: 'Jungle' }, { ign: 'Chovy', role: 'Mid' }, { ign: 'Ruler', role: 'Bot' }, { ign: 'Duro', role: 'Support' }],
    coach: 'KIM', titles: 'LCK Spring 2025 Champion',
  },
  {
    name: 'T1', shortName: 'T1', region: 'LCK', seed: 2, league: 'LCK', logoUrl: '/logos/t1.webp',
    players: [{ ign: 'Doran', role: 'Top' }, { ign: 'Oner', role: 'Jungle' }, { ign: 'Faker', role: 'Mid' }, { ign: 'Gumayusi', role: 'Bot' }, { ign: 'Keria', role: 'Support' }],
    coach: 'kkOma', titles: 'Worlds 2024 Champion',
  },
  {
    name: 'FlyQuest', shortName: 'FLY', region: 'LCS', seed: 1, league: 'LCS', logoUrl: '/logos/lyon.webp',
    players: [{ ign: 'Bwipo', role: 'Top' }, { ign: 'Inspired', role: 'Jungle' }, { ign: 'Quad', role: 'Mid' }, { ign: 'Massu', role: 'Bot' }, { ign: 'Busio', role: 'Support' }],
    coach: 'Mithy', titles: 'LCS Spring 2025 Champion',
  },
  {
    name: 'Team Liquid', shortName: 'TLAW', region: 'LCS', seed: 2, league: 'LCS', logoUrl: '/logos/tlaw.webp',
    players: [{ ign: 'Bwipo', role: 'Top' }, { ign: 'Inspired', role: 'Jungle' }, { ign: 'Quad', role: 'Mid' }, { ign: 'Massu', role: 'Bot' }, { ign: 'Busio', role: 'Support' }],
    coach: 'Spawn', titles: 'LCS Spring 2025 Runner-up',
  },
  {
    name: 'GAM Esports', shortName: 'GAM', region: 'VCS', seed: 1, league: 'LCP', logoUrl: '/logos/tsw.webp',
    players: [{ ign: 'Kiaya', role: 'Top' }, { ign: 'Levi', role: 'Jungle' }, { ign: 'Emo', role: 'Mid' }, { ign: 'Aress', role: 'Bot' }, { ign: 'Elio', role: 'Support' }],
    coach: 'Archie', titles: 'VCS Spring 2025 Champion',
  },
  {
    name: 'CTBC Flying Oyster', shortName: 'CFO', region: 'PCS', seed: 1, league: 'LCP', logoUrl: '/logos/dcg.webp',
    players: [{ ign: 'Driver', role: 'Top' }, { ign: 'JunJia', role: 'Jungle' }, { ign: 'HongQ', role: 'Mid' }, { ign: 'Doggo', role: 'Bot' }, { ign: 'Kaiwing', role: 'Support' }],
    coach: 'Chawy', titles: 'PCS Spring 2025 Champion',
  },
  {
    name: 'FURIA', shortName: 'FUR', region: 'CBLOL', seed: 1, league: 'CBLOL', logoUrl: '/logos/furia.webp',
    players: [{ ign: 'Guigo', role: 'Top' }, { ign: 'Tatu', role: 'Jungle' }, { ign: 'Tutsz', role: 'Mid' }, { ign: 'Ayu', role: 'Bot' }, { ign: 'JoJo', role: 'Support' }],
    coach: 'Thinkcard', titles: 'CBLOL Spring 2025 Champion',
  },
];

export function getTeamByShortName(shortName: string): QualifiedTeam | undefined {
  return MSI_2025_TEAMS.find((t) => t.shortName === shortName);
}

export function getTeamsByRegion(region: string): QualifiedTeam[] {
  return MSI_2025_TEAMS.filter((t) => t.region === region);
}
