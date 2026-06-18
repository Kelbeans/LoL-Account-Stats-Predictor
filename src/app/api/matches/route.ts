import { NextRequest, NextResponse } from 'next/server';
import { getTournamentMatches } from '@/lib/leaguepedia';
import { getCache, setCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const tournament = request.nextUrl.searchParams.get('tournament') || 'Mid-Season Invitational 2025';
    const cacheKey = `matches:${tournament}`;

    const cached = getCache<Record<string, string>[]>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const matches = await getTournamentMatches(tournament);
    setCache(cacheKey, matches, 1000 * 60 * 30);

    return NextResponse.json(matches);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch matches';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
