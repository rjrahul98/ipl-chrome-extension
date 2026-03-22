# CLAUDE.md — CricKit Chrome Extension

## What is CricKit?
An AI-powered Chrome extension that gives cricket fans a beautiful, non-intrusive way to follow IPL 2026 live matches while working. It's not just another score ticker — it uses Claude AI to deliver contextual, insightful notifications and match analysis.

## Target User
Working professionals who are IPL fans. They can't watch the match but want to stay connected without switching tabs or opening Cricbuzz every 2 minutes.

## Tech Stack
- **Build**: Vite + @crxjs/vite-plugin (Manifest V3)
- **UI**: React 18 + TypeScript (strict)
- **Styling**: Tailwind CSS 3
- **State**: Zustand
- **Charts**: Recharts (win probability, manhattan chart)
- **AI**: Claude API (Sonnet) for smart notifications & insights
- **Data**: CricketData.org REST API (free tier: 100 req/day)
- **Storage**: chrome.storage.local for preferences & cached data

## Project Structure
```
crickit-extension/
├── src/
│   ├── popup/                  # Extension popup (React SPA)
│   │   ├── App.tsx             # Root with tab navigation
│   │   ├── pages/
│   │   │   ├── LiveMatch.tsx   # Live match scorecard view
│   │   │   ├── Schedule.tsx    # Upcoming & recent matches
│   │   │   ├── Insights.tsx    # AI match analysis & chat
│   │   │   └── Settings.tsx    # User preferences
│   │   └── components/
│   │       ├── Scorecard.tsx       # Main score display
│   │       ├── BatterCard.tsx      # Current batter stats
│   │       ├── BowlerCard.tsx      # Current bowler stats  
│   │       ├── OverTimeline.tsx    # Dot-ball visualization for recent overs
│   │       ├── WinProbBar.tsx      # Win probability gradient bar
│   │       ├── ManhattanChart.tsx  # Runs per over bar chart (Recharts)
│   │       ├── MatchCard.tsx       # Schedule match card
│   │       ├── TeamLogo.tsx        # Team badge/logo component
│   │       └── TabNav.tsx          # Bottom tab navigation
│   ├── background/
│   │   ├── index.ts            # Service worker entry
│   │   ├── matchPoller.ts      # Fetches live data every 30s
│   │   ├── aiEngine.ts         # Claude API for smart insights
│   │   └── notifications.ts   # Smart notification manager
│   ├── content/
│   │   ├── ticker.tsx          # Injected score ticker bar
│   │   └── ticker.css          # Ticker styles (isolated)
│   ├── shared/
│   │   ├── types.ts            # All TypeScript types
│   │   ├── constants.ts        # Team data, colors, API URLs
│   │   ├── storage.ts          # chrome.storage helpers
│   │   ├── messaging.ts        # Background <-> popup messaging
│   │   └── api.ts              # CricketData.org API client
│   └── assets/
│       └── icons/              # Extension icons (16, 48, 128px)
├── public/
│   └── popup.html
├── manifest.json               # Chrome Manifest V3
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env                        # API keys (gitignored)
```

## Manifest V3 Config
```json
{
  "manifest_version": 3,
  "name": "CricKit — AI Cricket Companion",
  "version": "0.1.0",
  "description": "AI-powered live cricket scores, smart notifications, and match insights for IPL 2026",
  "action": {
    "default_popup": "src/popup/popup.html",
    "default_icon": {
      "16": "src/assets/icons/icon16.png",
      "48": "src/assets/icons/icon48.png",
      "128": "src/assets/icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "src/background/index.ts",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content/ticker.tsx"],
      "css": ["src/content/ticker.css"],
      "run_at": "document_idle"
    }
  ],
  "permissions": ["storage", "alarms", "notifications"],
  "host_permissions": [
    "https://api.cricapi.com/*",
    "https://api.anthropic.com/*"
  ],
  "icons": {
    "16": "src/assets/icons/icon16.png",
    "48": "src/assets/icons/icon48.png",
    "128": "src/assets/icons/icon128.png"
  }
}
```

## Core TypeScript Types

