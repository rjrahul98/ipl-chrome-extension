import type { Match, MatchEvent, AiInsight } from '../shared/types'

const CLAUDE_API = 'https://api.anthropic.com/v1/messages'

const SYSTEM_PROMPT = `You are a witty, knowledgeable IPL cricket analyst. Given match state and recent events, generate a brief notification. Be insightful, not just descriptive. Add context (venue records, player form, match situation). Keep title under 60 chars, body under 150 chars. Respond ONLY with valid JSON — no markdown, no explanation. Format: {"title":"...","body":"...","emoji":"...","significance":"low"|"medium"|"high"|"critical"}`

interface EventContext {
  match: { teams: string; venue: string; phase: string }
  state: { score: string; overs: number; required?: string }
  event: { type: string; description: string }
}

export async function generateInsight(
  apiKey: string,
  matchData: Match,
  event: MatchEvent
): Promise<AiInsight | null> {
  try {
    const inn = matchData.innings[1] ?? matchData.innings[0]
    const phase = inn.overs <= 6 ? 'powerplay' : inn.overs <= 15 ? 'middle' : 'death'

    const context: EventContext = {
      match: {
        teams: `${matchData.teams.home.short} vs ${matchData.teams.away.short}`,
        venue: matchData.venue,
        phase,
      },
      state: {
        score: `${inn.score}/${inn.wickets}`,
        overs: inn.overs,
        required: inn.target
          ? `${inn.target - inn.score} off ${Math.round((20 - inn.overs) * 6)} balls`
          : undefined,
      },
      event: {
        type: event.type,
        description: event.description,
      },
    }

    const res = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: JSON.stringify(context) }],
      }),
    })

    if (!res.ok) return null

    const data = await res.json() as { content: Array<{ type: string; text: string }> }
    const text = data.content.find(c => c.type === 'text')?.text ?? ''
    const parsed = JSON.parse(text) as Omit<AiInsight, 'generatedAt'>

    return { ...parsed, generatedAt: Date.now() }
  } catch {
    return null
  }
}

export async function generateMeetingSummary(
  apiKey: string,
  match: Match,
  events: MatchEvent[]
): Promise<AiInsight | null> {
  try {
    const prompt = {
      task: 'meeting_summary',
      match: `${match.teams.home.short} vs ${match.teams.away.short}`,
      events: events.map(e => e.description),
      currentScore: match.innings.map(i => `${i.battingTeam}: ${i.score}/${i.wickets} (${i.overs})`).join(', '),
    }

    const res = await fetch(CLAUDE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: `You are an IPL cricket analyst. Summarize what happened while the user was away in a meeting. Be concise and exciting. Include key moments, wickets, boundaries, and current match state. Keep under 200 chars. Respond ONLY with valid JSON: {"title":"...","body":"...","emoji":"...","significance":"high"}`,
        messages: [{ role: 'user', content: JSON.stringify(prompt) }],
      }),
    })

    if (!res.ok) return null
    const data = await res.json() as { content: Array<{ type: string; text: string }> }
    const text = data.content.find(c => c.type === 'text')?.text ?? ''
    const parsed = JSON.parse(text) as Omit<AiInsight, 'generatedAt'>
    return { ...parsed, generatedAt: Date.now() }
  } catch {
    return null
  }
}
