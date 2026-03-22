import { API_BASE } from './constants'
import type { Match } from './types'

const API_KEY = import.meta.env.VITE_CRICKET_API_KEY as string

async function fetchApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`)
  url.searchParams.set('apikey', API_KEY)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const json = await res.json() as { status: string; data: T }
  if (json.status !== 'success') throw new Error('API returned non-success status')
  return json.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchCurrentMatches(): Promise<any[]> {
  return fetchApi('/currentMatches', { offset: '0' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchMatchScorecard(matchId: string): Promise<any> {
  return fetchApi('/match_scorecard', { id: matchId })
}

/** Stub: transforms raw API response to our Match type */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeMatch(_raw: any): Match | null {
  // TODO: implement full normalization in Step 9
  return null
}
