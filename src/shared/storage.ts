import type { UserPreferences, MatchEvent } from './types'
import { DEFAULT_PREFERENCES } from './constants'

export async function getPreferences(): Promise<UserPreferences> {
  return new Promise(resolve => {
    chrome.storage.local.get('preferences', (res) => {
      resolve(res.preferences ?? DEFAULT_PREFERENCES)
    })
  })
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.local.set({ preferences: prefs }, resolve)
  })
}

export async function getQueuedEvents(): Promise<MatchEvent[]> {
  return new Promise(resolve => {
    chrome.storage.local.get('queuedEvents', (res) => {
      resolve(res.queuedEvents ?? [])
    })
  })
}

export async function enqueueEvent(event: MatchEvent): Promise<void> {
  const events = await getQueuedEvents()
  events.push(event)
  return new Promise(resolve => {
    chrome.storage.local.set({ queuedEvents: events.slice(-50) }, resolve)
  })
}

export async function clearQueuedEvents(): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.local.remove('queuedEvents', resolve)
  })
}
