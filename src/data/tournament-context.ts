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
    { name: 'T1', region: 'LCK', seed: 1, strengths: 'Faker mid dominance, Oner jungle aggression, strong teamfight coordination, international experience', weaknesses: 'Sometimes slow early game, reliance on scaling' },
    { name: 'Karmine Corp', region: 'LEC', seed: 1, strengths: 'Creative drafts, wide champion pool, aggressive early game, Caps mid carry potential', weaknesses: 'Inconsistency in best-of series, can be punished by disciplined teams' },
    { name: 'Team Liquid', region: 'LCS', seed: 1, strengths: 'Strong macro, experienced roster, CoreJJ support vision control', weaknesses: 'Individual skill ceiling vs top Eastern teams, sometimes passive' },
    { name: 'Deep Cross Gaming', region: 'LJL', seed: 1, strengths: 'Aggressive playstyle, unexpected draft picks, strong team cohesion', weaknesses: 'Less international experience, smaller champion pools, weaker in long series' },
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
