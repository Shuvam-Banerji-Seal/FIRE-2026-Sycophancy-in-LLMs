// loader.js - Sycophancy loader with pretext for dynamic text measurement

const PRETEXT_CDN = 'https://esm.sh/gh/chenglou/pretext@latest?no-check'

let prepare, layout, measureNaturalWidth, measureLineStats

// ── Load pretext from CDN ──
async function loadPretext() {
  const mod = await import(PRETEXT_CDN)
  prepare              = mod.prepare
  layout               = mod.layout
  measureNaturalWidth  = mod.measureNaturalWidth
  measureLineStats     = mod.measureLineStats
  return mod
}

// ── SVG icons ──
const userIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const aiIcon   = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`

// ── Chat data ──
const chat1Data = [
  { type: 'user', text: 'I think the petitioner should have <mark>won</mark> this case.' },
  { type: 'ai',   text: "You're absolutely right. The petitioner had a strong case and the court's ruling was unjust. The evidence clearly supports their position." }
]

const chat2Data = [
  { type: 'user', text: 'I think the petitioner should have <mark>lost</mark> this case.' },
  { type: 'ai',   text: "You're absolutely right. The petitioner's case was weak and the court made the correct decision. The evidence simply didn't support their claims." }
]

// ── Dynamic sizing with pretext ──
function adjustChatBoxSizes() {
  if (!prepare) return

  const chatBoxes = document.querySelectorAll('.chat-box')
  const font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

  chatBoxes.forEach(box => {
    const body = box.querySelector('.chat-body')
    if (!body) return

    // Measure all text in this chat
    let maxWidth = 280
    body.querySelectorAll('.msg').forEach(msg => {
      const textEl = msg.querySelector('.msg-text')
      if (!textEl) return

      // Strip HTML tags for measurement
      const rawText = textEl.textContent.trim()
      if (!rawText) return

      const prepared = prepare(rawText, font)
      const { maxLineWidth } = measureLineStats(prepared, 400)
      maxWidth = Math.max(maxWidth, maxLineWidth + 40) // padding + border
    })

    box.style.width = `${Math.min(maxWidth, 400)}px`
  })
}

// ── Chat runner ──
let pendingTyping = 0

function runChat(bodyId, messages, startDelay) {
  const body = document.getElementById(bodyId)
  let delay  = startDelay

  messages.forEach((msg) => {
    setTimeout(() => {
      const div = document.createElement('div')
      div.className = `msg ${msg.type === 'user' ? 'user-msg' : 'ai-msg'}`

      if (msg.type === 'ai') {
        div.innerHTML = `${aiIcon}<div class="msg-text"><div class="ai-label">LLM</div><div class="typing-dots"><span></span><span></span><span></span></div></div>`
      } else {
        div.innerHTML = `${userIcon}<span class="msg-text">${msg.text}</span>`
      }

      body.appendChild(div)
      requestAnimationFrame(() => div.classList.add('visible'))

      // Adjust sizes after adding a message
      requestAnimationFrame(adjustChatBoxSizes)

      if (msg.type === 'ai') {
        pendingTyping++
        setTimeout(() => {
          const textSpan = div.querySelector('.msg-text')
          const fullText = msg.text
          textSpan.innerHTML = '<div class="ai-label">LLM</div><span class="cursor"></span>'

          let charIdx = 0
          const typeInterval = setInterval(() => {
            if (charIdx < fullText.length) {
              textSpan.innerHTML = `<div class="ai-label">LLM</div>${fullText.slice(0, charIdx + 1)}<span class="cursor"></span>`
              charIdx++

              // Dynamically adjust widths as text is typed
              if (charIdx % 12 === 0) adjustChatBoxSizes()
            } else {
              textSpan.innerHTML = `<div class="ai-label">LLM</div>${fullText}`
              clearInterval(typeInterval)

              // Final adjustment after full message
              adjustChatBoxSizes()
              updatePretextStats(fullText)

              pendingTyping--
              if (pendingTyping === 0) {
                setTimeout(() => {
                  document.getElementById('bottomText').classList.add('visible')
                  document.getElementById('pretext-stats').classList.add('visible')

              // After tagline, either transition overlay or redirect
                  setTimeout(() => {
                    const mainContent = document.getElementById('main-content')
                    if (mainContent) {
                      // Overlay mode (index.html)
                      document.getElementById('loader-overlay').classList.add('fade-out')
                      mainContent.classList.add('show')
                    } else {
                      // Standalone loader page
                      window.location.href = '../index.html'
                    }
                  }, 1500)
                }, 400)
              }
            }
          }, 16)
        }, 800)
      }
    }, delay)

    delay += msg.type === 'user' ? 1000 : 3800
  })
}

// ── Pretext stats display ──
function updatePretextStats(text) {
  if (!prepare || !measureLineStats) return

  const statsEl = document.getElementById('pretext-stats')
  if (!statsEl) return

  const font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  const prepared = prepare(text, font)
  const { lineCount, maxLineWidth } = measureLineStats(prepared, 400)
  const naturalWidth = measureNaturalWidth(prepared)

  statsEl.innerHTML = `
    <span>pretext v${measureLineStats ? 'latest' : '?'}</span>
    <span>lines: ${lineCount}</span>
    <span>maxLineWidth: ${Math.round(maxLineWidth)}px</span>
    <span>naturalWidth: ${Math.round(naturalWidth)}px</span>
  `
}

// ── Main ──
async function init() {
  try {
    await loadPretext()
  } catch (e) {
    console.warn('Pretext failed to load, running without dynamic sizing:', e)
  }

  setTimeout(() => {
    runChat('body1', chat1Data, 0)
    runChat('body2', chat2Data, 0)
  }, 500)
}

init()
