// timeline.js — Grid-based timeline with scroll animation + today marker

(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const tl = document.querySelector('.tl')
  const items = document.querySelectorAll('.tl-item')

  if (!tl || items.length === 0) return

  // ── Scroll-driven reveal ────────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target

          // Stagger: add .go class with delay based on index
          const index = Array.from(items).indexOf(item)
          setTimeout(() => {
            item.classList.add('go')
          }, prefersReducedMotion ? 0 : index * 150)

          // Add .go to timeline container on first item
          if (index === 0) {
            tl.classList.add('go')
          }

          observer.unobserve(item)
        }
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
  )

  items.forEach(item => observer.observe(item))

  // ── Dynamic today marker ────────────────────────────────
  function parseDate(str) {
    if (!str) return null
    const full = str.trim()
    const d = new Date(full)
    if (!isNaN(d.getTime())) return d
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

    let nextEvent = null
    for (const d of dates) {
      if (d.date > now) { nextEvent = d; break }
    }

    let prevEvent = null
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i].date <= now) { prevEvent = dates[i]; break }
    }

    const totalSpan = last.date - first.date
    const elapsed = now - first.date
    let progress = totalSpan > 0 ? elapsed / totalSpan : 0
    progress = Math.max(0, Math.min(1, progress))

    let countdown = ''
    if (nextEvent) {
      const days = Math.ceil((nextEvent.date - now) / (1000 * 60 * 60 * 24))
      const eventName = nextEvent.item.querySelector('.tl-event')?.textContent || 'next event'
      countdown = days > 0 ? `${days} days until ${eventName}` : `Today: ${eventName}`
    } else if (prevEvent) {
      const days = Math.floor((now - prevEvent.date) / (1000 * 60 * 60 * 24))
      const eventName = prevEvent.item.querySelector('.tl-event')?.textContent || 'last event'
      countdown = `${days} days since ${eventName}`
    }

    return { progress, countdown }
  }

  function createTodayMarker() {
    const result = computeTodayPosition()
    if (!result) return

    const { progress, countdown } = result

    const marker = document.createElement('div')
    marker.className = 'tl-today'
    marker.style.top = `${progress * 100}%`
    marker.innerHTML = `
      <div class="tl-today-line"></div>
      <div class="tl-today-label">
        <span class="tl-today-text">Today</span>
        <span class="tl-today-countdown">${countdown}</span>
      </div>
    `
    tl.appendChild(marker)

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
