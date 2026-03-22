import type { Match } from '../../shared/types'
import { getMockWinProbability } from '../../shared/mockData'

interface Props {
  match: Match
}

export default function WinProbBar({ match }: Props) {
  const [homeProb, awayProb] = getMockWinProbability(match)
  const homeTeam = match.teams.home
  const awayTeam = match.teams.away

  // Determine which team is batting in 2nd innings
  const inn2 = match.innings[1]
  const battingTeamShort = inn2?.battingTeam
  const battingTeam = battingTeamShort === homeTeam.short ? homeTeam : awayTeam
  const fieldingTeam = battingTeamShort === homeTeam.short ? awayTeam : homeTeam

  const batProb = homeProb
  const fieldProb = awayProb

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-semibold" style={{ color: battingTeam.color }}>
          {battingTeam.short}
        </span>
        <span className="text-gray-500 text-[10px]">Win Probability</span>
        <span className="font-semibold" style={{ color: fieldingTeam.color }}>
          {fieldingTeam.short}
        </span>
      </div>

      {/* Gradient bar */}
      <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${batProb}%`,
            background: `linear-gradient(to right, ${battingTeam.color}cc, ${battingTeam.color}66)`,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 rounded-full transition-all duration-700"
          style={{
            width: `${fieldProb}%`,
            background: `linear-gradient(to left, ${fieldingTeam.color}cc, ${fieldingTeam.color}66)`,
          }}
        />
        {/* Center divider */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
      </div>

      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-sm" style={{ color: battingTeam.color }}>
          {batProb}%
        </span>
        <span className="font-bold text-sm" style={{ color: fieldingTeam.color }}>
          {fieldProb}%
        </span>
      </div>
    </div>
  )
}
