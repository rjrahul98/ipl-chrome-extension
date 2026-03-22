import type { Match, MatchEvent } from '../shared/types'
import { getPreferences, enqueueEvent } from '../shared/storage'
import { generateInsight } from './aiEngine'
import { showInsightNotification, updateBadge } from './notifications'

let previousMatch: Match | null = null

function detectEvents(prev: Match | null, curr: Match): MatchEvent[] {
  const events: MatchEvent[] = []
  if (!prev) return events

  const prevInn = prev.innings[1] ?? prev.innings[0]
  const currInn = curr.innings[1] ?? curr.innings[0]
  if (!prevInn || !currInn) return events

  // Wicket
  if (currInn.wickets > prevInn.wickets) {
    events.push({
      type: 'wicket',
      significance: currInn.wickets >= 7 ? 'high' : 'medium',
      description: `Wicket! ${currInn.battingTeam} ${currInn.score}/${currInn.wickets} (${currInn.overs})`,
      timestamp: Date.now(),
    })
  }

  // Boundary
  const runDiff = currInn.score - prevInn.score
  if (runDiff === 4) {
    events.push({ type: 'boundary', significance: 'low', description: 'Four!', timestamp: Date.now() })
  }
  if (runDiff === 6) {
    events.push({ type: 'six', significance: 'medium', description: 'Six!', timestamp: Date.now() })
  }

  // Win probability shift (approximated via RRR change)
  const rrrNow = currInn.requiredRate ?? 0
  const rrrPrev = prevInn.requiredRate ?? 0
  if (Math.abs(rrrNow - rrrPrev) >= 3) {
    events.push({
      type: 'over_complete',
      significance: rrrNow > 14 ? 'critical' : 'medium',
      description: `RRR shifted to ${rrrNow.toFixed(1)}`,
      timestamp: Date.now(),
    })
  }

  return events
}

export async function processPoll(currentMatch: Match): Promise<void> {
  const prefs = await getPreferences()

  // Update badge
  const inn = currentMatch.innings[1] ?? currentMatch.innings[0]
  if (inn) {
    const teamColor = inn.battingTeam === currentMatch.teams.home.short
      ? currentMatch.teams.home.color
      : currentMatch.teams.away.color
    updateBadge(`${inn.score}/${inn.wickets}`, teamColor)
  }

  const events = detectEvents(previousMatch, currentMatch)
  previousMatch = currentMatch

  for (const event of events) {
    const shouldNotify =
      (event.type === 'wicket' && prefs.notifyOn.wickets) ||
      (event.type === 'boundary' && prefs.notifyOn.boundaries) ||
      (event.type === 'six' && prefs.notifyOn.boundaries) ||
      (event.type === 'over_complete' && prefs.notifyOn.closeFinishes)

    if (prefs.meetingMode) {
      await enqueueEvent(event)
      continue
    }

    if (!prefs.notificationsEnabled || !shouldNotify) continue
    if (!prefs.claudeApiKey) continue

    const insight = await generateInsight(prefs.claudeApiKey, currentMatch, event)
    if (insight) showInsightNotification(insight)
  }
}
