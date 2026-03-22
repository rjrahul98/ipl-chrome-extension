import type { Match } from '../../shared/types'
import Scorecard from '../components/Scorecard'
import BatterCard from '../components/BatterCard'
import BowlerCard from '../components/BowlerCard'
import OverTimeline from '../components/OverTimeline'
import WinProbBar from '../components/WinProbBar'

interface Props {
  match: Match | null
  isLoading: boolean
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card mx-3 mb-2 p-3">
      <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">{title}</p>
      {children}
    </div>
  )
}

export default function LiveMatch({ match, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-pulse">🏏</div>
          <p className="text-gray-500 text-sm">Loading match data…</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3 px-6">
          <div className="text-4xl">📅</div>
          <p className="text-gray-300 font-semibold">No live match right now</p>
          <p className="text-gray-600 text-sm">Check the Schedule tab for upcoming IPL 2026 matches.</p>
        </div>
      </div>
    )
  }

  const activeInnings = match.innings[1] ?? match.innings[0]

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Scorecard header */}
      <div className="glass-card mx-3 mt-3 mb-2">
        <Scorecard match={match} />
      </div>

      {/* Batters */}
      {activeInnings?.batters.length > 0 && (
        <Section title="At the Crease">
          <div className="space-y-0.5">
            <div className="flex text-[9px] text-gray-700 px-2 mb-1 gap-2 justify-end">
              <span className="w-16 text-right">R (B)</span>
              <span className="w-12 text-right">4s · 6s</span>
              <span className="w-12 text-right">SR</span>
            </div>
            {activeInnings.batters.map(b => (
              <BatterCard key={b.name} batter={b} />
            ))}
          </div>
        </Section>
      )}

      {/* Bowler */}
      {activeInnings?.bowler && (
        <Section title="Current Bowler">
          <BowlerCard bowler={activeInnings.bowler} />
        </Section>
      )}

      {/* Recent overs */}
      {activeInnings?.recentOvers.length > 0 && (
        <Section title="Recent Overs">
          <OverTimeline recentOvers={activeInnings.recentOvers} />
        </Section>
      )}

      {/* Win probability */}
      {match.innings.length >= 2 && (
        <Section title="Win Probability">
          <WinProbBar match={match} />
        </Section>
      )}

      <div className="h-2" />
    </div>
  )
}