```typescript
// shared/types.ts

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'abandoned'
export type InningsPhase = 'powerplay' | 'middle' | 'death'
export type BallOutcome = 'dot' | '1' | '2' | '3' | '4' | '6' | 'W' | 'wd' | 'nb' | 'lb' | 'b'

export interface Team {
  id: string
  name: string
  short: string        // "RCB", "MI", "CSK"
  color: string        // primary hex
  logo?: string        // URL or local asset
}

export interface Match {
  id: string
  status: MatchStatus
  venue: string
  date: string         // ISO
  teams: { home: Team; away: Team }
  toss?: { winner: string; decision: 'bat' | 'bowl' }
  innings: Innings[]
  result?: string      // "RCB won by 6 wickets"
}

export interface Innings {
  battingTeam: string  // team short code
  score: number
  wickets: number
  overs: number        // 14.3 format
  runRate: number
  requiredRate?: number
  target?: number
  batters: BatterState[]
  bowler?: BowlerState
  recentOvers: BallOutcome[][]  // last 3-4 overs
  fow: { player: string; score: string; overs: number }[]
}

export interface BatterState {
  name: string
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  isOnStrike: boolean
}

export interface BowlerState {
  name: string
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
}

export interface MatchEvent {
  type: 'wicket' | 'boundary' | 'six' | 'fifty' | 'century' | 'milestone' | 'over_complete'
  significance: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: number
}

export interface AiInsight {
  title: string
  body: string
  emoji: string
  significance: 'low' | 'medium' | 'high' | 'critical'
  generatedAt: number
}

export interface UserPreferences {
  followedTeams: string[]            // team short codes
  notificationsEnabled: boolean
  notifyOn: {
    wickets: boolean
    boundaries: boolean
    milestones: boolean              // 50s, 100s
    closeFinishes: boolean           // win prob shifts >15%
  }
  meetingMode: boolean               // suppress notifications, queue for summary
  tickerEnabled: boolean
  tickerPosition: 'top' | 'bottom'
  theme: 'light' | 'dark' | 'system'
  claudeApiKey?: string              // user provides their own key
}
```

## Team Constants

```typescript
// shared/constants.ts

export const IPL_TEAMS: Record<string, Team> = {
  RCB: { id: 'rcb', name: 'Royal Challengers Bengaluru', short: 'RCB', color: '#E42A2A' },
  SRH: { id: 'srh', name: 'Sunrisers Hyderabad', short: 'SRH', color: '#FF822A' },
  MI:  { id: 'mi',  name: 'Mumbai Indians', short: 'MI', color: '#004BA0' },
  KKR: { id: 'kkr', name: 'Kolkata Knight Riders', short: 'KKR', color: '#3A225D' },
  CSK: { id: 'csk', name: 'Chennai Super Kings', short: 'CSK', color: '#FFCB05' },
  DC:  { id: 'dc',  name: 'Delhi Capitals', short: 'DC', color: '#17479E' },
  RR:  { id: 'rr',  name: 'Rajasthan Royals', short: 'RR', color: '#E73895' },
  PBKS:{ id: 'pbks',name: 'Punjab Kings', short: 'PBKS', color: '#ED1B24' },
  GT:  { id: 'gt',  name: 'Gujarat Titans', short: 'GT', color: '#1C1C2B' },
  LSG: { id: 'lsg', name: 'Lucknow Super Giants', short: 'LSG', color: '#A72056' },
}

export const API_BASE = 'https://api.cricapi.com/v1'
```

## CricketData.org API Integration

API key goes in `.env` as `VITE_CRICKET_API_KEY`.

Key endpoints to integrate:
```
GET /currentMatches?apikey={key}&offset=0    → live + recent matches
GET /match_info?apikey={key}&id={matchId}    → detailed match info
GET /match_scorecard?apikey={key}&id={matchId} → full scorecard with batting/bowling
GET /series_info?apikey={key}&id={seriesId}  → tournament info
GET /match_points?apikey={key}&id={seriesId} → points table
```

Response shape for currentMatches (key fields):
```json
{
  "data": [{
    "id": "abc123",
    "name": "Royal Challengers Bengaluru vs Sunrisers Hyderabad, 1st Match",
    "status": "Royal Challengers Bengaluru opt to bat",
    "venue": "M.Chinnaswamy Stadium, Bengaluru",
    "date": "2026-03-28",
    "dateTimeGMT": "2026-03-28T14:00:00",
    "teams": ["Royal Challengers Bengaluru", "Sunrisers Hyderabad"],
    "teamInfo": [
      { "name": "Royal Challengers Bengaluru", "shortname": "RCB", "img": "https://..." },
      { "name": "Sunrisers Hyderabad", "shortname": "SRH", "img": "https://..." }
    ],
    "score": [
      { "r": 186, "w": 4, "o": 20, "inning": "Royal Challengers Bengaluru Inning 1" },
      { "r": 145, "w": 7, "o": 17.3, "inning": "Sunrisers Hyderabad Inning 1" }
    ],
    "series_id": "series123",
    "matchType": "t20",
    "matchStarted": true,
    "matchEnded": false
  }]
}
```

