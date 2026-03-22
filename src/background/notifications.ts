import type { AiInsight } from '../shared/types'

export function showInsightNotification(insight: AiInsight): void {
  chrome.notifications.create(`crickit-${Date.now()}`, {
    type: 'basic',
    iconUrl: 'src/assets/icons/icon48.png',
    title: `${insight.emoji} ${insight.title}`,
    message: insight.body,
    priority: insight.significance === 'critical' ? 2 : insight.significance === 'high' ? 1 : 0,
  })
}

export function updateBadge(score: string, color: string): void {
  chrome.action.setBadgeText({ text: score })
  chrome.action.setBadgeBackgroundColor({ color })
}

export function clearBadge(): void {
  chrome.action.setBadgeText({ text: '' })
}
