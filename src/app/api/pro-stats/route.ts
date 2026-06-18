import { NextRequest, NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';

const LEAGUEPEDIA_API = 'https://lol.fandom.com/api.php';

export async function GET(request: NextRequest) {
  const team = request.nextUrl.searchParams.get('team');
  const tournament = request.nextUrl.searchParams.get('tournament') || 'LCK 2025 Spring';

  if (!team) {
    return NextResponse.json({ error: 'team parameter required' }, { status: 400 });
  }

  const cacheKey = `pro-stats:${team}:${tournament}`;
  const cached = getCache<unknown>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const params = new URLSearchParams({
      action: 'cargoquery',
      format: 'json',
      tables: 'ScoreboardPlayers',
      fields: 'Name,Champion,Kills,Deaths,Assists,CS,Role,DateTime_UTC',
      where: `Team="${team}" AND OverviewPage="${tournament}"`,
      order_by: 'DateTime_UTC DESC',
      limit: '50',
    });

    const res = await fetch(`${LEAGUEPEDIA_API}?${params}`, {
      headers: { 'User-Agent': 'LoLPickemPredictor/1.0' },
    });

    if (!res.ok) throw new Error(`Leaguepedia API error: ${res.status}`);

    const data = await res.json();
    const players = data.cargoquery?.map((item: { title: Record<string, string> }) => item.title) || [];

    // Aggregate stats per player
    const playerStats: Record<string, { games: number; kills: number; deaths: number; assists: number; cs: number; role: string; champions: string[] }> = {};

    for (const game of players) {
      const name = game.Name;
      if (!playerStats[name]) {
        playerStats[name] = { games: 0, kills: 0, deaths: 0, assists: 0, cs: 0, role: game.Role, champions: [] };
      }
      playerStats[name].games++;
      playerStats[name].kills += parseInt(game.Kills) || 0;
      playerStats[name].deaths += parseInt(game.Deaths) || 0;
      playerStats[name].assists += parseInt(game.Assists) || 0;
      playerStats[name].cs += parseInt(game.CS) || 0;
      if (!playerStats[name].champions.includes(game.Champion)) {
        playerStats[name].champions.push(game.Champion);
      }
    }

    const result = Object.entries(playerStats).map(([name, stats]) => ({
      name,
      role: stats.role,
      games: stats.games,
      avgKills: (stats.kills / stats.games).toFixed(1),
      avgDeaths: (stats.deaths / stats.games).toFixed(1),
      avgAssists: (stats.assists / stats.games).toFixed(1),
      kda: ((stats.kills + stats.assists) / Math.max(stats.deaths, 1)).toFixed(2),
      avgCS: (stats.cs / stats.games).toFixed(0),
      uniqueChampions: stats.champions,
    }));

    setCache(cacheKey, result, 1000 * 60 * 60); // 1 hour cache
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch pro stats';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
