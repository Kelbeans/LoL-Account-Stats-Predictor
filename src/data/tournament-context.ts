export const TOURNAMENT_CONTEXT = {
  instructions: `
You are predicting for the CURRENT League of Legends international tournament (MSI or Worlds).
Use your most up-to-date knowledge to determine:
- What is the current tournament happening right now (MSI or Worlds, and what year)
- What patch the tournament is being played on
- What draft format is being used (Standard or Fearless Draft)
- Which teams qualified and from which regions
- The current champion meta on the tournament patch
- Recent team performance from their qualifying leagues

IMPORTANT RULES:
- Always use the LATEST information you have — do not rely on outdated data
- If Fearless Draft is being used, factor in champion pool depth
- Consider new champions that may have been released for the tournament patch
- Factor in international experience and historical patterns

Provide specific, confident predictions based on current data. If you are unsure about something, say so rather than guessing with outdated info.
`,
  historicalTrends: `
Historical International Tournament Pick'em Patterns (these trends persist across years):
- Most picked champions: engage supports, safe ADCs, flex mid/top picks dominate pick rates
- Highest winrate champions: niche counterpicks only pulled in perfect conditions (60-70%+ wr)
- Lowest winrate champions: comfort picks teams refuse to drop despite bad meta fit
- Most banned champions: strongest flex picks or lane-dominant champions of the patch
- First bloods: most often secured by aggressive junglers
- Highest CS single game: ADC in a 40+ minute game (450-500+ CS)
- Highest KDA: players from dominant teams that win quickly with few deaths
- Shortest games: 15-20 minutes when top seed stomps emerging region team
- Most unique champions: LEC and LPL teams historically have widest pools
- Kill fiestas: 40-60 total kills in games between evenly-matched emerging region teams
- Unique champions across play-in stage: typically 85-110+
- Elder dragons: accumulate in close, long 5-game series
- Teemo: almost never picked in pro play (has happened once or twice in history)
- Fearless Draft (if used): inflates unique champion count significantly, favors deep pools
`,
};
