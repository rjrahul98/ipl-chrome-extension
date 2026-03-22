// Content script — injected on all pages
// Uses Shadow DOM to isolate styles from host page

const STORAGE_KEY = 'crickit_ticker_dismissed'

function createTicker() {
  // Check session dismiss
  if (sessionStorage.getItem(STORAGE_KEY)) return

  const host = document.createElement('div')
  host.id = 'crickit-ticker-host'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  style.textContent = `
    :host { all: initial; }
    .ticker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      background: rgba(10, 10, 15, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #F0F0F5;
      font-family: 'Outfit', system-ui, sans-serif;
      font-size: 12px;
      padding: 0 12px;
      gap: 8px;
      cursor: pointer;
      border-top: 1px solid rgba(255,255,255,0.06);
      box-shadow: 0 -4px 16px rgba(0,0,0,0.4);
    }
    .ticker:hover { background: rgba(20, 20, 30, 0.95); }
    .score { font-weight: 600; letter-spacing: 0.02em; }
    .live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #f87171; animation: pulse 1.5s infinite;
      display: inline-block; margin-right: 4px; flex-shrink: 0;
    }
    .dismiss {
      background: none; border: none; color: #6b7280;
      cursor: pointer; font-size: 14px; padding: 0 4px;
      line-height: 1; flex-shrink: 0;
    }
    .dismiss:hover { color: #9ca3af; }
    @keyframes pulse {
      0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
    }
  `
  shadow.appendChild(style)

  const ticker = document.createElement('div')
  ticker.className = 'ticker'
  ticker.innerHTML = `
    <span class="live-dot"></span>
    <span class="score" id="crickit-score">🏏 Loading...</span>
    <button class="dismiss" id="crickit-close" title="Dismiss">✕</button>
  `
  shadow.appendChild(ticker)

  // Dismiss
  shadow.getElementById('crickit-close')?.addEventListener('click', (e) => {
    e.stopPropagation()
    sessionStorage.setItem(STORAGE_KEY, '1')
    host.remove()
  })

  // Click opens popup
  ticker.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' })
  })

  // Listen for score updates from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TICKER_UPDATE' && msg.text) {
      const el = shadow.getElementById('crickit-score')
      if (el) el.textContent = msg.text
    }
  })

  // Request initial score
  chrome.runtime.sendMessage({ type: 'GET_TICKER' }, (res) => {
    if (res?.text) {
      const el = shadow.getElementById('crickit-score')
      if (el) el.textContent = res.text
    }
  })
}

// Run after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createTicker)
} else {
  createTicker()
}
