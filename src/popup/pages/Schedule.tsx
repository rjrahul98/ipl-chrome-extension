import type { Match } from '../../shared/types'
import MatchCard from '../components/MatchCard'

interface Props {
  upcomingMatches: Match[]
  recentMatches: Match[]
}

export default function Schedule({ upcomingMatches, recentMatches }: Props) {
  return (
    <div className="flex-1 overflow-y-auto py-3">
      {upcomingMatches.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 mb-2">
            Upcoming
          </p>
          {upcomingMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}

      {recentMatches.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 mb-2">
            Recent Results
          </p>
          {recentMatches.map(m => <MatchCard key={m.id} match={m} />)}
        </div>
      )}

      <div className="h-2" />
    </div>
  )
}
