# LoL Pick'em Predictor — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal Next.js web app that predicts LoL Pick'em matchups and Crystal Ball questions using Claude API + Leaguepedia data.

**Architecture:** Next.js App Router with API routes calling Claude API for predictions and Leaguepedia MediaWiki API for match/team data. Dark-themed esports UI with bracket view and Crystal Ball card grid. In-memory cache to avoid redundant API calls. Riot Data Dragon for champion/item images.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, @anthropic-ai/sdk, Leaguepedia MediaWiki API, Riot Data Dragon (images), Vercel

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.env.local`, `.gitignore`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/dev.kelvin/Documents/lol-pickem-predictor
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Install dependencies**

Run:
```bash
npm install @anthropic-ai/sdk
```

**Step 3: Set up environment variables**

Create `.env.local`:
```
ANTHROPIC_API_KEY=your-api-key-here
```

**Step 4: Update globals.css for dark theme**

Replace `src/app/globals.css` with dark esports theme base styles.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js project with Tailwind and Anthropic SDK"
```

---

### Task 2: Type Definitions & Data Models

**Files:**
- Create: `src/types/match.ts`
- Create: `src/types/prediction.ts`
- Create: `src/types/crystal-ball.ts`
- Create: `src/types/team.ts`

**Step 1: Define match types**

```typescript
// src/types/match.ts
export interface Team {
  name: string;
  shortName: string;
  region: string;
  logoUrl?: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  tournament: string;
  stage: string;
  date?: string;
  result?: {
    winner: string;
    score: string;
  };
}

export interface TournamentBracket {
  tournament: string;
  stages: {
    name: string;
    matches: Match[];
  }[];
}
```

**Step 2: Define prediction types**

```typescript
// src/types/prediction.ts
export interface MatchPrediction {
  matchId: string;
  predictedWinner: string;
  confidence: number;
  predictedScore: string;
  reasoning: string;
  keyFactors: string[];
  generatedAt: string;
}
```

**Step 3: Define crystal ball types**

```typescript
// src/types/crystal-ball.ts
export type CrystalBallCategory = 'champions' | 'players' | 'teams' | 'other';

export interface CrystalBallQuestion {
  id: string;
  category: CrystalBallCategory;
  question: string;
  points: number;
}

export interface CrystalBallPrediction {
  questionId: string;
  answer: string;
  confidence: number;
  reasoning: string;
  generatedAt: string;
}
```

**Step 4: Commit**

```bash
git add src/types/
git commit -m "feat: add type definitions for matches, predictions, and crystal ball"
```

---

### Task 3: Cache Layer

**Files:**
- Create: `src/lib/cache.ts`

**Step 1: Implement in-memory cache with TTL**

```typescript
// src/lib/cache.ts
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

export function invalidateCache(key: string): void {
  cache.delete(key);
}
```

**Step 2: Commit**

```bash
git add src/lib/cache.ts
git commit -m "feat: add in-memory cache layer with TTL"
```

---

### Task 4: Leaguepedia API Client

**Files:**
- Create: `src/lib/leaguepedia.ts`

**Step 1: Implement Leaguepedia MediaWiki API client**

```typescript
// src/lib/leaguepedia.ts
const LEAGUEPEDIA_API = 'https://lol.fandom.com/api.php';

interface CargoQueryParams {
  tables: string;
  fields: string;
  where?: string;
  orderBy?: string;
  limit?: number;
}

async function cargoQuery(params: CargoQueryParams) {
  const searchParams = new URLSearchParams({
    action: 'cargoquery',
    format: 'json',
    tables: params.tables,
    fields: params.fields,
    ...(params.where && { where: params.where }),
    ...(params.orderBy && { order_by: params.orderBy }),
    limit: String(params.limit || 50),
  });

  const res = await fetch(`${LEAGUEPEDIA_API}?${searchParams}`);
  const data = await res.json();
  return data.cargoquery?.map((item: any) => item.title) || [];
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
```

**Step 2: Commit**

```bash
git add src/lib/leaguepedia.ts
git commit -m "feat: add Leaguepedia MediaWiki API client"
```

---

### Task 5: Riot Data Dragon Image Helper

