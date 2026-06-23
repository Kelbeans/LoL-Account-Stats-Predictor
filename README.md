# LoL Pick'em Predictor

AI-powered predictions for League of Legends Pick'em events (MSI and Worlds).

## Features

- **Bracket Predictions** - Cascading bracket view where predicted winners flow into later rounds
- **Crystal Ball** - AI predictions for champion/player/team questions (most picked, highest winrate, most bans, etc.)
- **Teams** - Live team data fetched from Leaguepedia (rosters, logos, regions, seeds)
- **My Stats** - Look up your LoL account stats via Riot API (rank, match history, mastery)
- **Fearless Draft aware** - Predictions account for Fearless Draft format implications
- **Persistent** - All predictions saved to localStorage (no re-calling AI on refresh)
- **Auto-updating** - Detects current tournament and patch automatically

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS (dark esports theme)
- Claude Opus 4.5 (via AWS Bedrock gateway) for predictions
- Leaguepedia MediaWiki API for team/roster/match data
- Riot Data Dragon for champion/item images
- Riot API for personal account stats

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your keys to `.env.local`:

```
ANTHROPIC_BASE_URL=https://your-gateway.com/bedrock/v1
ANTHROPIC_API_KEY=your-gateway-api-key
RIOT_API_KEY=RGAPI-your-riot-api-key
```

## Run

```bash
npm run dev
```

Open http://localhost:3000

## Data Sources

| Source | What it provides |
|--------|-----------------|
| Leaguepedia (lol.fandom.com) | Team rosters, logos, tournament data, match history |
| Riot Data Dragon | Champion images, item icons, patch versions |
| Riot API | Personal account stats (rank, match history, mastery) |
| LoL Patch Notes (leagueoflegends.com) | Current patch champion changes |

## Notes

- Riot API dev keys expire every 24 hours - regenerate at https://developer.riotgames.com
- Leaguepedia has rate limits - the app gracefully handles these with caching
- Predictions use confirmed patch data + historical patterns (not model hallucinations)
- All tournament data auto-updates when Leaguepedia is updated
