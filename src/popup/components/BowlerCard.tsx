import type { BowlerState } from '../../shared/types'

interface Props {
  bowler: BowlerState
}

export default function BowlerCard({ bowler }: Props) {
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-white/5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs flex-shrink-0">⚾</span>
        <span className="text-sm text-gray-300 font-medium truncate">{bowler.name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 text-right text-xs font-mono">
        <span className="text-gray-400">
          {bowler.overs}-{bowler.maidens}-{bowler.runs}-
          <span className="text-red-400 font-bold">{bowler.wickets}</span>
        </span>
        <span className={`w-10 text-right ${bowler.economy <= 7 ? 'text-green-400' : bowler.economy <= 9 ? 'text-yellow-400' : 'text-red-400'}`}>
          {bowler.economy.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