**Files:**
- Create: `src/lib/ddragon.ts`

**Step 1: Implement Data Dragon image URLs**

```typescript
// src/lib/ddragon.ts
const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com';

let latestVersion: string | null = null;

export async function getLatestVersion(): Promise<string> {
  if (latestVersion) return latestVersion;
  const res = await fetch(`${DDRAGON_BASE}/api/versions.json`);
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

export async function getAllChampions(): Promise<Record<string, any>> {
  const version = await getLatestVersion();
  const res = await fetch(`${DDRAGON_BASE}/cdn/${version}/data/en_US/champion.json`);
  const data = await res.json();
  return data.data;
}
```

**Step 2: Commit**

```bash
git add src/lib/ddragon.ts
git commit -m "feat: add Riot Data Dragon helper for champion/item images"
```

---

### Task 6: Claude Prediction Engine

**Files:**
- Create: `src/lib/predictor.ts`

**Step 1: Implement match prediction engine**

```typescript
// src/lib/predictor.ts
import Anthropic from '@anthropic-ai/sdk';
import { MatchPrediction } from '@/types/prediction';
import { CrystalBallPrediction, CrystalBallQuestion } from '@/types/crystal-ball';
import { Match } from '@/types/match';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function predictMatch(match: Match, context: string): Promise<MatchPrediction> {
  const prompt = `You are a League of Legends esports analyst. Based on the following data, predict the outcome of this match.

Match: ${match.team1.name} vs ${match.team2.name}
Tournament: ${match.tournament}
Stage: ${match.stage}

Context and recent data:
${context}

Respond in JSON format:
{
  "predictedWinner": "team name",
  "confidence": 0-100,
  "predictedScore": "3-1",
  "reasoning": "2-3 sentence explanation",
  "keyFactors": ["factor1", "factor2", "factor3"]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch![0]);

  return {
    matchId: match.id,
    ...result,
    generatedAt: new Date().toISOString(),
  };
}

