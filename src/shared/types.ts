export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'abandoned'
export type InningsPhase = 'powerplay' | 'middle' | 'death'
export type BallOutcome = 'dot' | '1' | '2' | '3' | '4' | '6' | 'W' | 'wd' | 'nb' | 'lb' | 'b'

export interface Team {
  id: string
  name: string
  short: string
  color: string
  logo?: string
}

export interface Match {
  id: string
  status: MatchStatus
  venue: string
  date: string
  teams: { home: Team; away: Team }
  toss?: { winner: string; decision: 'bat' | 'bowl' }
  innings: Innings[]
  result?: string
}

export interface Innings {
  battingTeam: string
  score: number
  wickets: number
  overs: number
  runRate: number
  requiredRate?: number
  target?: number
  batters: BatterState[]
  bowler?: BowlerState
  recentOvers: BallOutcome[][]
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
  followedTeams: string[]
  notificationsEnabled: boolean
  notifyOn: {
    wickets: boolean
    boundaries: boolean
    milestones: boolean
    closeFinishes: boolean
  }
  meetingMode: boolean
  tickerEnabled: boolean
  tickerPosition: 'top' | 'bottom'
  theme: 'light' | 'dark' | 'system'
  claudeApiKey?: string
}

export type AppTab = 'live' | 'schedule' | 'insights' | 'settings'

export interface AppState {
  activeTab: AppTab
  currentMatch: Match | null
  upcomingMatches: Match[]
  recentMatches: Match[]
  insights: AiInsight[]
  preferences: UserPreferences
  isLoading: boolean
  lastUpdated: number | null
}

export interface BackgroundMessage {
  type: 'MATCH_UPDATE' | 'NEW_INSIGHT' | 'MEETING_SUMMARY'
  payload: Match | AiInsight | string
}
