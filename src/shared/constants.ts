import type { Team } from './types'

export const IPL_TEAMS: Record<string, Team> = {
  RCB:  { id: 'rcb',  name: 'Royal Challengers Bengaluru', short: 'RCB',  color: '#E42A2A' },
  SRH:  { id: 'srh',  name: 'Sunrisers Hyderabad',         short: 'SRH',  color: '#FF822A' },
  MI:   { id: 'mi',   name: 'Mumbai Indians',               short: 'MI',   color: '#004BA0' },
  KKR:  { id: 'kkr',  name: 'Kolkata Knight Riders',        short: 'KKR',  color: '#3A225D' },
  CSK:  { id: 'csk',  name: 'Chennai Super Kings',          short: 'CSK',  color: '#FFCB05' },
  DC:   { id: 'dc',   name: 'Delhi Capitals',               short: 'DC',   color: '#17479E' },
  RR:   { id: 'rr',   name: 'Rajasthan Royals',             short: 'RR',   color: '#E73895' },
  PBKS: { id: 'pbks', name: 'Punjab Kings',                 short: 'PBKS', color: '#ED1B24' },
  GT:   { id: 'gt',   name: 'Gujarat Titans',               short: 'GT',   color: '#1C1C2B' },
  LSG:  { id: 'lsg',  name: 'Lucknow Super Giants',         short: 'LSG',  color: '#A72056' },
}

export const API_BASE = 'https://api.cricapi.com/v1'

export const DEFAULT_PREFERENCES = {
  followedTeams: ['RCB', 'MI'],
  notificationsEnabled: true,
  notifyOn: {
    wickets: true,
    boundaries: false,
    milestones: true,
    closeFinishes: true,
  },
  meetingMode: false,
  tickerEnabled: true,
  tickerPosition: 'bottom' as const,
  theme: 'dark' as const,
}

export const POLL_INTERVAL_MS = 30_000
export const MAX_EVENTS_QUEUED = 50
