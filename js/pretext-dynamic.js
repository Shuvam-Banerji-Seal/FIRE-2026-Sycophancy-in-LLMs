// pretext-dynamic.js — Comprehensive dynamic text sizing with pretext

(function () {
  'use strict'

  const PRETEXT_CDN = 'https://esm.sh/gh/chenglou/pretext@latest?no-check'
  let prepare, layout, measureNaturalWidth, measureLineStats

  async function loadPretext() {
    try {
      const mod = await import(PRETEXT_CDN)
      prepare = mod.prepare
      layout = mod.layout
      measureNaturalWidth = mod.measureNaturalWidth
      measureLineStats = mod.measureLineStats
      return true
    } catch (e) {
      console.warn('Pretext unavailable, using fallback sizing')
      return false
    }
  }

  // Measure text and return optimal font size that fits within maxWidth in maxLines
  function getOptimalSize(text, fontFamily, minSize, maxSize, maxWidth, lineHeight, maxLines) {
    maxLines = maxLines || 2
    if (!prepare || !layout) return { fontSize: maxSize, height: 0, lines: 1 }

    for (let size = maxSize; size >= minSize; size -= 2) {
      const font = `${size}px ${fontFamily}`
      const prepared = prepare(text, font)
      const result = layout(prepared, maxWidth, size * lineHeight)
      if (result.lineCount <= maxLines) {
        return { fontSize: size, height: result.height, lines: result.lineCount }
      }
    }

    const font = `${minSize}px ${fontFamily}`
    const prepared = prepare(text, font)
    const result = layout(prepared, maxWidth, minSize * lineHeight)
    return { fontSize: minSize, height: result.height, lines: result.lineCount }
  }

  // Get measured width of text at a given font size
  function measureWidth(text, font) {
    if (!prepare) return text.length * 8
    const prepared = prepare(text, font)
    return measureNaturalWidth(prepared)
  }

  // ── HERO ──────────────────────────────────────────────
  function sizeHeroTitle() {
    if (!prepare) return
    const title = document.querySelector('.hero__title')
    const rightCol = document.querySelector('.hero__right')
    if (!title || !rightCol) return

    const text = title.textContent.replace(/\s+/g, ' ').trim()
    const fontFamily = "'Cinzel Decorative', serif"
    const maxWidth = rightCol.offsetWidth || 600

    const { fontSize } = getOptimalSize(text, fontFamily, 24, 64, maxWidth, 1.15)
    title.style.fontSize = `${fontSize}px`
  }

  function sizeHeroSubtitle() {
    if (!prepare) return
    const sub = document.querySelector('.hero__subtitle')
    if (!sub) return

    const text = sub.textContent.trim()
    const fontFamily = "'Cormorant Garamond', serif"
    const maxWidth = sub.parentElement?.offsetWidth || 500

    const { fontSize } = getOptimalSize(text, fontFamily, 16, 28, maxWidth, 1.6, 2)
    sub.style.fontSize = `${fontSize}px`
  }

  // ── SECTION HEADERS ───────────────────────────────────
  function sizeSectionHeaders() {
    if (!prepare) return
    document.querySelectorAll('.section__header h2, .task-section h2, h2[data-reveal]').forEach(h2 => {
      const text = h2.textContent.trim()
      const fontFamily = "'Cinzel Decorative', serif"
      const maxWidth = h2.parentElement?.offsetWidth || 800

      const { fontSize } = getOptimalSize(text, fontFamily, 24, 48, maxWidth, 1.2, 1)
      h2.style.fontSize = `${fontSize}px`
    })
  }

  // ── PULL QUOTES ───────────────────────────────────────
  function sizePullQuotes() {
    if (!prepare) return
    document.querySelectorAll('.pull-quote').forEach(quote => {
      const text = quote.textContent.replace(/\s+/g, ' ').trim()
      const fontFamily = "'Cormorant Garamond', serif"
      const maxWidth = quote.parentElement?.offsetWidth || 500

      const { fontSize } = getOptimalSize(text, fontFamily, 18, 42, maxWidth, 1.4, 6)
      quote.style.fontSize = `${fontSize}px`
    })
  }

  // ── TASK CARD DESCRIPTIONS ────────────────────────────
  function sizeTaskDescriptions() {
    if (!prepare) return
    document.querySelectorAll('.card__desc').forEach(desc => {
      const text = desc.textContent.trim()
      const fontFamily = "'Cormorant Garamond', serif"
      const maxWidth = desc.parentElement?.offsetWidth || 400

      const { fontSize } = getOptimalSize(text, fontFamily, 14, 20, maxWidth, 1.7, 4)
      desc.style.fontSize = `${fontSize}px`
    })
  }

  // ── METRIC ROW DESCRIPTIONS ───────────────────────────
  function sizeMetricDescriptions() {
    if (!prepare) return
    document.querySelectorAll('.metric-row__desc').forEach(desc => {
      const text = desc.textContent.replace(/\s+/g, ' ').trim()
      const fontFamily = "'Cormorant Garamond', serif"
      const maxWidth = desc.parentElement?.offsetWidth || 600

      const { fontSize } = getOptimalSize(text, fontFamily, 13, 18, maxWidth, 1.6, 3)
      desc.style.fontSize = `${fontSize}px`
    })
  }

  // ── TIMELINE EVENTS ───────────────────────────────────
  function sizeTimelineEvents() {
    if (!prepare || !layout) return
    document.querySelectorAll('.tl-event').forEach(ev => {
      const text = ev.textContent.trim()
      const fontFamily = "'Cormorant Garamond', serif"
      const parent = ev.closest('.tl-cnt')
      const containerWidth = parent ? parent.offsetWidth : (window.innerWidth - 100)
      const maxWidth = Math.max(containerWidth - 8, 80)

      const { fontSize } = getOptimalSize(text, fontFamily, 11, 20, maxWidth, 1.5, 4)
      ev.style.fontSize = `${fontSize}px`
    })
  }

  // ── JSON BLOCK CODE ───────────────────────────────────
  function sizeJsonBlocks() {
    if (!prepare) return
    document.querySelectorAll('.json-block pre code').forEach(code => {
      const text = code.textContent
      const fontFamily = "'Fira Code', monospace"
      const maxWidth = code.parentElement?.offsetWidth || 700

      // JSON should be compact, 0.85rem base
      const prepared = prepare(text.substring(0, 200), `14px ${fontFamily}`)
      const { maxLineWidth } = measureLineStats(prepared, maxWidth)

      // If content is wider than container, reduce font size
      if (maxLineWidth > maxWidth * 0.95) {
        code.style.fontSize = '0.75rem'
      } else {
        code.style.fontSize = '0.875rem'
      }
    })
  }

  // ── STAT CARD NUMBERS ─────────────────────────────────
  function sizeStatNumbers() {
    if (!prepare) return
    document.querySelectorAll('.stat-card__number').forEach(num => {
      const text = num.textContent.trim()
      const fontFamily = "'Cinzel Decorative', serif"
      const maxWidth = num.parentElement?.offsetWidth || 200

      const { fontSize } = getOptimalSize(text, fontFamily, 28, 72, maxWidth, 1, 1)
      num.style.fontSize = `${fontSize}px`
    })
  }

  // ── ORGANIZER CARD NAMES ──────────────────────────────
  function sizeOrganizerNames() {
    if (!prepare) return
    document.querySelectorAll('.organizer-card__name, .task-organizer__name').forEach(name => {
      const text = name.textContent.trim()
      const fontFamily = "'Cinzel Decorative', serif"
      const maxWidth = name.parentElement?.offsetWidth || 280

      const { fontSize } = getOptimalSize(text, fontFamily, 14, 24, maxWidth, 1.2, 1)
      name.style.fontSize = `${fontSize}px`
    })
  }

  // ── BADGES (measure text to auto-size) ────────────────
  function sizeBadges() {
    if (!prepare) return
    document.querySelectorAll('.badge, .date-badge').forEach(badge => {
      const text = badge.textContent.trim()
      const fontFamily = "'Fira Code', monospace"
      const width = measureWidth(text, `11px ${fontFamily}`)
      // Ensure badge is wide enough
      if (width > 0) {
        badge.style.minWidth = `${Math.ceil(width) + 16}px`
      }
    })
  }

  // ── BUTTONS (measure text to prevent overflow) ─────────
  function sizeButtons() {
    if (!prepare) return
    document.querySelectorAll('.btn').forEach(btn => {
      const text = btn.textContent.trim()
      const fontFamily = "'Cinzel Decorative', serif"
      const width = measureWidth(text, `12px ${fontFamily}`)
      if (width > 0) {
        btn.style.minWidth = `${Math.ceil(width) + 40}px`
      }
    })
  }

  // ── MASTER RESIZE HANDLER ─────────────────────────────
  function runAllSizing() {
    sizeHeroTitle()
    sizeHeroSubtitle()
    sizeSectionHeaders()
    sizePullQuotes()
    sizeTaskDescriptions()
    sizeMetricDescriptions()
    sizeTimelineEvents()
    sizeJsonBlocks()
    sizeStatNumbers()
    sizeOrganizerNames()
    sizeBadges()
    sizeButtons()
  }

  // ── INITIALIZE ────────────────────────────────────────
  async function init() {
    const loaded = await loadPretext()
    if (!loaded) return

    // Run sizing after a small delay to let layout settle
    setTimeout(runAllSizing, 150)

    // Resize handler (debounced)
    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(runAllSizing, 200)
    })

    // Also run after scroll-reveal animations complete
    setTimeout(runAllSizing, 2500)
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100))
  } else {
    setTimeout(init, 100)
  }
})()
