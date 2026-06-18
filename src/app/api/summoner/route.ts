import { NextRequest, NextResponse } from 'next/server';
import { getAccountByRiotId, getSummonerByPuuid, getRankedStats, getChampionMastery, getMatchHistory, getMatchDetails, getRoutingRegion } from '@/lib/riot-api';
import { getCache, setCache } from '@/lib/cache';

function sanitize(input: string): string {
  return input.replace(/[⁦⁧⁨⁩​‌‍﻿]/g, '').trim();
}

export async function GET(request: NextRequest) {
  const rawName = request.nextUrl.searchParams.get('name');
  const rawTag = request.nextUrl.searchParams.get('tag');
  const platform = request.nextUrl.searchParams.get('platform') || 'ph2';

  if (!rawName || !rawTag) {
    return NextResponse.json({ error: 'name and tag parameters required' }, { status: 400 });
  }

  const gameName = sanitize(rawName);
  const tagLine = sanitize(rawTag);

  const cacheKey = `summoner:${gameName}#${tagLine}:${platform}`;
  const cached = getCache<unknown>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const routingRegion = getRoutingRegion(platform);
    const account = await getAccountByRiotId(gameName, tagLine, routingRegion);
    const summoner = await getSummonerByPuuid(account.puuid, platform);
    const ranked = await getRankedStats(summoner.id, platform);
    const mastery = await getChampionMastery(account.puuid, platform);
    const matchIds = await getMatchHistory(account.puuid, routingRegion, 5);

    const matches = await Promise.all(
      (matchIds as string[]).slice(0, 5).map((id: string) => getMatchDetails(id, routingRegion))
    );

    const participantMatches = matches.map((match: any) => {
      const participant = match.info.participants.find((p: any) => p.puuid === account.puuid);
      return {
        champion: participant?.championName,
        kills: participant?.kills,
        deaths: participant?.deaths,
        assists: participant?.assists,
        win: participant?.win,
        cs: participant?.totalMinionsKilled + participant?.neutralMinionsKilled,
        gameDuration: match.info.gameDuration,
        gameMode: match.info.gameMode,
      };
    });

    const result = {
      account: {
        gameName: account.gameName,
        tagLine: account.tagLine,
        puuid: account.puuid,
      },
      summoner: {
        level: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
      },
      ranked,
      mastery,
      recentMatches: participantMatches,
    };

    setCache(cacheKey, result, 1000 * 60 * 5);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch summoner data';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
