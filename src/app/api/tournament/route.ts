import { NextResponse } from 'next/server';
import { getLatestMSI, getTournamentRosters, getTeamLogoUrl } from '@/lib/leaguepedia';
import { getCache, setCache } from '@/lib/cache';

export interface TournamentTeam {
  name: string;
  region: string;
  seed: number;
  logoUrl: string | null;
  players: { ign: string; role: string }[];
  coaches: string[];
}

const KNOWN_TEAM_REGIONS: Record<string, string> = {
  'T1': 'LCK',
  'Gen.G': 'LCK',
  'Hanwha Life Esports': 'LCK',
  'DRX': 'LCK',
  'Dplus KIA': 'LCK',
  'Bilibili Gaming': 'LPL',
  'Top Esports': 'LPL',
  'JD Gaming': 'LPL',
  'Weibo Gaming': 'LPL',
  'G2 Esports': 'LEC',
  'Karmine Corp': 'LEC',
  'Fnatic': 'LEC',
  'Movistar KOI': 'LEC',
  'Team Liquid': 'LCS',
  'FlyQuest': 'LCS',
  'LYON': 'LCS',
  'Cloud9': 'LCS',
  'GAM Esports': 'VCS',
  'Team Secret Whales': 'LCP',
  'Deep Cross Gaming': 'LCP',
  'CTBC Flying Oyster': 'PCS',
  'PSG Talon': 'PCS',
  'FURIA': 'CBLOL',
  'LOUD': 'CBLOL',
  'Movistar R7': 'LLA',
  "Anyone's Legend": 'LPL',
};

function parseRoster(rosterLinks: string, roles: string): { players: { ign: string; role: string }[]; coaches: string[] } {
  const names = rosterLinks.split(';;');
  const roleList = roles.split(';;');
  const players: { ign: string; role: string }[] = [];
  const coaches: string[] = [];

  for (let i = 0; i < names.length; i++) {
    const rawName = names[i];
    const role = roleList[i] || '';
    const ign = rawName.includes('(') ? rawName.split('(')[0].trim() : rawName.trim();

    if (role.toLowerCase() === 'coach') {
      coaches.push(ign);
    } else if (['Top', 'Jungle', 'Mid', 'Bot', 'Support'].includes(role)) {
      players.push({ ign, role });
    }
  }

  return { players, coaches };
}

export async function GET() {
  const cacheKey = 'tournament:latest';
  const cached = getCache<{ tournament: string; teams: TournamentTeam[] }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const tournament = await getLatestMSI();
    const rosters = await getTournamentRosters(tournament);

    const regionCount: Record<string, number> = {};

    const teams: TournamentTeam[] = await Promise.all(
      rosters.map(async (r) => {
        const { players, coaches } = parseRoster(r.RosterLinks || '', r.Roles || '');
        const region = r.Region || KNOWN_TEAM_REGIONS[r.Team] || 'Unknown';
        regionCount[region] = (regionCount[region] || 0) + 1;
        const seed = regionCount[region];

        let logoUrl: string | null = null;
        try {
          logoUrl = await getTeamLogoUrl(r.Team);
        } catch {
          logoUrl = null;
        }
        return {
          name: r.Team,
          region,
          seed,
          logoUrl,
          players,
          coaches,
        };
      })
    );

    const result = { tournament, teams };
    setCache(cacheKey, result, 1000 * 60 * 60);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tournament data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
