import { NextRequest, NextResponse } from 'next/server';
import { predictMatch } from '@/lib/predictor';
import { getTeamRecentMatches, getHeadToHead } from '@/lib/leaguepedia';
import { getCache, setCache } from '@/lib/cache';
import { Match } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';

export async function POST(request: NextRequest) {
  try {
    const match: Match = await request.json();
    const cacheKey = `predict:${match.id}`;

    const cached = getCache<MatchPrediction>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const [team1Recent, team2Recent, h2h] = await Promise.all([
      getTeamRecentMatches(match.team1.name),
      getTeamRecentMatches(match.team2.name),
      getHeadToHead(match.team1.name, match.team2.name),
    ]);

    const context = `Team 1 (${match.team1.name}) recent results: ${JSON.stringify(team1Recent)}
Team 2 (${match.team2.name}) recent results: ${JSON.stringify(team2Recent)}
Head-to-head history: ${JSON.stringify(h2h)}`;

    const prediction = await predictMatch(match, context);
    setCache(cacheKey, prediction);

    return NextResponse.json(prediction);
  } catch (error: unknown) {
    let message = 'Prediction failed';
    if (error instanceof Error) {
      message = error.message;
    }
    if (typeof error === 'object' && error !== null && 'status' in error) {
      const apiError = error as { status: number; error?: { message?: string } };
      message = apiError.error?.message || `API error (${apiError.status})`;
    }
    console.error('[/api/predict]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
