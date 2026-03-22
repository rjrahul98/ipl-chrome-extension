import type { Match } from '../../shared/types'
import TeamLogo from './TeamLogo'

interface Props {
  match: Match
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function MatchCard({ match }: Props) {
  const isLive = match.status === 'live'
  const isCompleted = match.status === 'completed'

  return (
    <div className={`glass-card p-3 mx-3 mb-2 transition-all ${isLive ? 'border border-red-500/20 animate-pulse-glow' : ''}`}>
      {/* Date / Status row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-gray-600">{formatDate(match.date)} · {formatTime(match.date)}</span>
        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
            LIVE
          </span>
        )}
        {isCompleted && match.result && (
          <span className="text-[10px] text-green-400">{match.result}</span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TeamLogo team={match.teams.home} size="sm" />
          <div>
            <p className="text-sm font-semibold text-white">{match.teams.home.short}</p>
            {match.innings[0]?.battingTeam === match.teams.home.short && (
              <p className="text-xs text-gray-400">
                {match.innings[0].score}/{match.innings[0].wickets} ({match.innings[0].overs})
              </p>
            )}
            {match.innings[1]?.battingTeam === match.teams.home.short && (
              <p className="text-xs text-gray-400">
                {match.innings[1].score}/{match.innings[1].wickets} ({match.innings[1].overs})
              </p>
            )}
          </div>
        </div>

        <span className="text-gray-700 text-xs font-bold">vs</span>

        <div className="flex items-center gap-2 flex-row-reverse">
          <TeamLogo team={match.teams.away} size="sm" />
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{match.teams.away.short}</p>
            {match.innings[0]?.battingTeam === match.teams.away.short && (
              <p className="text-xs text-gray-400">
                {match.innings[0].score}/{match.innings[0].wickets} ({match.innings[0].overs})
              </p>
            )}
            {match.innings[1]?.battingTeam === match.teams.away.short && (
              <p className="text-xs text-gray-400">
                {match.innings[1].score}/{match.innings[1].wickets} ({match.innings[1].overs})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Venue */}
      <p className="text-[10px] text-gray-600 mt-2 truncate">{match.venue}</p>
    </div>
  )
}
