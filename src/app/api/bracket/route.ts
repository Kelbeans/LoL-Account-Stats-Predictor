import { NextRequest, NextResponse } from 'next/server';
import { getLatestTournament, getTournamentMatches } from '@/lib/leaguepedia';
import { buildBracket, LeaguepediaMatchRow } from '@/lib/bracket';
import { getCache, setCache } from '@/lib/cache';

async function resolveTournament(): Promise<string> {
  const cached = getCache<string>('bracket:tournament');
  if (cached) return cached;

  const tournament = await getLatestTournament();
  setCache('bracket:tournament', tournament, 1000 * 60 * 60 * 6);
  return tournament;
}

export async function GET(request: NextRequest) {
  try {
    const tournament = request.nextUrl.searchParams.get('tournament') || await resolveTournament();
    const cacheKey = `bracket:${tournament}`;

    const cached = getCache<ReturnType<typeof buildBracket>>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const rows = await getTournamentMatches(tournament);
    const bracket = buildBracket(tournament, rows as unknown as LeaguepediaMatchRow[]);
    setCache(cacheKey, bracket, 1000 * 60 * 30);

    return NextResponse.json(bracket);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch bracket';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
