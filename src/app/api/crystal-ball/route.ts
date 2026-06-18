import { NextRequest, NextResponse } from 'next/server';
import { predictCrystalBall } from '@/lib/predictor';
import { getCache, setCache } from '@/lib/cache';
import { CrystalBallQuestion, CrystalBallPrediction } from '@/types/crystal-ball';

export async function POST(request: NextRequest) {
  try {
    const { question, tournamentContext } = await request.json() as {
      question: CrystalBallQuestion;
      tournamentContext: string;
    };

    const cacheKey = `crystal-ball:${question.id}`;
    const cached = getCache<CrystalBallPrediction>(cacheKey);
    if (cached) return NextResponse.json(cached);

    const prediction = await predictCrystalBall(question, tournamentContext);
    setCache(cacheKey, prediction);

    return NextResponse.json(prediction);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Crystal ball prediction failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
