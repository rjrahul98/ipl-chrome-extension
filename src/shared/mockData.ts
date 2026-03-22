import type { Match, AiInsight } from './types'
import { IPL_TEAMS } from './constants'

export const MOCK_LIVE_MATCH: Match = {
  id: 'mock-rcb-srh-001',
  status: 'live',
  venue: 'M. Chinnaswamy Stadium, Bengaluru',
  date: '2026-03-28T14:00:00.000Z',
  teams: {
    home: IPL_TEAMS.RCB,
    away: IPL_TEAMS.SRH,
  },
  toss: { winner: 'RCB', decision: 'bat' },
  innings: [
    {
      battingTeam: 'RCB',
      score: 186,
      wickets: 4,
      overs: 20,
      runRate: 9.3,
      batters: [
        { name: 'V. Kohli', runs: 73, balls: 44, fours: 7, sixes: 3, strikeRate: 165.9, isOnStrike: false },
        { name: 'G. Maxwell', runs: 41, balls: 22, fours: 3, sixes: 3, strikeRate: 186.4, isOnStrike: true },
      ],
      bowler: {
        name: 'B. Kumar', overs: 4, maidens: 0, runs: 38, wickets: 2, economy: 9.5,
      },
      recentOvers: [
        ['dot', '1', '4', 'dot', '2', '6'],
        ['1', 'dot', 'W', '4', '1', 'dot'],
        ['4', '1', '1', '6', 'dot', '2'],
        ['dot', '6', '4', '1', 'wd', '1'],
      ],
      fow: [
        { player: 'F. du Plessis', score: '45/1', overs: 6.2 },
        { player: 'R. Garg', score: '98/2', overs: 12.4 },
        { player: 'V. Kohli', score: '156/3', overs: 18.1 },
        { player: 'G. Maxwell', score: '186/4', overs: 20 },
      ],
    },
    {
      battingTeam: 'SRH',
      score: 145,
      wickets: 7,
      overs: 17.3,
      runRate: 8.29,
      requiredRate: 16.8,
      target: 187,
      batters: [
        { name: 'H. Klaasen', runs: 34, balls: 18, fours: 3, sixes: 2, strikeRate: 188.9, isOnStrike: true },
        { name: 'B. Kumar', runs: 2, balls: 4, fours: 0, sixes: 0, strikeRate: 50.0, isOnStrike: false },
      ],
      bowler: {
        name: 'Y. Dayal', overs: 3.3, maidens: 0, runs: 28, wickets: 2, economy: 8.0,
      },
      recentOvers: [
        ['dot', '1', '4', 'dot', 'W', '1'],
        ['6', 'dot', '1', '4', '1', '2'],
        ['dot', 'W', '4', '1', 'dot', '6'],
      ],
      fow: [
        { player: 'T. Head', score: '32/1', overs: 3.4 },
        { player: 'A. Sharma', score: '58/2', overs: 7.1 },
        { player: 'N. Pooran', score: '89/3', overs: 11.3 },
        { player: 'A. Markram', score: '104/4', overs: 13.2 },
        { player: 'S. Yadav', score: '118/5', overs: 15.0 },
        { player: 'A. Badoni', score: '131/6', overs: 16.4 },
        { player: 'P. Sharma', score: '140/7', overs: 17.1 },
      ],
    },
  ],
}

