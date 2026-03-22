import { useState } from 'react'
import type { UserPreferences } from '../../shared/types'
import { IPL_TEAMS } from '../../shared/constants'

interface Props {
  preferences: UserPreferences
  onChange: (prefs: UserPreferences) => void
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-all ${checked ? 'bg-orange-500' : 'bg-white/10'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`}
        />
      </button>
    </div>
  )
}

export default function Settings({ preferences, onChange }: Props) {
  const [apiKey, setApiKey] = useState(preferences.claudeApiKey ?? '')
  const [showKey, setShowKey] = useState(false)

  function toggleTeam(short: string) {
    const followed = preferences.followedTeams.includes(short)
      ? preferences.followedTeams.filter(t => t !== short)
      : [...preferences.followedTeams, short]
    onChange({ ...preferences, followedTeams: followed })
  }

  return (
    <div className="flex-1 overflow-y-auto py-3 space-y-2">

      {/* Followed Teams */}
      <div className="glass-card mx-3 p-3">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">My Teams</p>
        <div className="grid grid-cols-5 gap-2">
          {Object.values(IPL_TEAMS).map(team => {
            const followed = preferences.followedTeams.includes(team.short)
            return (
              <button
                key={team.short}
                onClick={() => toggleTeam(team.short)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all border ${
                  followed ? 'border-white/20 bg-white/10' : 'border-white/5 bg-white/3 opacity-50'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                  style={{ background: team.color }}
                >
                  {team.short.slice(0, 2)}
                </div>
                <span className="text-[9px] text-gray-400">{team.short}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card mx-3 p-3">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Notifications</p>
        <Toggle
          checked={preferences.notificationsEnabled}
          onChange={v => onChange({ ...preferences, notificationsEnabled: v })}
          label="Enable notifications"
        />
        {preferences.notificationsEnabled && (
          <div className="pl-3 border-l border-white/5 space-y-0 ml-1">
            <Toggle
              checked={preferences.notifyOn.wickets}
              onChange={v => onChange({ ...preferences, notifyOn: { ...preferences.notifyOn, wickets: v } })}
              label="Wickets"
            />
            <Toggle
              checked={preferences.notifyOn.boundaries}
              onChange={v => onChange({ ...preferences, notifyOn: { ...preferences.notifyOn, boundaries: v } })}
              label="Boundaries"
            />
            <Toggle
              checked={preferences.notifyOn.milestones}
              onChange={v => onChange({ ...preferences, notifyOn: { ...preferences.notifyOn, milestones: v } })}
              label="Milestones (50s, 100s)"
            />
            <Toggle
              checked={preferences.notifyOn.closeFinishes}
              onChange={v => onChange({ ...preferences, notifyOn: { ...preferences.notifyOn, closeFinishes: v } })}
              label="Close finishes"
            />
          </div>
        )}
      </div>

      {/* Meeting Mode */}
      <div className="glass-card mx-3 p-3">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Focus</p>
        <Toggle
          checked={preferences.meetingMode}
          onChange={v => onChange({ ...preferences, meetingMode: v })}
          label="Meeting mode"
        />
        {preferences.meetingMode && (
          <p className="text-[10px] text-gray-600 mt-1 pl-2">
            Notifications paused. You'll get a catch-up summary when you return.
          </p>
        )}
        <Toggle
          checked={preferences.tickerEnabled}
          onChange={v => onChange({ ...preferences, tickerEnabled: v })}
          label="Score ticker on pages"
        />
      </div>

      {/* Claude API Key */}
      <div className="glass-card mx-3 p-3">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-2">Claude AI Key</p>
        <p className="text-[11px] text-gray-600 mb-2">
          Required for AI-powered insights and smart notifications.
        </p>
        <div className="flex gap-2">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            onBlur={() => onChange({ ...preferences, claudeApiKey: apiKey })}
            placeholder="sk-ant-..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-700 outline-none focus:border-orange-500/50"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-gray-600 text-xs px-2 hover:text-gray-400"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="h-2" />
    </div>
  )
}
