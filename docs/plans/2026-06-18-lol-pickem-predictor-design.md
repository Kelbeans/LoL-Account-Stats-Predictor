# LoL Pick'em Predictor — Design

## Purpose

Personal web app that provides AI-powered predictions for League of Legends Pick'em events (MSI and Worlds). Shows tournament brackets with predicted winners and confidence levels, with the ability to drill into any matchup for detailed reasoning.

## Architecture

```
Next.js App (Vercel)
├── Dashboard Page — bracket view with all matches + predicted winners
├── Match Detail Page — deep analysis with reasoning, stats, confidence %
├── API Routes
│   ├── /api/predict — calls Claude API with match context
│   └── /api/matches — fetches match data from Leaguepedia
└── Cache layer (simple file/KV) — avoid re-calling Claude for same matchup
```

## Core Features

1. **Tournament Dashboard** — Visual bracket showing all matches, predicted winner highlighted with confidence level (e.g., "KC 72%")
2. **Match Detail** — Click any match to see:
   - Team recent form (last 5-10 matches)
   - Head-to-head history
   - Claude's prediction with full reasoning
   - Key factors (roster strength, meta read, international experience)
3. **Data Source** — Leaguepedia/Fandom MediaWiki API for team stats, match history, and tournament schedules
4. **Prediction Engine** — Claude API call with structured prompt including team data, recent results, and tournament context
5. **Caching** — Once a prediction is generated for a matchup, cache it. Button to refresh prediction for updated take.

## Tech Stack

- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS (dark theme, esports aesthetic)
- Claude API (via @anthropic-ai/sdk)
- Leaguepedia MediaWiki API for data
- Vercel for deployment
- In-memory/file-based cache (no database)

## Pages

### `/` — Dashboard
- Tournament selector (MSI 2025, Worlds 2025, etc.)
- Two tabs: **Bracket** and **Crystal Ball**
- Bracket tab: bracket visualization with predicted winners highlighted
- Crystal Ball tab: grid of Pick'em questions with AI-predicted answers
- Confidence percentage badge on each match/question
- Click any match to navigate to detail

### `/match/[id]` — Match Detail
- Both teams displayed with logos/names
- Recent match history for each team
- Head-to-head record
- AI prediction section:
  - Predicted winner + confidence %
  - Reasoning breakdown (key factors)
  - Predicted series score (e.g., 3-1)
- "Refresh Prediction" button

### `/crystal-ball` — Crystal Ball Predictions
- Grid of Pick'em Crystal Ball cards (mirrors Riot's UI)
- Three categories: Champions, Players, Teams
- Each card shows:
  - Category icon/badge
  - Question text
  - Point value
  - AI-predicted answer with reasoning
- "Refresh" button per card
- Color-coded confidence (green = high, yellow = medium, red = low)

## API Routes

### `POST /api/predict`
- Input: team1, team2, tournament context, recent stats
- Fetches relevant data from Leaguepedia
- Calls Claude API with structured prompt
- Returns: predicted winner, confidence, reasoning, predicted score
- Caches result by matchup key

### `GET /api/matches?tournament=msi-2025`
- Fetches tournament schedule/bracket from Leaguepedia
- Returns: list of matches with teams, stage, date

### `POST /api/crystal-ball`
- Input: question text, category (champions/players/teams), tournament context
- Calls Claude API with meta knowledge + current patch/tournament data
- Returns: predicted answer, confidence %, reasoning
- Caches result by question key

### `GET /api/crystal-ball/questions?tournament=msi-2025`
- Returns the list of Crystal Ball questions for the tournament
- Categories: champions, players, teams

## Crystal Ball Questions (MSI Play-ins)

### Champions
1. Which champion will be picked the most? (50 pts)
2. Which champion will have the highest winrate? (min 5 games) (50 pts)
3. Which champion will have the lowest winrate? (min 5 games) (50 pts)
4. Which champion will have the most kills? (50 pts)
5. Which champion will be banned the most? (50 pts)

### Players
1. Which pro will have the highest KDA? (50 pts)
2. Which pro will earn the highest CS in a single game? (100 pts)
3. Which pro will get the most First Bloods? (50 pts)
4. Which pro will finish with the highest average damage per game? (50 pts)

### Teams
1. Which team will win the shortest game (duration)? (100 pts)
2. Which team will kill the most Elder Dragons? (50 pts)
3. Which team will get the least kills in a single game? (50 pts)
4. Which team will play the most unique Champions (largest champion pool)? (50 pts)

### Other
1. What will be the highest number of kills in a single game? (50 pts)
2. How many unique champions will be picked? (50 pts)
3. Will Teemo be picked? (100 pts)

## Data Flow

1. App loads → fetch tournament bracket from Leaguepedia
2. For each match, check cache for existing prediction
3. If cached → display immediately
4. If not cached → show "Generate Prediction" button
5. User clicks → call /api/predict → display result + cache

## Out of Scope

- User accounts/authentication
- Community voting/social features
- Multiple users
- Database
- Push notifications
- Historical prediction accuracy tracking