Important: The free tier is 100 requests/day. Poll every 30 seconds ONLY during live matches. Cache aggressively. For development, build a mock provider that returns realistic data so you're not burning API calls.

## AI Smart Notifications (Claude API)

The key differentiator. When significant match events happen, send context to Claude Sonnet and get back an insightful notification — not just raw data.

### How it works:
1. Background service worker polls match data every 30s
2. Detects significant events (wicket, milestone, big over, close finish)
3. Batches events per over (don't call AI per ball)
4. Calls Claude API with match context
5. Formats response as Chrome notification

### Claude API call pattern:
```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'  // needed for browser calls
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: `You are a witty, knowledgeable IPL cricket analyst. Given match state and recent events, generate a brief notification. Be insightful, not just descriptive. Add context (venue records, player form, match situation). Keep title under 60 chars, body under 150 chars. Respond ONLY with JSON, no markdown.`,
    messages: [{
      role: 'user',
      content: JSON.stringify({
        match: { teams: 'RCB vs SRH', venue: 'Chinnaswamy', phase: 'death' },
        state: { score: '165/4', overs: 18.2, required: '22 off 10' },
        event: { type: 'six', batter: 'Dinesh Karthik', description: 'DK smashes Bhuvi for six over long-on' },
        context: { venue_avg_2nd_innings: 168, win_prob_shift: '+12% to batting team' }
      })
    }]
  })
})
```

### Expected AI response:
```json
{
  "title": "DK Finisher Mode Activated 🔥",
  "body": "22 off 10 at Chinnaswamy? That's DK's playground. RCB's win probability just jumped 12%. Bhuvi's economy in death overs this season: 11.2",
  "emoji": "🔥",
  "significance": "high"
}
```

### Meeting Mode:
When enabled, suppress all notifications. Queue match events. When user disables meeting mode, call Claude with the full list of queued events and generate a single catch-up summary:
"While you were away (45 mins): RCB posted 186/4 with Kohli hitting 73(44). SRH are 89/3 after 12 overs — match is evenly poised."

## Design Direction

### Aesthetic: Dark, premium, sports-broadcast feel
- Dark background (#0A0A0F or similar deep navy-black)
- Team colors used as accent highlights (not background fills)
- Crisp white/light gray text on dark
- Subtle glassmorphism on cards (backdrop-blur, semi-transparent bg)
- Sharp, modern typography — use a sports/tech font like "DM Sans" or "Outfit"
- Micro-animations: score changes should flash/pulse, wickets should shake
- Gradient accents using team colors for active match indicators
- Compact, information-dense layout — every pixel matters in a 400x600 popup

### Popup Layout (400w x 600h):
```
┌─────────────────────────────────┐
│  🏏 CricKit          ⚙️  (32px) │  ← Header
├─────────────────────────────────┤
│                                 │
│  [Main Content Area - 520px]    │  ← Scrollable
│                                 │
│  Based on active tab:           │
│  • Live: Scorecard + batters    │
│    + bowler + recent overs      │
│    + win probability bar        │
│  • Schedule: Match cards list   │
│  • Insights: AI analysis + chat │
│  • Settings: Preferences        │
│                                 │
├─────────────────────────────────┤
│  🏏 Live | 📅 Schedule | 🤖 AI │  ← Bottom tabs (48px)
│         | ⚙️ Settings           │
└─────────────────────────────────┘
```

### Live Match View Detail:
```
┌─────────────────────────────────┐
│  RCB  🔴                  🟠 SRH │
│  186/4 (20)          145/7 (17.3)│  ← Big score display
│  ───────────────────────────────│
│  SRH need 42 off 15 balls       │  ← Match situation
│  CRR: 8.29  RRR: 16.80          │
├─────────────────────────────────┤
│  🏏 Batters                      │
│  H. Klaasen*   34 (18)  SR 188  │  ← * = on strike
│  B. Kumar       2 (4)   SR 50   │
│                                  │
│  ⚾ Bowler                       │
│  Y. Dayal    3.3-0-28-2  ER 8.0 │
├─────────────────────────────────┤
│  Recent Overs                    │
│  17: ● 1 4 ● 2 6  = 13          │  ← Dots, runs, W colored
│  16: 1 ● W 4 1 ●  = 6           │
│  15: 4 1 1 6 ● 2  = 14          │
├─────────────────────────────────┤
│  Win Probability                 │
│  RCB ████████████░░░░░ SRH       │  ← Gradient bar
│       68%            32%         │
└─────────────────────────────────┘
```

### Over Timeline Dot Visualization:
- Dot ball: small gray circle
- 1-3 runs: small colored circle (white/light)
- 4: green circle/diamond
- 6: gold/yellow circle (larger)
- Wicket: red "W"
- Wide/No-ball: small outlined circle

## Content Script Ticker Bar

A minimal, always-visible bar injected on web pages:
```
┌──────────────────────────────────────────────────────────┐
│  🏏 RCB 186/4 (20)  vs  SRH 145/7 (17.3) • Need 42/15b │  ← 32px height
└──────────────────────────────────────────────────────────┘
```
- Fixed to bottom of viewport
- Dark semi-transparent background with backdrop-blur
- Team colors as subtle left/right border accents
- Click to expand popup with more detail
- "X" to dismiss (remembers per-session)
- Shadow DOM to isolate styles from host page

## Background Service Worker Logic

```
1. On install → set default preferences, register alarm
2. Every 30s alarm → 
   a. Check if any followed team is playing (from cached schedule)
   b. If yes, fetch live score from API
   c. Compare with previous state (stored in chrome.storage)
   d. Detect events: new wicket? milestone? big over? win prob shift?
   e. If significant event + notifications enabled + not meeting mode:
      → Call Claude API for smart notification
      → Show Chrome notification
   f. If meeting mode: queue the event
   g. Update badge text with live score (e.g., "145/7")
   h. Send updated data to popup via chrome.runtime messaging
3. On meeting mode disable →
   → Send all queued events to Claude for catch-up summary
   → Show single summary notification
```

## Development Commands
```bash
pnpm install              # install deps
pnpm dev                  # Vite dev server + CRXJS HMR
pnpm build                # production build to dist/
pnpm lint                 # ESLint + TypeScript check
```

Load the extension: chrome://extensions → Developer mode → Load unpacked → select `dist/` folder.

## Environment Variables
```env
VITE_CRICKET_API_KEY=your_cricketdata_api_key
VITE_CLAUDE_API_KEY=your_anthropic_api_key
```

## Build Order (follow this sequence)

### Step 1: Scaffold
Set up Vite + CRXJS + React + Tailwind + Manifest V3. Get a blank popup rendering.

### Step 2: Types & Constants
Create all TypeScript types and team constants in shared/.

### Step 3: Mock Data
Build a realistic mock data provider with a fake live RCB vs SRH match. This unblocks all UI work without burning API calls.

### Step 4: Popup — Live Match View
Build the scorecard, batter/bowler cards, over timeline, and win probability bar. This is the hero screen — make it beautiful.

### Step 5: Popup — Schedule & Settings
Schedule page with upcoming IPL 2026 matches. Settings page with team follows, notification toggles, meeting mode, theme.

### Step 6: Background Service Worker
Match polling loop, event detection, badge text updates, messaging to popup.

### Step 7: Content Script Ticker
Injected score bar on web pages with Shadow DOM isolation.

### Step 8: AI Integration
Claude API calls for smart notifications and the Insights tab.

### Step 9: Real API Integration
Replace mock data with CricketData.org API. Keep mock as fallback for dev.

### Step 10: Polish & Icons
Extension icons, store description, final testing.

## Key Implementation Notes

- **CRXJS quirks**: Use `@crxjs/vite-plugin@beta` for Vite 5+ compatibility. Import manifest.json directly in vite.config.ts.
- **Content script styling**: MUST use Shadow DOM to prevent style leaks. Inject a container, attach shadow root, render React into it.
- **Service worker**: No DOM access. No `window`. Use `chrome.runtime` messaging to communicate with popup and content scripts.
- **Zustand in extension**: Create store in popup, persist to chrome.storage.local. Background worker reads/writes via chrome.storage directly (no Zustand there).
- **API key security**: Claude API key stored in chrome.storage.sync (encrypted by Chrome per-user). Never bundle in source.
- **Recharts in popup**: Keep charts simple — the popup is only 400px wide. WinProbBar can be a custom div with CSS gradient, save Recharts for the Manhattan chart.
- **Badge text**: `chrome.action.setBadgeText({ text: '145/7' })` — update on each poll. Set badge color to batting team's color.
