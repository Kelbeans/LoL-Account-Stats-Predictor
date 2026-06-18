'use client';

import { useState } from 'react';

interface SummonerData {
  account: {
    gameName: string;
    tagLine: string;
    puuid: string;
  };
  summoner: {
    level: number;
    profileIconId: number;
  };
  ranked: {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }[];
  mastery: {
    championId: number;
    championLevel: number;
    championPoints: number;
    championName?: string;
  }[];
  recentMatches: {
    champion: string;
    kills: number;
    deaths: number;
    assists: number;
    win: boolean;
    cs: number;
    gameDuration: number;
    gameMode: string;
  }[];
}

const PLATFORMS = [
  { value: 'na1', label: 'NA' },
  { value: 'euw1', label: 'EUW' },
  { value: 'eun1', label: 'EUNE' },
  { value: 'kr', label: 'KR' },
  { value: 'jp1', label: 'JP' },
  { value: 'br1', label: 'BR' },
  { value: 'la1', label: 'LAN' },
  { value: 'la2', label: 'LAS' },
  { value: 'oc1', label: 'OCE' },
  { value: 'tr1', label: 'TR' },
  { value: 'ru', label: 'RU' },
  { value: 'ph2', label: 'PH' },
  { value: 'sg2', label: 'SG' },
  { value: 'th2', label: 'TH' },
  { value: 'tw2', label: 'TW' },
  { value: 'vn2', label: 'VN' },
];

const TIER_COLORS: Record<string, string> = {
  IRON: '#6b7280',
  BRONZE: '#cd7f32',
  SILVER: '#c0c0c0',
  GOLD: '#f5a623',
  PLATINUM: '#2dd4bf',
  EMERALD: '#10b981',
  DIAMOND: '#60a5fa',
  MASTER: '#a855f7',
  GRANDMASTER: '#ef4444',
  CHALLENGER: '#f5a623',
};

const CHAMPION_ID_MAP: Record<number, string> = {
  1: 'Annie', 2: 'Olaf', 3: 'Galio', 4: 'TwistedFate', 5: 'XinZhao',
  6: 'Urgot', 7: 'LeBlanc', 8: 'Vladimir', 9: 'Fiddlesticks', 10: 'Kayle',
  11: 'MasterYi', 12: 'Alistar', 13: 'Ryze', 14: 'Sion', 15: 'Sivir',
  16: 'Soraka', 17: 'Teemo', 18: 'Tristana', 19: 'Warwick', 20: 'Nunu',
  21: 'MissFortune', 22: 'Ashe', 23: 'Tryndamere', 24: 'Jax', 25: 'Morgana',
  26: 'Zilean', 27: 'Singed', 28: 'Evelynn', 29: 'Twitch', 30: 'Karthus',
  31: 'Amumu', 32: 'Amumu', 33: 'Rammus', 34: 'Anivia', 35: 'Shaco',
  36: 'DrMundo', 37: 'Sona', 38: 'Kassadin', 39: 'Irelia', 40: 'Janna',
  41: 'Gangplank', 42: 'Corki', 43: 'Karma', 44: 'Taric', 45: 'Veigar',
  48: 'Trundle', 50: 'Swain', 51: 'Caitlyn', 53: 'Blitzcrank', 54: 'Malphite',
  55: 'Katarina', 56: 'Nocturne', 57: 'Maokai', 58: 'Renekton', 59: 'JarvanIV',
  60: 'Elise', 61: 'Orianna', 62: 'MonkeyKing', 63: 'Brand', 64: 'LeeSin',
  67: 'Vayne', 68: 'Rumble', 69: 'Cassiopeia', 72: 'Skarner', 74: 'Heimerdinger',
  75: 'Nasus', 76: 'Nidalee', 77: 'Udyr', 78: 'Poppy', 79: 'Gragas',
  80: 'Pantheon', 81: 'Ezreal', 82: 'Mordekaiser', 83: 'Yorick', 84: 'Akali',
  85: 'Kennen', 86: 'Garen', 89: 'Leona', 90: 'Malzahar', 91: 'Talon',
  92: 'Riven', 96: 'KogMaw', 98: 'Shen', 99: 'Lux', 101: 'Xerath',
  102: 'Shyvana', 103: 'Ahri', 104: 'Graves', 105: 'Fizz', 106: 'Volibear',
  107: 'Rengar', 110: 'Varus', 111: 'Nautilus', 112: 'Viktor', 113: 'Sejuani',
  114: 'Fiora', 115: 'Ziggs', 117: 'Lulu', 119: 'Draven', 120: 'Hecarim',
  121: 'Khazix', 122: 'Darius', 126: 'Jayce', 127: 'Lissandra', 131: 'Diana',
  133: 'Quinn', 134: 'Syndra', 136: 'AurelionSol', 141: 'Kayn', 142: 'Zoe',
  143: 'Zyra', 145: 'Kaisa', 147: 'Seraphine', 150: 'Gnar', 154: 'Zac',
  157: 'Yasuo', 161: 'VelKoz', 163: 'Taliyah', 166: 'Akshan', 200: 'BelVeth',
  201: 'Braum', 202: 'Jhin', 203: 'Kindred', 221: 'Zeri', 222: 'Jinx',
  223: 'TahmKench', 233: 'Briar', 234: 'Viego', 235: 'Senna', 236: 'Lucian',
  238: 'Zed', 240: 'Kled', 245: 'Ekko', 246: 'Qiyana', 254: 'Vi',
  266: 'Aatrox', 267: 'Nami', 268: 'Azir', 350: 'Yuumi', 360: 'Samira',
  412: 'Thresh', 420: 'Illaoi', 421: 'RekSai', 427: 'Ivern', 429: 'Kalista',
  432: 'Bard', 497: 'Rakan', 498: 'Xayah', 516: 'Ornn', 517: 'Sylas',
  518: 'Neeko', 523: 'Aphelios', 526: 'Rell', 555: 'Pyke', 711: 'Vex',
  777: 'Yone', 799: 'Ambessa', 875: 'Sett', 876: 'Lillia', 887: 'Gwen',
  888: 'Renata', 895: 'Nilah', 897: 'KSante', 901: 'Smolder', 902: 'Milio',
  910: 'Hwei', 950: 'Naafiri',
};

