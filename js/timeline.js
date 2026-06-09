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
          const index = Array.from(items).indexOf(item)
          setTimeout(() => {
            item.classList.add('go')
          }, prefersReducedMotion ? 0 : index * 150)

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

    // Check if today is outside the timeline range
    if (now < first || now > last) return null

    let nextEvent = null
    for (const d of dates) {
      if (d.date > now) { nextEvent = d; break }
    }

    let prevEvent = null
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i].date <= now) { prevEvent = dates[i]; break }
    }

    // Find which gap we're in
    let gapIndex = 0
    for (let i = 0; i < dates.length - 1; i++) {
      if (now >= dates[i].date && now <= dates[i + 1].date) {
        gapIndex = i
        break
      }
    }

    // Calculate days remaining
    let countdown = ''
    if (nextEvent) {
      const days = Math.ceil((nextEvent.date - now) / (1000 * 60 * 60 * 24))
      const eventName = nextEvent.item.querySelector('.tl-event')?.textContent || 'next event'
      countdown = days > 0 ? `${days} days until ${eventName}` : `Today`
    }

    return { gapIndex, countdown, dates }
  }

  function createTodayItem() {
    const result = computeTodayPosition()
    if (!result) return

    const { gapIndex, countdown, dates } = result
    const isOdd = gapIndex % 2 === 0  // next item after gap determines side

    // Create the today item HTML
    const todayItem = document.createElement('div')
    todayItem.className = `tl-item today-marker ${isOdd ? 'odd' : 'even'}`
    todayItem.style.opacity = '0'

    const cntHtml = `
      <div class="tl-cnt">
        <span class="date-badge date-badge--today">Today</span>
        <div class="tl-event tl-event--today">${countdown}</div>
      </div>
    `

    if (isOdd) {
      todayItem.innerHTML = `
        ${cntHtml}
        <div class="tl-cl"></div>
        <div class="tl-dot tl-dot--today"></div>
        <div class="tl-cr2"></div>
        <div></div>
      `
    } else {
      todayItem.innerHTML = `
        <div></div>
        <div class="tl-cl2"></div>
        <div class="tl-dot tl-dot--today"></div>
        <div class="tl-cr"></div>
        ${cntHtml}
      `
    }

    // Insert after the gap item
    const insertAfter = dates[gapIndex].item
    insertAfter.after(todayItem)

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        todayItem.style.transition = 'opacity 0.6s ease'
        todayItem.style.opacity = '1'
        todayItem.classList.add('go')
      })
    })
  }

  // Wait for initial animations, then add today marker
  setTimeout(createTodayItem, 1500)
})()
