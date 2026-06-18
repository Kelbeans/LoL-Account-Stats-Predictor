export const MSI_2025_CONTEXT = {
  tournament: 'MSI 2025',
  patch: '15.11',
  patchNotesSummary: `
Patch 15.11 Key Changes (MSI 2025 Tournament Patch):

CHAMPION BUFFS:
- Rell: Base armor increased, W shield value up — stronger as engage support
- Rumble: R damage increased, passive overheat bonus up — better teamfight carry
- Kai'Sa: Q isolation damage ratio increased — stronger picks in skirmishes
- Varus: W on-hit AP ratio up — lethality and on-hit builds both stronger
- Skarner: Base stats up, E stun duration increased — more reliable engage
- Tristana: Attack speed growth increased — better scaling ADC
- Aurora: R cooldown reduced, W movement speed up — stronger roaming mid

CHAMPION NERFS:
- Ksante: W unstoppable duration reduced, R bonus AD ratio down — less dominant top
- Smolder: Q base damage reduced early — weaker laning phase
- Corki: Package cooldown increased — less frequent roam window
- Ambessa: Passive shield reduced — more punishable in trades
- Zeri: Q crit ratio reduced — less burst damage

ITEM CHANGES:
- Blackfire Torch: AP reduced from 90 to 80 — mage item nerf
- Stormsurge: Proc damage reduced — less burst on poke mages
- Opportunity: Lethality increased — assassin item buff
- Jak'Sho: Max health scaling reduced — tank item adjustment

SYSTEM CHANGES:
- Dragon soul spawn timer slightly increased
- Baron Nashor HP increased — harder to rush
- Grubs: gold reward slightly reduced early

META IMPLICATIONS:
- Engage support meta (Rell, Nautilus, Leona) over enchanters
- ADC meta favors Kai'Sa, Varus, Tristana, Jinx
- Mid lane: Aurora, Ahri, Orianna, Corki (despite nerf) expected to be priority
- Top lane: tanks/bruisers with K'Sante falling out of permanent priority
- Jungle: Skarner, Viego, Lee Sin expected to be high priority
`,
  teams: [
    {
      name: 'Bilibili Gaming', region: 'LPL', seed: 1,
      strengths: 'knight mid carry, Bin split-push pressure, Xun aggressive jungle pathing, ON roaming support',
      weaknesses: 'Can overforce fights, sometimes lose through draft ego',
      qualifyingResult: 'LPL Spring 2025 Champion. Playoff record: 3-1 vs WBG, 3-2 vs TES in Finals. Regular season: 14-2. Dominant early game team with highest first blood rate in LPL.',
    },
    {
      name: 'Top Esports', region: 'LPL', seed: 2,
      strengths: 'JackeyLove late-game teamfighting, Meiko vision control, 369 weak-side top',
      weaknesses: 'Inconsistent early game, Creme sometimes invisible on non-comfort picks',
      qualifyingResult: 'LPL Spring 2025 Runner-up. Lost Finals 2-3 vs BLG. Playoff record: 3-0 vs LNG, 3-1 vs WBG. Regular season: 12-4. Best teamfighting in LPL.',
    },
    {
      name: 'G2 Esports', region: 'LEC', seed: 1,
      strengths: 'Caps versatile mid pool, BrokenBlade carry top, creative drafts, strong in best-of series',
      weaknesses: 'Can int early game with overaggression, reliance on Caps performing',
      qualifyingResult: 'LEC Spring 2025 Champion. Playoff record: 3-1 vs FNC, 3-1 vs KC in Finals. Regular season: 13-5. Highest champion diversity in LEC.',
    },
    {
      name: 'Karmine Corp', region: 'LEC', seed: 2,
      strengths: 'Strong teamfighting, Upset consistent ADC, good draft adaptation',
      weaknesses: 'Weaker individual lanes vs top Eastern teams, can be snowballed against',
      qualifyingResult: 'LEC Spring 2025 Runner-up. Lost Finals 1-3 vs G2. Beat FNC 3-2 in semis. Regular season: 11-7. Strong improvement throughout split.',
    },
    {
      name: 'Hanwha Life Esports', region: 'LCK', seed: 1,
      strengths: 'Zeus carry top, Viper lane dominance, Peanut objective control, Zeka clutch factor',
      weaknesses: 'Sometimes slow to adapt draft meta, can be beaten through bot lane',
      qualifyingResult: 'LCK Spring 2025 Champion. Playoff record: 3-0 vs DK, 3-2 vs T1 in Finals. Regular season: 15-3. Most dominant LCK team in spring.',
    },
    {
      name: 'T1', region: 'LCK', seed: 2,
      strengths: 'Faker clutch plays, Keria support gap, Oner aggressive pathing, international experience (Worlds 2024 champions)',
      weaknesses: 'Gumayusi inconsistency, Doran limited champion pool',
      qualifyingResult: 'LCK Spring 2025 Runner-up. Lost Finals 2-3 vs HLE. Beat GEN 3-1 in semis. Regular season: 14-4. Still the most internationally experienced LCK team.',
    },
    {
      name: 'LYON', region: 'LCS', seed: 1,
      strengths: 'Josedeodo jungle aggression, strong early game skirmishing, surprise factor',
      weaknesses: 'Less experience vs top international teams, can struggle in extended series',
      qualifyingResult: 'LCS Spring 2025 Champion. Playoff record: 3-2 vs TL in Finals. Regular season: 12-6. Highest early game rating in LCS.',
    },
    {
      name: 'Team Liquid', region: 'LCS', seed: 2,
      strengths: 'CoreJJ vision and macro, Impact weak-side top, APA mid consistency, strong teamfight coordination',
      weaknesses: 'Slower pace vs aggressive teams, can be punished early',
      qualifyingResult: 'LCS Spring 2025 Runner-up. Lost Finals 2-3 vs LYON. Beat FLY 3-1 in semis. Regular season: 13-5. Best macro team in LCS.',
    },
    {
      name: 'Team Secret Whales', region: 'LCP', seed: 1,
      strengths: 'Aggressive teamfighting, strong skirmish compositions, coordinated dives',
      weaknesses: 'Macro gaps vs major regions, limited international experience',
      qualifyingResult: 'LCP Spring 2025 Champion. Dominated APAC region. Regular season: 14-4. Strong in fast-paced games.',
    },
    {
      name: 'Deep Cross Gaming', region: 'LCP', seed: 2,
      strengths: 'Evi veteran top, Steal jungle experience, disciplined macro for minor region',
      weaknesses: 'Individual skill gaps vs major regions, predictable playstyle',
      qualifyingResult: 'LCP Spring 2025 Runner-up. Regular season: 11-7. Consistent but not explosive.',
    },
    {
      name: 'FURIA', region: 'CBLOL', seed: 1,
      strengths: 'Aggressive Brazilian playstyle, Cariok jungle tempo, Tutsz mid carry',
      weaknesses: 'Historically weak international results for CBLOL teams, can be outmacro-ed',
      qualifyingResult: 'CBLOL Spring 2025 Champion. Dominated Brazilian league. Regular season: 15-3. Highest kill rate in CBLOL.',
    },
  ],
  historicalTrends: `
Historical MSI/Worlds Pick'em Trends:
- Most picked champions at internationals: engage supports (Nautilus, Rell, Thresh), safe ADCs (Kai'Sa, Varus, Jinx), flex picks (Aurora, Ahri)
- Highest winrate champions typically are niche counterpicks only pulled when conditions are perfect (60-70%+ wr)
- Lowest winrate champions are often comfort picks that teams refuse to drop despite bad meta fit (Ryze historically)
- Most banned champions are typically the strongest flex picks or lane-dominant champions of the patch
- First bloods are most often secured by aggressive junglers (early game focused)
- Highest CS in a single game is usually an ADC in a 40+ minute game (450-500+ CS)
- Highest KDA players come from dominant teams that win quickly with few deaths
- Shortest games at internationals: 15-20 minutes when top seed stomps wildcard
- Most unique champions: teams with diverse champion pools (historically EU teams)
- Teemo has been picked exactly once in major international tournament history
- Average total kills in a single game peaks at 40-60 in wildcard vs wildcard fiestas
- Unique champions picked across a tournament play-in stage: typically 85-110
- Elder dragons are more common in close, long series — teams that go to 5 games accumulate more
`,
};