function getChampionName(championId: number): string {
  return CHAMPION_ID_MAP[championId] || `Champion${championId}`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function MyStats() {
  const [riotId, setRiotId] = useState('');
  const [platform, setPlatform] = useState('ph2');
  const [data, setData] = useState<SummonerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    const parts = riotId.split('#');
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      setError('Please enter a valid Riot ID (e.g., Name#TAG)');
      return;
    }

    const [gameName, tagLine] = parts;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/summoner?name=${encodeURIComponent(gameName.trim())}&tag=${encodeURIComponent(tagLine.trim())}&platform=${platform}`
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch summoner data');
      }
      setData(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getSoloQueue = () => data?.ranked?.find((q) => q.queueType === 'RANKED_SOLO_5x5');
  const getFlexQueue = () => data?.ranked?.find((q) => q.queueType === 'RANKED_FLEX_SR');

  const renderRankedCard = (title: string, queue: SummonerData['ranked'][0] | undefined) => {
    if (!queue) {
      return (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
          <h4 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">{title}</h4>
          <p className="text-[var(--foreground-muted)] text-sm">Unranked</p>
        </div>
      );
    }

    const winRate = ((queue.wins / (queue.wins + queue.losses)) * 100).toFixed(1);
    const tierColor = TIER_COLORS[queue.tier] || '#e2e8f0';

    return (
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 card-hover">
        <h4 className="text-sm font-medium text-[var(--foreground-muted)] mb-3">{title}</h4>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: `${tierColor}20`, color: tierColor }}
          >
            {queue.tier[0]}
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)]" style={{ color: tierColor }}>
              {queue.tier} {queue.rank}
            </p>
            <p className="text-sm text-[var(--foreground-muted)]">{queue.leaguePoints} LP</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="text-[var(--accent-green)]">{queue.wins}W</span>
          <span className="text-[var(--accent-red)]">{queue.losses}L</span>
          <span className="text-[var(--foreground-muted)]">{winRate}%</span>
        </div>
        <div className="mt-2 w-full bg-[var(--card-border)] rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-[var(--accent-green)]"
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Look Up Summoner</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="GameName#TAG"
            className="flex-1 px-4 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent-purple)] transition-colors"
          />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="px-4 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-purple)] transition-colors"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleLookup}
            disabled={loading}
            className="px-6 py-2.5 bg-[var(--accent-purple)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Look Up'}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-[var(--accent-red)]">{error}</p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/profileicon/${data.summoner.profileIconId}.png`}
                  alt="Profile Icon"
                  className="w-20 h-20 rounded-full border-2 border-[var(--accent-purple)]"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--accent-purple)] text-white text-xs font-bold rounded-full">
                  {data.summoner.level}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">
                  {data.account.gameName}
                  <span className="text-[var(--foreground-muted)]">#{data.account.tagLine}</span>
                </h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Level {data.summoner.level}
                </p>
              </div>
            </div>
          </div>

          {/* Ranked Stats */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              Ranked
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderRankedCard('Solo/Duo', getSoloQueue())}
              {renderRankedCard('Flex', getFlexQueue())}
            </div>
          </div>

          {/* Champion Mastery */}
          {data.mastery && data.mastery.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                Top Champions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {data.mastery.map((champ, i) => {
                  const champName = getChampionName(champ.championId);
                  return (
                    <div
                      key={i}
                      className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 card-hover flex flex-col items-center text-center"
                    >
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${champName}.png`}
                        alt={champName}
                        className="w-12 h-12 rounded-full mb-2"
                      />
                      <p className="text-sm font-medium text-[var(--foreground)] truncate w-full">
                        {champName}
                      </p>
                      <p className="text-xs text-[var(--accent-purple)]">
                        Mastery {champ.championLevel}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {champ.championPoints.toLocaleString()} pts
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Matches */}
          {data.recentMatches && data.recentMatches.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                Recent Matches
              </h3>
              <div className="space-y-2">
                {data.recentMatches.map((match, i) => (
                  <div
                    key={i}
                    className={`bg-[var(--card-bg)] border rounded-xl p-4 flex items-center gap-4 ${
                      match.win
                        ? 'border-[var(--accent-green)]/30'
                        : 'border-[var(--accent-red)]/30'
                    }`}
                  >
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/15.11.1/img/champion/${match.champion}.png`}
                      alt={match.champion}
                      className="w-10 h-10 rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--foreground)] text-sm truncate">
                          {match.champion}
                        </span>
                        <span className="text-xs text-[var(--foreground-muted)]">
                          {match.gameMode}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-[var(--foreground)]">
                          {match.kills}/{match.deaths}/{match.assists}
                        </span>
                        <span className="text-xs text-[var(--foreground-muted)]">
                          {match.cs} CS
                        </span>
                        <span className="text-xs text-[var(--foreground-muted)]">
                          {formatDuration(match.gameDuration)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        match.win
                          ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]'
                          : 'bg-[var(--accent-red)]/20 text-[var(--accent-red)]'
                      }`}
                    >
                      {match.win ? 'WIN' : 'LOSS'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
