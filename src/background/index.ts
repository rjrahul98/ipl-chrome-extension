import { POLL_INTERVAL_MS } from '../shared/constants'

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('matchPoll', {
    periodInMinutes: POLL_INTERVAL_MS / 60_000,
  })
  console.log('[CricKit] Service worker installed, polling alarm set.')
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'matchPoll') {
    pollMatch()
  }
})

async function pollMatch() {
  // TODO: replace with real API call in Step 9
  console.log('[CricKit] Polling match data...')
  // Broadcast to popup if open
  chrome.runtime.sendMessage({ type: 'MATCH_UPDATE', payload: null }).catch(() => {
    // Popup may be closed — ignore
  })
}
