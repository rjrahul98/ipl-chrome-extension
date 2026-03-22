import type { Match } from '../../shared/types'
import TeamLogo from './TeamLogo'

interface Props {
  match: Match
}

function formatOvers(overs: number): string {
  const full = Math.floor(overs)
  const balls = Math.round((overs - full) * 10)
  return `${full}.${balls}`
}

export default function Scorecard({ match }: Props) {
  const { teams, innings, status } = match
  const inn1 = innings[0]
  const inn2 = innings[1]

  const isLive = status === 'live'
  const activeInnings = isLive && inn2 ? inn2 : inn1

  return (
    <div className="px-4 py-3">
      {/* Teams row */}
      <div className="flex items-center justify-between mb-2">
        {/* Home team */}
        <div className="flex items-center gap-2 flex-1">
          <TeamLogo team={teams.home} size="md" />
          <div>
            <div className="text-xs text-gray-500 font-medium">{teams.home.short}</div>
            {inn1 && inn1.battingTeam === teams.home.short && (
              <div className="font-bold text-white text-lg leading-tight">
                {inn1.score}/{inn1.wickets}
                <span className="text-gray-500 text-xs ml-1 font-normal">({formatOvers(inn1.overs)})</span>
              </div>
            )}
            {inn2 && inn2.battingTeam === teams.home.short && (
              <div className={`font-bold text-lg leading-tight ${isLive ? 'text-white' : 'text-gray-300'}`}>
                {inn2.score}/{inn2.wickets}
                <span className="text-gray-500 text-xs ml-1 font-normal">({formatOvers(inn2.overs)})</span>
              </div>
            )}
          </div>
        </div>

        {/* VS / Live badge */}
        <div className="flex flex-col items-center gap-1 px-3">
          {isLive ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
              LIVE
            </span>
          ) : (
            <span className="text-gray-600 text-xs">vs</span>
          )}
          <span className="text-gray-600 text-[10px]">{match.venue.split(',')[0]}</span>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="text-right">
            <div className="text-xs text-gray-500 font-medium">{teams.away.short}</div>
            {inn1 && inn1.battingTeam === teams.away.short && (
              <div className="font-bold text-white text-lg leading-tight">
                {inn1.score}/{inn1.wickets}
                <span className="text-gray-500 text-xs ml-1 font-normal">({formatOvers(inn1.overs)})</span>
              </div>
            )}
            {inn2 && inn2.battingTeam === teams.away.short && (
              <div className={`font-bold text-lg leading-tight ${isLive ? 'text-white' : 'text-gray-300'}`}>
                {inn2.score}/{inn2.wickets}
                <span className="text-gray-500 text-xs ml-1 font-normal">({formatOvers(inn2.overs)})</span>
              </div>
            )}
          </div>
          <TeamLogo team={teams.away} size="md" />
        </div>
      </div>

      {/* Match situation */}
      {isLive && activeInnings?.target && (
        <div className="text-center space-y-0.5 mt-1">
          <p className="text-white text-sm font-semibold">
            {activeInnings.battingTeam} need{' '}
            <span className="text-orange-400">{activeInnings.target - activeInnings.score}</span>
            {' '}off{' '}
            <span className="text-orange-400">{Math.round((20 - activeInnings.overs) * 6)}</span>
            {' '}balls
          </p>
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span>CRR: <span className="text-gray-300">{activeInnings.runRate.toFixed(2)}</span></span>
            <span className="text-gray-700">·</span>
            <span>RRR: <span className={`${(activeInnings.requiredRate ?? 0) > 12 ? 'text-red-400' : 'text-yellow-300'}`}>
              {activeInnings.requiredRate?.toFixed(2)}
            </span></span>
          </div>
        </div>
      )}

      {/* Result */}
      {status === 'completed' && match.result && (
        <div className="text-center mt-1">
          <p className="text-green-400 text-sm font-semibold">{match.result}</p>
        </div>
      )}
    </div>
  )
}
