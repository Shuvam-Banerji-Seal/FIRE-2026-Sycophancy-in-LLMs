// pretext-dynamic.js — Dynamic font resizing with pretext

(function () {
  'use strict'

  const PRETEXT_CDN = 'https://esm.sh/gh/chenglou/pretext@latest?no-check'
  let prepare, layout, measureNaturalWidth

  async function loadPretext() {
    try {
      const mod = await import(PRETEXT_CDN)
      prepare = mod.prepare
      layout = mod.layout
      measureNaturalWidth = mod.measureNaturalWidth
      return true
    } catch (e) {
      console.warn('Pretext unavailable, using fallback sizing')
      return false
    }
  }

  // Measure text and return optimal font size that fits within maxWidth
  function getOptimalSize(text, fontFamily, minSize, maxSize, maxWidth, lineHeight) {
    if (!prepare || !layout) return { fontSize: maxSize, height: 0, lines: 1 }

    for (let size = maxSize; size >= minSize; size -= 2) {
      const font = `${size}px ${fontFamily}`
      const prepared = prepare(text, font)
      const result = layout(prepared, maxWidth, size * lineHeight)
      if (result.lineCount <= 2) {
        return { fontSize: size, height: result.height, lines: result.lineCount }
      }
    }

    // Fallback to min size
    const font = `${minSize}px ${fontFamily}`
    const prepared = prepare(text, font)
    const result = layout(prepared, maxWidth, minSize * lineHeight)
    return { fontSize: minSize, height: result.height, lines: result.lineCount }
  }

  // Dynamically size hero title
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

  // Dynamically size task card descriptions
  function sizeTaskDescriptions() {
    if (!prepare) return

    document.querySelectorAll('.card__desc').forEach(desc => {
      const text = desc.textContent.trim()
      const fontFamily = "'Cormorant Garamond', serif"
      const maxWidth = desc.parentElement?.offsetWidth || 400

      const { fontSize } = getOptimalSize(text, fontFamily, 14, 20, maxWidth, 1.7)
      desc.style.fontSize = `${fontSize}px`
    })
  }

  // Dynamically size pull quotes
  function sizePullQuotes() {
    if (!prepare) return

    document.querySelectorAll('.pull-quote').forEach(quote => {
      const text = quote.textContent.replace(/\s+/g, ' ').trim()
      const fontFamily = "'Cormorant Garamond', serif"
      const maxWidth = quote.parentElement?.offsetWidth || 500

      const { fontSize } = getOptimalSize(text, fontFamily, 20, 48, maxWidth, 1.4)
      quote.style.fontSize = `${fontSize}px`
    })
  }

  // Initialize
  async function init() {
    const loaded = await loadPretext()
    if (!loaded) return

    // Initial sizing
    sizeHeroTitle()
    sizeTaskDescriptions()
    sizePullQuotes()

    // Resize handler (debounced)
    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        sizeHeroTitle()
        sizeTaskDescriptions()
        sizePullQuotes()
      }, 200)
    })
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100))
  } else {
    setTimeout(init, 100)
  }
})()
