import type { AppTab } from '../../shared/types'

interface Props {
  active: AppTab
  onChange: (tab: AppTab) => void
  hasLive?: boolean
}

const TABS: { id: AppTab; label: string; icon: string }[] = [
  { id: 'live',     label: 'Live',     icon: '🏏' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'insights', label: 'AI',       icon: '🤖' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function TabNav({ active, onChange, hasLive }: Props) {
  return (
    <nav className="flex items-stretch border-t border-white/5 bg-surface-card/80 backdrop-blur-sm flex-shrink-0">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-all relative
            ${active === tab.id
              ? 'text-white'
              : 'text-gray-600 hover:text-gray-400'
            }`}
        >
          {/* Active indicator */}
          {active === tab.id && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-orange-500" />
          )}
          <span className="text-base leading-none">
            {tab.icon}
            {tab.id === 'live' && hasLive && (
              <span className="absolute top-2 right-[calc(50%-10px)] w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            )}
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
