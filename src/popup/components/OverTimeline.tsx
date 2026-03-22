import type { BallOutcome } from '../../shared/types'

interface Props {
  recentOvers: BallOutcome[][]
}

function BallDot({ outcome }: { outcome: BallOutcome }) {
  if (outcome === 'W') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-[10px] font-bold">
        W
      </span>
    )
  }
  if (outcome === '6') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-black text-[10px] font-bold">
        6
      </span>
    )
  }
  if (outcome === '4') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-[10px] font-bold">
        4
      </span>
    )
  }
  if (outcome === 'dot') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-gray-500 text-[10px]">
        ·
      </span>
    )
  }
  if (outcome === 'wd' || outcome === 'nb') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-orange-500/50 text-orange-400 text-[9px]">
        {outcome}
      </span>
    )
  }
  // 1, 2, 3
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/15 text-gray-200 text-[10px]">
      {outcome}
    </span>
  )
}

function overRuns(over: BallOutcome[]): number {
  return over.reduce((sum, b) => {
    if (b === 'dot' || b === 'W' || b === 'lb' || b === 'b') return sum
    if (b === 'wd' || b === 'nb') return sum + 1
    return sum + parseInt(b, 10)
  }, 0)
}

export default function OverTimeline({ recentOvers }: Props) {
  if (!recentOvers.length) return null

  const overs = [...recentOvers].reverse()

  return (
    <div className="space-y-2">
      {overs.map((over, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 w-6 flex-shrink-0 text-right">
            O{recentOvers.length - i}
          </span>
          <div className="flex items-center gap-1 flex-1">
            {over.map((b, j) => (
              <BallDot key={j} outcome={b} />
            ))}
          </div>
          <span className="text-xs font-mono text-gray-400 w-6 text-right">
            {overRuns(over)}
          </span>
        </div>
      ))}
    </div>
  )
}
