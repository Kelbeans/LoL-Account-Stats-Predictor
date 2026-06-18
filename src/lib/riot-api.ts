const RIOT_API_KEY = process.env.RIOT_API_KEY!;

const REGION_ROUTING: Record<string, string> = {
  na1: 'americas',
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',
  euw1: 'europe',
  eun1: 'europe',
  tr1: 'europe',
  ru: 'europe',
  kr: 'asia',
  jp1: 'asia',
  ph2: 'sea',
  sg2: 'sea',
  th2: 'sea',
  tw2: 'sea',
  vn2: 'sea',
  oc1: 'sea',
};

async function riotFetch(url: string) {
  const res = await fetch(url, {
    headers: { 'X-Riot-Token': RIOT_API_KEY },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Riot API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getAccountByRiotId(gameName: string, tagLine: string, region = 'asia') {
  return riotFetch(
    `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
  );
}

export async function getSummonerByPuuid(puuid: string, platform = 'ph2') {
  return riotFetch(
    `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
  );
}

export async function getRankedStats(summonerId: string, platform = 'ph2') {
  return riotFetch(
    `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`
  );
}

export async function getMatchHistory(puuid: string, region = 'asia', count = 10) {
  return riotFetch(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`
  );
}

export async function getMatchDetails(matchId: string, region = 'asia') {
  return riotFetch(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`
  );
}

export async function getChampionMastery(puuid: string, platform = 'ph2', count = 5) {
  return riotFetch(
    `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`
  );
}

export function getRoutingRegion(platform: string): string {
  return REGION_ROUTING[platform] || 'asia';
}
