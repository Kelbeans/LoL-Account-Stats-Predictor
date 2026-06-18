const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com';

let latestVersion: string | null = null;

export async function getLatestVersion(): Promise<string> {
  if (latestVersion) return latestVersion;
  const res = await fetch(`${DDRAGON_BASE}/api/versions.json`);
  if (!res.ok) throw new Error(`Failed to fetch DDragon versions: ${res.status}`);
  const versions: string[] = await res.json();
  latestVersion = versions[0];
  return latestVersion;
}

export async function getChampionImageUrl(championName: string): Promise<string> {
  const version = await getLatestVersion();
  return `${DDRAGON_BASE}/cdn/${version}/img/champion/${championName}.png`;
}

export async function getChampionSplashUrl(championName: string, skin = 0): Promise<string> {
  return `${DDRAGON_BASE}/cdn/img/champion/splash/${championName}_${skin}.jpg`;
}

export async function getItemImageUrl(itemId: number): Promise<string> {
  const version = await getLatestVersion();
  return `${DDRAGON_BASE}/cdn/${version}/img/item/${itemId}.png`;
}

export async function getAllChampions(): Promise<Record<string, { id: string; name: string; key: string }>> {
  const version = await getLatestVersion();
  const res = await fetch(`${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`);
  if (!res.ok) throw new Error(`Failed to fetch champions: ${res.status}`);
  const data = await res.json();
  return data.data;
}