export async function predictCrystalBall(
  question: CrystalBallQuestion,
  tournamentContext: string
): Promise<CrystalBallPrediction> {
  const prompt = `You are a League of Legends esports analyst specializing in statistical predictions. Answer this Pick'em Crystal Ball question for MSI.

Question: ${question.question}
Category: ${question.category}
Points: ${question.points}

Tournament context:
${tournamentContext}

Consider historical MSI/Worlds data, current meta, team/player tendencies.

Respond in JSON format:
{
  "answer": "your specific prediction",
  "confidence": 0-100,
  "reasoning": "2-3 sentence explanation with data points"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const result = JSON.parse(jsonMatch![0]);

  return {
    questionId: question.id,
    ...result,
    generatedAt: new Date().toISOString(),
  };
}
```

**Step 2: Commit**

```bash
git add src/lib/predictor.ts
git commit -m "feat: add Claude-powered prediction engine for matches and crystal ball"
```

---

### Task 7: API Routes

**Files:**
- Create: `src/app/api/predict/route.ts`
- Create: `src/app/api/matches/route.ts`
- Create: `src/app/api/crystal-ball/route.ts`

**Step 1: Implement POST /api/predict**

```typescript
// src/app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { predictMatch } from '@/lib/predictor';
import { getTeamRecentMatches, getHeadToHead } from '@/lib/leaguepedia';
import { getCache, setCache } from '@/lib/cache';
import { Match } from '@/types/match';
import { MatchPrediction } from '@/types/prediction';

export async function POST(request: NextRequest) {
  const match: Match = await request.json();
  const cacheKey = `predict:${match.id}`;

  const cached = getCache<MatchPrediction>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const [team1Recent, team2Recent, h2h] = await Promise.all([
    getTeamRecentMatches(match.team1.name),
    getTeamRecentMatches(match.team2.name),
    getHeadToHead(match.team1.name, match.team2.name),
  ]);

  const context = `
Team 1 (${match.team1.name}) recent results: ${JSON.stringify(team1Recent)}
Team 2 (${match.team2.name}) recent results: ${JSON.stringify(team2Recent)}
Head-to-head history: ${JSON.stringify(h2h)}`;

  const prediction = await predictMatch(match, context);
  setCache(cacheKey, prediction);

  return NextResponse.json(prediction);
}
```

**Step 2: Implement GET /api/matches**

```typescript
// src/app/api/matches/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTournamentMatches } from '@/lib/leaguepedia';
import { getCache, setCache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const tournament = request.nextUrl.searchParams.get('tournament') || 'Mid-Season Invitational 2025';
  const cacheKey = `matches:${tournament}`;

  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  const matches = await getTournamentMatches(tournament);
  setCache(cacheKey, matches, 1000 * 60 * 30); // 30 min cache

  return NextResponse.json(matches);
}
```

**Step 3: Implement POST /api/crystal-ball**

```typescript
// src/app/api/crystal-ball/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { predictCrystalBall } from '@/lib/predictor';
import { getCache, setCache } from '@/lib/cache';
import { CrystalBallQuestion, CrystalBallPrediction } from '@/types/crystal-ball';

export async function POST(request: NextRequest) {
  const { question, tournamentContext } = await request.json() as {
    question: CrystalBallQuestion;
    tournamentContext: string;
  };

  const cacheKey = `crystal-ball:${question.id}`;
  const cached = getCache<CrystalBallPrediction>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const prediction = await predictCrystalBall(question, tournamentContext);
  setCache(cacheKey, prediction);

  return NextResponse.json(prediction);
}
```

**Step 4: Commit**

```bash
git add src/app/api/
git commit -m "feat: add API routes for predictions, matches, and crystal ball"
```

---

### Task 8: Crystal Ball Questions Data

**Files:**
- Create: `src/data/crystal-ball-questions.ts`

**Step 1: Define all MSI crystal ball questions**

```typescript
// src/data/crystal-ball-questions.ts
import { CrystalBallQuestion } from '@/types/crystal-ball';

export const MSI_2025_QUESTIONS: CrystalBallQuestion[] = [
  // Champions
  { id: 'champ-most-picked', category: 'champions', question: 'For MSI Play-ins: which champion will be picked the most?', points: 50 },
  { id: 'champ-highest-wr', category: 'champions', question: 'Which champion will have the highest winrate? (minimum 5 games played)', points: 50 },
  { id: 'champ-lowest-wr', category: 'champions', question: 'Which champion will have the lowest winrate? (minimum 5 games played)', points: 50 },
  { id: 'champ-most-kills', category: 'champions', question: 'Which champion will have the most kills?', points: 50 },
  { id: 'champ-most-banned', category: 'champions', question: 'Which champion will be banned the most?', points: 50 },
  // Players
  { id: 'player-highest-kda', category: 'players', question: 'For MSI Play-ins: which pro will have the highest KDA?', points: 50 },
  { id: 'player-highest-cs', category: 'players', question: 'Which pro will earn the highest CS in a single game?', points: 100 },
  { id: 'player-most-fb', category: 'players', question: 'Which pro will get the most First Bloods?', points: 50 },
  { id: 'player-highest-dmg', category: 'players', question: 'Which pro will finish with the highest average damage per game?', points: 50 },
  // Teams
  { id: 'team-shortest-game', category: 'teams', question: 'For MSI Play-ins: which team will win the shortest game (duration)?', points: 100 },
  { id: 'team-most-elders', category: 'teams', question: 'Which team will kill the most Elder Dragons?', points: 50 },
  { id: 'team-least-kills', category: 'teams', question: 'Which team will get the least kills in a single game?', points: 50 },
  { id: 'team-most-unique-champs', category: 'teams', question: 'Which team will play the most unique Champions (largest champion pool)?', points: 50 },
  // Other
  { id: 'other-highest-kills', category: 'other', question: 'For MSI Play-ins: what will be the highest number of kills in a single game?', points: 50 },
  { id: 'other-unique-champs', category: 'other', question: 'How many unique champions will be picked?', points: 50 },
  { id: 'other-teemo', category: 'other', question: 'Will Teemo be picked?', points: 100 },
];
```

**Step 2: Commit**

```bash
git add src/data/
git commit -m "feat: add MSI 2025 crystal ball questions data"
```

---

### Task 9: Dashboard Page (Bracket + Crystal Ball Tabs)

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/TournamentTabs.tsx`
- Create: `src/components/BracketView.tsx`
- Create: `src/components/CrystalBallGrid.tsx`
- Create: `src/components/CrystalBallCard.tsx`
- Create: `src/components/MatchCard.tsx`

**Step 1: Implement TournamentTabs component**

Tab switcher between Bracket and Crystal Ball views.

**Step 2: Implement BracketView component**

Displays tournament bracket with matches. Each match shows team names, predicted winner highlighted, confidence badge.

**Step 3: Implement CrystalBallGrid component**

Grid of Crystal Ball cards grouped by category (Champions, Players, Teams, Other).

**Step 4: Implement CrystalBallCard component**

Individual card mirroring Riot's Pick'em UI: category badge, question, points, AI prediction with champion image from Data Dragon.

**Step 5: Implement MatchCard component**

Individual match in bracket showing both teams, predicted winner highlighted with confidence %.

**Step 6: Wire up dashboard page**

**Step 7: Commit**

```bash
git add src/app/page.tsx src/components/
git commit -m "feat: add dashboard with bracket and crystal ball views"
```

---

### Task 10: Match Detail Page

**Files:**
- Create: `src/app/match/[id]/page.tsx`
- Create: `src/components/TeamStats.tsx`
- Create: `src/components/PredictionPanel.tsx`

**Step 1: Implement match detail page**

Shows both teams, recent form, head-to-head, and Claude's full prediction with reasoning.

**Step 2: Implement TeamStats component**

Displays team's recent match results (last 5-10 games).

**Step 3: Implement PredictionPanel component**

Shows predicted winner, confidence %, reasoning, key factors, predicted score. Has "Refresh Prediction" button.

**Step 4: Commit**

```bash
git add src/app/match/ src/components/TeamStats.tsx src/components/PredictionPanel.tsx
git commit -m "feat: add match detail page with prediction panel"
```

---

### Task 11: Styling & Dark Theme Polish

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Configure Tailwind for esports dark theme**

Custom colors: deep navy background, cyan/gold accents (matching Pick'em UI), card backgrounds with subtle borders.

**Step 2: Polish all components**

Ensure consistent spacing, hover effects, responsive layout, loading states.

**Step 3: Commit**

```bash
git add src/app/globals.css tailwind.config.ts src/
git commit -m "feat: polish dark esports theme and responsive layout"
```

---

### Task 12: Loading States & Error Handling

**Files:**
- Create: `src/components/LoadingSpinner.tsx`
- Create: `src/components/ErrorCard.tsx`
- Modify: various page/component files

**Step 1: Add loading states for API calls**

Skeleton loaders for bracket and crystal ball cards.

**Step 2: Add error handling for failed API calls**

Graceful error display when Leaguepedia or Claude API fails.

**Step 3: Commit**

```bash
git add src/components/LoadingSpinner.tsx src/components/ErrorCard.tsx src/
git commit -m "feat: add loading states and error handling"
```

---

### Task 13: Deployment Setup

**Files:**
- Create: `vercel.json` (if needed)
- Modify: `.env.local` → `.env.example`

**Step 1: Create .env.example**

```
ANTHROPIC_API_KEY=your-key-here
```

**Step 2: Test production build**

Run:
```bash
npm run build
```

**Step 3: Deploy to Vercel**

Run:
```bash
npx vercel
```

**Step 4: Commit**

```bash
git add .env.example vercel.json
git commit -m "feat: add deployment configuration"
```

---

## Summary

| Task | Component | Estimated Time |
|------|-----------|---------------|
| 1 | Project scaffolding | 5 min |
| 2 | Type definitions | 5 min |
| 3 | Cache layer | 5 min |
| 4 | Leaguepedia API client | 10 min |
| 5 | Data Dragon images | 5 min |
| 6 | Claude prediction engine | 10 min |
| 7 | API routes | 10 min |
| 8 | Crystal Ball questions data | 5 min |
| 9 | Dashboard page (bracket + crystal ball) | 20 min |
| 10 | Match detail page | 15 min |
| 11 | Styling & theme | 10 min |
| 12 | Loading/error states | 10 min |
| 13 | Deployment | 5 min |

**Total: ~2 hours**
