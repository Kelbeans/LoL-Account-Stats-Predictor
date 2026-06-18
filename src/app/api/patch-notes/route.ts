import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';

const LOL_NEWS_URL = 'https://www.leagueoflegends.com/en-us/news/game-updates/';

export async function GET() {
  const cacheKey = 'patch-notes:latest';
  const cached = getCache<{ patch: string; url: string }>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const res = await fetch(LOL_NEWS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    });

    if (!res.ok) throw new Error(`Failed to fetch LoL news: ${res.status}`);

    const html = await res.text();
    const patchMatch = html.match(/patch[- ](\d+[.-]\d+)/i);
    const urlMatch = html.match(/\/en-us\/news\/game-updates\/league-of-legends-patch-[\d-]+-notes/);

    const patch = patchMatch ? patchMatch[1].replace('-', '.') : 'unknown';
    const url = urlMatch ? `https://www.leagueoflegends.com${urlMatch[0]}` : '';

    const result = { patch, url };
    setCache(cacheKey, result, 1000 * 60 * 60 * 6); // 6 hour cache
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch patch info';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
