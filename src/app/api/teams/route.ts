import { NextRequest, NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';

const LEAGUEPEDIA_API = 'https://lol.fandom.com/api.php';

interface TeamLogoResult {
  name: string;
  logoUrl: string;
}

export async function GET(request: NextRequest) {
  const teamName = request.nextUrl.searchParams.get('team');

  if (!teamName) {
    return NextResponse.json({ error: 'team parameter required' }, { status: 400 });
  }

  const cacheKey = `team-logo:${teamName}`;
  const cached = getCache<TeamLogoResult>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const fileName = `File:${teamName.replace(/ /g, '_')}logo_square.png`;
    const params = new URLSearchParams({
      action: 'query',
      titles: fileName,
      prop: 'imageinfo',
      iiprop: 'url',
      format: 'json',
    });

    const res = await fetch(`${LEAGUEPEDIA_API}?${params}`, {
      headers: { 'User-Agent': 'LoLPickemPredictor/1.0' },
    });

    if (!res.ok) {
      throw new Error(`Leaguepedia API error: ${res.status}`);
    }

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) throw new Error('No pages in response');

    const page = Object.values(pages)[0] as { imageinfo?: { url: string }[] };
    const logoUrl = page.imageinfo?.[0]?.url;

    if (!logoUrl) {
      return NextResponse.json({ error: `Logo not found for ${teamName}` }, { status: 404 });
    }

    const result: TeamLogoResult = { name: teamName, logoUrl };
    setCache(cacheKey, result, 1000 * 60 * 60 * 24);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch team logo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
