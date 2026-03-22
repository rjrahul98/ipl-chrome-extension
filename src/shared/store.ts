import { create } from 'zustand'
import type { AppState, AppTab, Match, AiInsight, UserPreferences } from './types'
import { DEFAULT_PREFERENCES } from './constants'
import {
  MOCK_LIVE_MATCH,
  MOCK_UPCOMING_MATCHES,
  MOCK_RECENT_MATCHES,
  MOCK_INSIGHTS,
} from './mockData'

interface AppStore extends AppState {
  setTab: (tab: AppTab) => void
  setCurrentMatch: (match: Match | null) => void
  setPreferences: (prefs: UserPreferences) => void
  addInsight: (insight: AiInsight) => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'live',
  currentMatch: MOCK_LIVE_MATCH,
  upcomingMatches: MOCK_UPCOMING_MATCHES,
  recentMatches: MOCK_RECENT_MATCHES,
  insights: MOCK_INSIGHTS,
  preferences: DEFAULT_PREFERENCES,
  isLoading: false,
  lastUpdated: Date.now(),

  setTab: (tab) => set({ activeTab: tab }),
  setCurrentMatch: (match) => set({ currentMatch: match }),
  setPreferences: (prefs) => set({ preferences: prefs }),
  addInsight: (insight) =>
    set(state => ({ insights: [insight, ...state.insights].slice(0, 20) })),
}))
