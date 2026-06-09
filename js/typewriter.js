// typewriter.js — JSON block typewriter (one-shot on scroll entry)

(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const SPEED = 12

  document.querySelectorAll('[data-typewriter]').forEach(el => {
    const originalHTML = el.innerHTML
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          observer.unobserve(el)
          typewrite(el, originalHTML)
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
  })

  function typewrite(el, html) {
    // Strip HTML tags to get plain text, but preserve tag positions
    const tokens = tokenize(html)
    el.innerHTML = ''
    el.style.visibility = 'visible'

    // Add cursor
    const cursor = document.createElement('span')
    cursor.className = 'typewriter-cursor'
    cursor.textContent = '▋'
    cursor.style.cssText = `
      color: var(--color-cyan);
      animation: blink 0.5s step-end infinite;
      margin-left: 1px;
    `

    let i = 0
    function tick() {
      if (i >= tokens.length) {
        cursor.remove()
        return
      }

      const token = tokens[i]
      if (token.type === 'text') {
        el.appendChild(document.createTextNode(token.value))
      } else {
        // It's an HTML tag — append as a raw element
        const wrapper = document.createElement('span')
        wrapper.innerHTML = token.value
        el.appendChild(wrapper.firstChild || wrapper)
      }

      el.appendChild(cursor)
      i++
      setTimeout(tick, SPEED)
    }

    tick()
  }

  function tokenize(html) {
    const tokens = []
    let i = 0

    while (i < html.length) {
      if (html[i] === '<') {
        const close = html.indexOf('>', i)
        if (close === -1) break
        tokens.push({ type: 'tag', value: html.slice(i, close + 1) })
        i = close + 1
      } else {
        let j = i
        while (j < html.length && html[j] !== '<') j++
        tokens.push({ type: 'text', value: html.slice(i, j) })
        i = j
      }
    }

    return tokens
  }
})()
