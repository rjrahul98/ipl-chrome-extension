import type { BackgroundMessage } from './types'

export function sendToBackground(message: BackgroundMessage): void {
  chrome.runtime.sendMessage(message).catch(() => {
    // Background may not be listening
  })
}

export function onBackgroundMessage(
  handler: (msg: BackgroundMessage) => void
): () => void {
  const listener = (msg: unknown) => {
    if (msg && typeof msg === 'object' && 'type' in msg) {
      handler(msg as BackgroundMessage)
    }
  }
  chrome.runtime.onMessage.addListener(listener)
  return () => chrome.runtime.onMessage.removeListener(listener)
}
