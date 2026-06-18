const LEAGUEPEDIA_API = 'https://lol.fandom.com/api.php';

interface CargoQueryParams {
  tables: string;
  fields: string;
  where?: string;
  orderBy?: string;
  limit?: number;
}

async function cargoQuery(params: CargoQueryParams): Promise<Record<string, string>[]> {
  const searchParams = new URLSearchParams({
    action: 'cargoquery',
    format: 'json',
    tables: params.tables,
    fields: params.fields,
    limit: String(params.limit || 50),
  });

  if (params.where) searchParams.set('where', params.where);
  if (params.orderBy) searchParams.set('order_by', params.orderBy);

  const res = await fetch(`${LEAGUEPEDIA_API}?${searchParams}`, {
    headers: { 'User-Agent': 'LoLPickemPredictor/1.0' },
  });

  if (!res.ok) {
    throw new Error(`Leaguepedia API error: ${res.status}`);
  }

  const data = await res.json();
  return data.cargoquery?.map((item: { title: Record<string, string> }) => item.title) || [];
}

export async function getTournamentMatches(tournament: string) {
  return cargoQuery({
    tables: 'MatchSchedule',
    fields: 'Team1,Team2,Winner,DateTime_UTC,BestOf,Tab',
    where: `OverviewPage="${tournament}"`,
    orderBy: 'DateTime_UTC',
    limit: 100,
  });
}

export async function getTeamRecentMatches(team: string, limit = 10) {
  return cargoQuery({
    tables: 'MatchSchedule',
    fields: 'Team1,Team2,Winner,DateTime_UTC,OverviewPage',
    where: `(Team1="${team}" OR Team2="${team}") AND Winner IS NOT NULL`,
    orderBy: 'DateTime_UTC DESC',
    limit,
  });
}

export async function getHeadToHead(team1: string, team2: string) {
  return cargoQuery({
    tables: 'MatchSchedule',
    fields: 'Team1,Team2,Winner,DateTime_UTC,OverviewPage',
    where: `((Team1="${team1}" AND Team2="${team2}") OR (Team1="${team2}" AND Team2="${team1}")) AND Winner IS NOT NULL`,
    orderBy: 'DateTime_UTC DESC',
    limit: 20,
  });
}
