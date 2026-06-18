export const TOURNAMENT_CONTEXT = {
  instructions: `
You are predicting for MSI 2026 (Mid-Season Invitational 2026). This is CONFIRMED information — treat it as fact.

TOURNAMENT FACTS:
- Tournament: MSI 2026
- Patch: 26.13
- Format: Fearless Draft (teams CANNOT reuse champions they already picked in a series)
- New champion: Locke (released on Patch 26.13, may or may not be enabled for pro play)
- Date: June 2026

QUALIFIED TEAMS (CONFIRMED):
- Bilibili Gaming (BLG) — LPL #1
- Top Esports (TES) — LPL #2
- G2 Esports — LEC #1
- Karmine Corp (KC) — LEC #2
- Hanwha Life Esports (HLE) — LCK #1
- T1 — LCK #2
- LYON — LCS #1
- Team Liquid (TL) — LCS #2
- Team Secret Whales (TSW) — LCP #1 (APAC)
- Deep Cross Gaming (DCG) — LCP #2 (APAC)
- FURIA — CBLOL #1

FEARLESS DRAFT IMPLICATIONS:
- Teams cannot repick champions used in prior games of a best-of series
- Champion pool DEPTH matters significantly more than in standard draft
- Teams with wider champion oceans have a massive advantage in Bo5
- LPL and LEC teams historically have the widest champion pools
- Niche picks and pocket picks become more valuable in later games of a series
- One-trick players are severely disadvantaged
- Unique champion count across the tournament will be MUCH higher than normal

PREDICTION GUIDELINES:
- Since you may not have data on Patch 26.13 specifically, base predictions on:
  - Historical team strength and international performance
  - Regional strength hierarchy (LCK/LPL historically strongest, then LEC, then others)
  - Fearless Draft advantages (wide champion pools)
  - Team synergy and roster stability
  - The general principle that engage supports, flexible carries, and versatile players perform best internationally
- Be specific with your predictions — name actual champions, players, and teams
- Give honest confidence levels — lower if you're uncertain
`,
  historicalTrends: `
Historical International Tournament Pick'em Patterns (these trends persist across years):
- Most picked champions: engage supports (Rell, Nautilus, Thresh, Renata), safe ADCs (Kai'Sa, Varus, Jinx), flex mid/top picks
- Highest winrate champions: niche counterpicks only pulled in perfect conditions (60-70%+ wr)
- Lowest winrate champions: comfort picks teams refuse to drop despite bad meta fit (historically Ryze, Azir)
- Most banned champions: strongest flex picks or lane-dominant champions of the patch
- First bloods: most often secured by aggressive junglers (Canyon, Oner, Tian historically)
- Highest CS single game: ADC in a 40+ minute game (450-500+ CS)
- Highest KDA: players from dominant teams (LCK/LPL) that stomp weaker opposition
- Shortest games: 15-20 minutes when LCK/LPL team stomps emerging region team
- Most unique champions: LEC teams (G2 especially) and LPL teams historically have widest pools
- Fearless Draft tournaments see 120-150+ unique champions (vs 85-110 in standard)
- Kill fiestas: 40-60 total kills in games between evenly-matched emerging region teams
- Elder dragons: accumulate in close, long 5-game series
- Teemo: almost never picked in pro play
- T1's Faker: historically clutch in international tournaments
- LPL teams: typically most aggressive early game
- LCK teams: typically best teamfighting and macro
- LEC teams: most creative/unpredictable drafts
`,
};
