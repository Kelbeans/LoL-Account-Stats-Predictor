export const TOURNAMENT_CONTEXT = {
  instructions: `
You are predicting for MSI 2026 (Mid-Season Invitational 2026). This is CONFIRMED information.

TOURNAMENT FACTS:
- Tournament: MSI 2026
- Current Live Patch: 26.12 (tournament may be played on 26.12 or 26.13)
- Format: Fearless Draft (teams CANNOT reuse champions they already picked in a series)
- New champion: Locke (upcoming)
- Date: June 2026

PATCH 26.12 CHAMPION CHANGES (CONFIRMED - use these for predictions):

BUFFED:
- Aatrox: Q sweet spot damage 70→75
- Gwen: Q base damage per snip up, E bonus AS 20%→30% early
- Hwei: Q ratios up significantly (QQ AP 70%→80%, QW AP up), E cooldown reduced
- Jax: Q mana 65→50, E max health damage 3.5%→4% min, 7%→8% max
- Sylas: Q damage and ratio up (40%→45% AP), W heal ratio 20%→30%
- Syndra: +20 base HP, Q damage up and ratio 65%→70%
- Tristana: AD growth 2.9→3.4, Q mana reduced significantly
- Yuumi: Passive heal ratio up, E shield ratio 30%→40%

NERFED:
- Lee Sin: AD growth down, Q1+Q2 damage and ratio both nerfed
- Nocturne: Q damage reduced
- Orianna: -20 base HP, passive damage stacking nerfed, R base down (ratio up)
- Ryze: -25 base HP, -3 base AD
- Xin Zhao: Passive healing nerfed, W/E mana costs up

ADJUSTED:
- Varus: Passive on-champ AS up but passive non-champ AS nerfed, Q bAD ratio significantly nerfed (100-150%→80-120%), W on-hit base nerfed early

SYSTEM: Teleport shield 30%/30s → 35%/10s (stronger but shorter)

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

META IMPLICATIONS OF PATCH 26.12:
- Sylas, Syndra, Hwei buffed = strong AP mid laners for the tournament
- Tristana buffed = viable ADC pick
- Lee Sin nerfed = may fall out of priority jungle
- Varus Q nerfed = lethality Varus weaker, on-hit may shift
- Ryze nerfed AGAIN = likely lowest winrate candidate
- Gwen buffed = potential top lane flex pick
- Jax buffed = stronger split-push/duel threat

FEARLESS DRAFT IMPLICATIONS:
- Teams cannot repick champions used in prior games of a best-of series
- Champion pool DEPTH matters significantly more than in standard draft
- LPL and LEC teams historically have the widest champion pools
- Unique champion count across the tournament will be MUCH higher than normal
- Niche picks become more valuable in later games of a series

PREDICTION GUIDELINES:
- Use the CONFIRMED patch 26.12 data above for champion-related predictions
- Base team predictions on historical strength and regional hierarchy
- LCK/LPL historically strongest internationally, then LEC, then others
- Fearless Draft favors wide champion pools
- Be specific — name actual champions, players, and teams
- Give honest confidence levels
`,
  historicalTrends: `
Historical International Tournament Pick'em Patterns:
- Most picked champions: engage supports (Rell, Nautilus, Thresh), safe ADCs, flex mid/top picks
- Highest winrate: niche counterpicks only pulled in perfect conditions (60-70%+ wr)
- Lowest winrate: comfort picks teams refuse to drop despite bad meta (Ryze is ALWAYS a candidate)
- Most banned: strongest flex picks or lane-dominant champions of the patch
- First bloods: aggressive junglers (Canyon, Oner, Tian historically)
- Highest CS single game: ADC in a 40+ minute game (450-500+ CS)
- Highest KDA: players from dominant teams that stomp weaker opposition
- Shortest games: 15-20 minutes when LCK/LPL stomps emerging region
- Most unique champions: LEC (G2) and LPL teams historically widest pools
- Fearless Draft inflates unique champion count to 120-150+
- Elder dragons: accumulate in close 5-game series
- Teemo: almost never picked in pro play
`,
};
