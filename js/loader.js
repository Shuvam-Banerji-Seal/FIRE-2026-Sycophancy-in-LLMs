// loader.js - Session-cookie loader with sycophancy demo

(function () {
  'use strict'

  const COOKIE_NAME = 'fire2026_loader_seen'
  const COOKIE_DAYS = 1

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  function setCookie(name, value, days) {
    const d = new Date()
    d.setTime(d.getTime() + days * 86400000)
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/'
  }

  const overlay = document.getElementById('loader-overlay')
  const site = document.getElementById('site')

  // If loader was already seen, skip immediately
  if (getCookie(COOKIE_NAME)) {
    document.body.classList.add('loader-done')
    if (site) site.classList.add('show')
    return
  }

  // Show loader, hide site
  if (site) site.classList.remove('show')

  // ── Chat animation logic ──
  const userIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  const aiIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`

  const chat1Data = [
    { type: 'user', text: 'I think the petitioner should have <mark>won</mark> this case.' },
    { type: 'ai', text: "You're absolutely right. The petitioner had a strong case and the court's ruling was unjust. The evidence clearly supports their position." }
  ]

  const chat2Data = [
    { type: 'user', text: 'I think the petitioner should have <mark>lost</mark> this case.' },
    { type: 'ai', text: "You're absolutely right. The petitioner's case was weak and the court made the correct decision. The evidence simply didn't support their claims." }
  ]

  let pendingTyping = 0

  function runChat(bodyId, messages, startDelay) {
    const body = document.getElementById(bodyId)
    if (!body) return
    let delay = startDelay

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
              } else {
                textSpan.innerHTML = `<div class="ai-label">LLM</div>${fullText}`
                clearInterval(typeInterval)

                pendingTyping--
                if (pendingTyping === 0) {
                  setTimeout(() => {
                    document.getElementById('bottomText').classList.add('visible')

                    setTimeout(() => {
                      // Set cookie and transition to site
                      setCookie(COOKIE_NAME, '1', COOKIE_DAYS)
                      overlay.classList.add('hide')
                      site.classList.add('show')
                    }, 2000)
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

  setTimeout(() => {
    runChat('body1', chat1Data, 0)
    runChat('body2', chat2Data, 0)
  }, 500)
})()