export const MOCK_UPCOMING_MATCHES: Match[] = [
  {
    id: 'mock-mi-csk-002',
    status: 'scheduled',
    venue: 'Wankhede Stadium, Mumbai',
    date: '2026-03-30T14:00:00.000Z',
    teams: { home: IPL_TEAMS.MI, away: IPL_TEAMS.CSK },
    innings: [],
  },
  {
    id: 'mock-kkr-dc-003',
    status: 'scheduled',
    venue: 'Eden Gardens, Kolkata',
    date: '2026-03-31T14:00:00.000Z',
    teams: { home: IPL_TEAMS.KKR, away: IPL_TEAMS.DC },
    innings: [],
  },
  {
    id: 'mock-rr-pbks-004',
    status: 'scheduled',
    venue: 'Sawai Mansingh Stadium, Jaipur',
    date: '2026-04-01T14:00:00.000Z',
    teams: { home: IPL_TEAMS.RR, away: IPL_TEAMS.PBKS },
    innings: [],
  },
  {
    id: 'mock-gt-lsg-005',
    status: 'scheduled',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    date: '2026-04-02T14:00:00.000Z',
    teams: { home: IPL_TEAMS.GT, away: IPL_TEAMS.LSG },
    innings: [],
  },
]

export const MOCK_RECENT_MATCHES: Match[] = [
  {
    id: 'mock-mi-kkr-001',
    status: 'completed',
    venue: 'Wankhede Stadium, Mumbai',
    date: '2026-03-22T14:00:00.000Z',
    teams: { home: IPL_TEAMS.MI, away: IPL_TEAMS.KKR },
    result: 'MI won by 5 wickets',
    innings: [
      {
        battingTeam: 'KKR', score: 172, wickets: 7, overs: 20, runRate: 8.6,
        batters: [], bowler: undefined, recentOvers: [], fow: [],
      },
      {
        battingTeam: 'MI', score: 173, wickets: 5, overs: 19.2, runRate: 8.96,
        batters: [], bowler: undefined, recentOvers: [], fow: [],
      },
    ],
  },
  {
    id: 'mock-csk-srh-002',
    status: 'completed',
    venue: 'MA Chidambaram Stadium, Chennai',
    date: '2026-03-21T14:00:00.000Z',
    teams: { home: IPL_TEAMS.CSK, away: IPL_TEAMS.SRH },
    result: 'SRH won by 18 runs',
    innings: [
      {
        battingTeam: 'SRH', score: 201, wickets: 4, overs: 20, runRate: 10.05,
        batters: [], bowler: undefined, recentOvers: [], fow: [],
      },
      {
        battingTeam: 'CSK', score: 183, wickets: 9, overs: 20, runRate: 9.15,
        batters: [], bowler: undefined, recentOvers: [], fow: [],
      },
    ],
  },
]

export const MOCK_INSIGHTS: AiInsight[] = [
  {
    title: 'DK Finisher Mode Activated 🔥',
    body: '42 off 15 at Chinnaswamy — that\'s DK\'s playground. RCB\'s win probability sitting at 68%. Bhuvi\'s death economy this season: 11.2',
    emoji: '🔥',
    significance: 'high',
    generatedAt: Date.now() - 120_000,
  },
  {
    title: 'Klaasen Last Stand',
    body: 'SRH need a miracle — 42 off 15 with tail exposed. Required rate of 16.8 at this venue has only been chased twice in IPL history.',
    emoji: '⚡',
    significance: 'high',
    generatedAt: Date.now() - 240_000,
  },
  {
    title: 'Kohli 73: Back in Form',
    body: 'Kohli\'s 73(44) is his highest score this season. His average at Chinnaswamy in IPL: 51.4. RCB fans, breathe easy.',
    emoji: '👑',
    significance: 'medium',
    generatedAt: Date.now() - 900_000,
  },
]

/** Win probability — simple mock calc, returned as [batting, fielding] */
export function getMockWinProbability(match: Match): [number, number] {
  const inn = match.innings[1]
  if (!inn || !inn.target) return [50, 50]
  const needed = inn.target - inn.score
  const ballsLeft = (20 - inn.overs) * 6
  const wicketsLeft = 10 - inn.wickets
  if (ballsLeft <= 0 || needed <= 0) return needed <= 0 ? [5, 95] : [95, 5]
  const rrr = (needed / ballsLeft) * 6
  const base = Math.max(5, Math.min(95, 50 + (rrr - 8.5) * 4 - wicketsLeft * 2))
  return [Math.round(100 - base), Math.round(base)]
}
