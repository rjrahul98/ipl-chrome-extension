import type { AiInsight } from '../../shared/types'

interface Props {
  insights: AiInsight[]
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

const significanceBorder: Record<AiInsight['significance'], string> = {
  low: 'border-white/5',
  medium: 'border-blue-500/20',
  high: 'border-orange-500/30',
  critical: 'border-red-500/40',
}

export default function Insights({ insights }: Props) {
  if (!insights.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3 px-6">
          <div className="text-4xl">🤖</div>
          <p className="text-gray-300 font-semibold">AI Insights</p>
          <p className="text-gray-600 text-sm">
            Smart notifications and match analysis will appear here during live matches.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-3">
      <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 mb-2">
        Live Insights
      </p>

      {insights.map((insight, i) => (
        <div
          key={i}
          className={`glass-card mx-3 mb-2 p-3 border ${significanceBorder[insight.significance]}`}
        >
          <div className="flex items-start gap-2">
            <span className="text-xl mt-0.5 flex-shrink-0">{insight.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-tight mb-1">{insight.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{insight.body}</p>
              <p className="text-[10px] text-gray-700 mt-1.5">{timeAgo(insight.generatedAt)}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="h-2" />
    </div>
  )
}
