// timeline.js — Timeline scroll-drive, connecting lines, today marker

(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const line = document.querySelector('.timeline__line-fill')
  const timeline = document.querySelector('.timeline')
  const items = document.querySelectorAll('.timeline__item')

  if (!line || items.length === 0 || !timeline) return

  // ── Scroll-driven line fill ──────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target
          const index = Array.from(items).indexOf(item)
          const progress = (index + 1) / items.length

          if (!prefersReducedMotion) {
            line.style.transition = 'height 800ms var(--ease-out-expo)'
          }
          line.style.height = `${progress * 100}%`

          const dot = item.querySelector('.timeline__dot')
          if (dot) {
            if (!prefersReducedMotion) {
              dot.style.transition = `transform 400ms var(--ease-spring) ${index * 150}ms`
            }
            dot.style.transform = 'translateX(-50%) scale(1)'
          }

          if (!prefersReducedMotion) {
            item.style.transition = `opacity 600ms var(--ease-out-expo) ${index * 150}ms`
          }
          item.style.opacity = '1'

          observer.unobserve(item)
        }
      })
    },
    { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
  )

  items.forEach(item => observer.observe(item))

  // ── Dynamic today marker ────────────────────────────────
  function parseDate(str) {
    if (!str) return null
    // Handle "December 2026" format
    const full = str.trim()
    const d = new Date(full)
    if (!isNaN(d.getTime())) return d
    // Try "Month YYYY"
    const months = { January:0, February:1, March:2, April:3, May:4, June:5, July:6, August:7, September:8, October:9, November:10, December:11 }
    const parts = full.split(/\s+/)
    if (parts.length >= 2) {
      const m = months[parts[0]]
      const y = parseInt(parts[parts.length - 1])
      if (m !== undefined && !isNaN(y)) return new Date(y, m, 1)
    }
    return null
  }

  function computeTodayPosition() {
    const dates = []
    items.forEach(item => {
      const badge = item.querySelector('.date-badge')
      const d = parseDate(badge?.textContent)
      if (d) dates.push({ date: d, item })
    })

    if (dates.length < 2) return null

    const first = dates[0].date
    const last = dates[dates.length - 1].date
    const now = new Date()

    // Find next upcoming event
    let nextEvent = null
    for (const d of dates) {
      if (d.date > now) { nextEvent = d; break }
    }

    // Find previous event
    let prevEvent = null
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i].date <= now) { prevEvent = dates[i]; break }
    }

    // Calculate position as percentage
    const totalSpan = last.date - first.date
    const elapsed = now - first.date
    let progress = totalSpan > 0 ? elapsed / totalSpan : 0
    progress = Math.max(0, Math.min(1, progress))

    // Calculate days remaining
    let countdown = ''
    if (nextEvent) {
      const days = Math.ceil((nextEvent.date - now) / (1000 * 60 * 60 * 24))
      const eventName = nextEvent.item.querySelector('.timeline__event')?.textContent || 'next event'
      countdown = days > 0 ? `${days} days until ${eventName}` : `Today: ${eventName}`
    } else if (prevEvent) {
      const days = Math.floor((now - prevEvent.date) / (1000 * 60 * 60 * 24))
      const eventName = prevEvent.item.querySelector('.timeline__event')?.textContent || 'last event'
      countdown = `${days} days since ${eventName}`
    }

    return { progress, countdown }
  }

  function createTodayMarker() {
    const result = computeTodayPosition()
    if (!result) return

    const { progress, countdown } = result

    const marker = document.createElement('div')
    marker.className = 'timeline__today'
    marker.style.top = `${progress * 100}%`
    marker.innerHTML = `
      <div class="timeline__today-line"></div>
      <div class="timeline__today-label">
        <span class="timeline__today-text">Today</span>
        <span class="timeline__today-countdown">${countdown}</span>
      </div>
    `
    timeline.appendChild(marker)

    if (prefersReducedMotion) {
      marker.style.opacity = '1'
    } else {
      marker.style.opacity = '0'
      marker.style.transition = 'opacity 800ms ease'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { marker.style.opacity = '1' })
      })
    }
  }

  createTodayMarker()
})()
