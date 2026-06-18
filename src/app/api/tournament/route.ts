import { NextResponse } from 'next/server';
import { getLatestMSI, getTournamentRosters } from '@/lib/leaguepedia';
import { getCache, setCache } from '@/lib/cache';

export interface TournamentTeam {
  name: string;
  players: { ign: string; role: string }[];
  coaches: string[];
}

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

    const teams: TournamentTeam[] = rosters.map((r) => {
      const { players, coaches } = parseRoster(r.RosterLinks || '', r.Roles || '');
      return {
        name: r.Team,
        players,
        coaches,
      };
    });

    const result = { tournament, teams };
    setCache(cacheKey, result, 1000 * 60 * 60); // 1 hour cache

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tournament data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
