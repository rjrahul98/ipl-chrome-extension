import { useAppStore } from '../shared/store'
import TabNav from './components/TabNav'
import LiveMatch from './pages/LiveMatch'
import Schedule from './pages/Schedule'
import Insights from './pages/Insights'
import Settings from './pages/Settings'

export default function App() {
  const {
    activeTab,
    currentMatch,
    upcomingMatches,
    recentMatches,
    insights,
    preferences,
    isLoading,
    setTab,
    setPreferences,
  } = useAppStore()

  const hasLive = currentMatch?.status === 'live'

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏏</span>
          <span className="font-bold text-white tracking-tight text-base">CricKit</span>
          {preferences.meetingMode && (
            <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full font-medium">
              Meeting Mode
            </span>
          )}
        </div>
        {currentMatch && (
          <div className="text-[10px] text-gray-600">
            {hasLive ? (
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
                Live
              </span>
            ) : (
              'No live match'
            )}
          </div>
        )}
      </header>

      {/* Page content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'live' && (
          <LiveMatch match={currentMatch} isLoading={isLoading} />
        )}
        {activeTab === 'schedule' && (
          <Schedule upcomingMatches={upcomingMatches} recentMatches={recentMatches} />
        )}
        {activeTab === 'insights' && (
          <Insights insights={insights} />
        )}
        {activeTab === 'settings' && (
          <Settings preferences={preferences} onChange={setPreferences} />
        )}
      </div>

      {/* Tab nav */}
      <TabNav active={activeTab} onChange={setTab} hasLive={hasLive} />
    </div>
  )
}
