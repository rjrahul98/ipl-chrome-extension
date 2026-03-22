import type { BatterState } from '../../shared/types'

interface Props {
  batter: BatterState
}

export default function BatterCard({ batter }: Props) {
  return (
    <div className={`flex items-center justify-between py-1 px-2 rounded-lg transition-all ${batter.isOnStrike ? 'bg-white/5' : ''}`}>
      <div className="flex items-center gap-2 min-w-0">
        {batter.isOnStrike && (
          <span className="text-yellow-400 text-xs flex-shrink-0">🏏</span>
        )}
        <span className={`text-sm truncate ${batter.isOnStrike ? 'text-white font-semibold' : 'text-gray-400'}`}>
          {batter.name}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 text-right">
        <div>
          <span className={`text-sm font-bold ${batter.isOnStrike ? 'text-white' : 'text-gray-300'}`}>
            {batter.runs}
          </span>
          <span className="text-gray-500 text-xs ml-0.5">({batter.balls})</span>
        </div>
        <div className="text-xs text-gray-500 w-16 text-right">
          <span className="text-green-400">{batter.fours}×4</span>
          <span className="mx-1 text-gray-600">·</span>
          <span className="text-yellow-400">{batter.sixes}×6</span>
        </div>
        <div className="text-xs font-mono w-12 text-right">
          <span className={`${batter.strikeRate >= 150 ? 'text-orange-400' : batter.strikeRate >= 120 ? 'text-yellow-400' : 'text-gray-400'}`}>
            {batter.strikeRate.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
