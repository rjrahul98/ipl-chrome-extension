# CricKit — AI Cricket Companion

An AI-powered Chrome extension that gives IPL fans a beautiful, non-intrusive way to follow live matches while working. Smart notifications, live scorecards, and match insights powered by Claude AI.

## Features

- **Live Scorecard** — Real-time score, batter/bowler stats, over-by-over timeline, and win probability bar
- **Smart Notifications** — Claude AI generates contextual insights, not just raw scores ("DK Finisher Mode Activated 🔥")
- **Meeting Mode** — Suppresses notifications while you're busy; delivers a catch-up summary when you return
- **Score Ticker** — Minimal always-visible bar injected on any webpage via Shadow DOM
- **Schedule** — Upcoming and recent IPL 2026 matches
- **Settings** — Follow your teams, configure notification preferences, manage your Claude API key

## Tech Stack

| Layer | Tech |
|-------|------|
| Build | Vite 5 + @crxjs/vite-plugin (Manifest V3) |
| UI | React 18 + TypeScript (strict) |
| Styling | Tailwind CSS 3 |
| State | Zustand |
| Charts | Recharts |
| AI | Claude Sonnet (Anthropic API) |
| Data | CricketData.org REST API |
| Storage | `chrome.storage.local` |

## Project Structure

```
src/
├── popup/
│   ├── App.tsx                 # Root with tab navigation
│   ├── pages/
│   │   ├── LiveMatch.tsx       # Live scorecard view
│   │   ├── Schedule.tsx        # Upcoming & recent matches
│   │   ├── Insights.tsx        # AI analysis feed
│   │   └── Settings.tsx        # User preferences
│   └── components/
│       ├── Scorecard.tsx       # Score display + match situation
│       ├── BatterCard.tsx      # Batter stats row
│       ├── BowlerCard.tsx      # Bowler stats row
│       ├── OverTimeline.tsx    # Dot-ball visualization
│       ├── WinProbBar.tsx      # Win probability gradient bar
│       ├── MatchCard.tsx       # Schedule match card
│       ├── TeamLogo.tsx        # Team badge component
│       └── TabNav.tsx          # Bottom tab navigation
├── background/
│   ├── index.ts                # Service worker entry
│   ├── matchPoller.ts          # Event detection logic
│   ├── aiEngine.ts             # Claude API integration
│   └── notifications.ts        # Chrome notification manager
├── content/
│   ├── ticker.tsx              # Injected score ticker (Shadow DOM)
│   └── ticker.css              # Ticker host styles
└── shared/
    ├── types.ts                # All TypeScript types
    ├── constants.ts            # IPL teams, API URLs
    ├── mockData.ts             # Dev mock data (RCB vs SRH)
    ├── store.ts                # Zustand store
    ├── storage.ts              # chrome.storage helpers
    ├── messaging.ts            # Background ↔ popup messaging
    └── api.ts                  # CricketData.org API client
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A Chromium-based browser

### Setup

```bash
# Clone and install
git clone https://github.com/rjrahul98/ipl-chrome-extension.git
cd ipl-chrome-extension
pnpm install

# Add API keys
cp .env.example .env
# Edit .env and fill in your keys
```

### Environment Variables

```env
VITE_CRICKET_API_KEY=your_cricketdata_api_key    # https://cricketdata.org
VITE_CLAUDE_API_KEY=your_anthropic_api_key       # https://console.anthropic.com
```

> The Claude API key can also be entered directly in the extension's Settings tab — it's stored in `chrome.storage.local` and never bundled into the build.

### Development

```bash
pnpm dev      # Start Vite dev server with CRXJS HMR
pnpm build    # Production build → dist/
pnpm lint     # ESLint + TypeScript check
```

### Loading the Extension

1. Run `pnpm build`
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the `dist/` folder

## How It Works

### Background Polling
The service worker polls live match data every 30 seconds (only during active matches to conserve the 100 req/day API limit). On each poll it:
1. Compares new state to previous state to detect events (wickets, boundaries, milestones)
2. If a significant event occurs, calls Claude Sonnet with match context
3. Shows a smart Chrome notification with the AI-generated insight
4. Updates the extension badge with the live score

### AI Notifications
Instead of "Wicket! SRH 145/7", Claude generates insights like:
> **"Klaasen's Last Stand ⚡"** — SRH need 42 off 15 with tail exposed. A required rate of 16.8 at Chinnaswamy has only been achieved twice in IPL history.

### Meeting Mode
When enabled, all notifications are silently queued. When you turn it off, the queued events are sent to Claude in one batch and you receive a single "while you were away" summary notification.

### Score Ticker
A 32px bar injected at the bottom of every webpage via a content script. Uses Shadow DOM to prevent style conflicts with the host page. Click it to open the popup; dismiss with ✕ (remembered per session).

## API Notes

- **CricketData.org free tier**: 100 requests/day — the poller only runs during live matches and caches aggressively
- **Mock data**: A realistic RCB vs SRH match is available in `src/shared/mockData.ts` for development without burning API quota

## Roadmap

- [x] Steps 1–8: Scaffold, types, mock data, popup UI, background worker, ticker, AI integration
- [ ] Step 9: Full CricketData.org API integration (replace mock data)
- [ ] Step 10: Proper extension icons, Chrome Web Store listing

## License

MIT
