// timeline.js — Timeline scroll-drive + milestone state

(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const line = document.querySelector('.timeline__line-fill')
  const items = document.querySelectorAll('.timeline__item')

  if (!line || items.length === 0) return

  // Check for CSS scroll-driven animation support
  const supportsScrollTimeline = CSS.supports('animation-timeline', 'scroll()')

  if (supportsScrollTimeline && !prefersReducedMotion) {
    // CSS scroll-driven animation handles the line
    // JS handles the dot reveal
  } else {
    // Fallback: IntersectionObserver for line and dots
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const item = entry.target
            const index = Array.from(items).indexOf(item)
            const progress = (index + 1) / items.length

            // Animate line height
            if (!prefersReducedMotion) {
              line.style.transition = `height 800ms var(--ease-out-expo)`
              line.style.height = `${progress * 100}%`
            } else {
              line.style.height = `${progress * 100}%`
            }

            // Reveal the dot
            const dot = item.querySelector('.timeline__dot')
            if (dot) {
              if (!prefersReducedMotion) {
                dot.style.transition = `transform 400ms var(--ease-spring) ${index * 150}ms`
              }
              dot.style.transform = 'translateX(-50%) scale(1)'
            }

            // Reveal the item
            if (!prefersReducedMotion) {
              item.style.transition = `opacity 600ms var(--ease-out-expo) ${index * 150}ms`
            }
            item.style.opacity = '1'

            observer.unobserve(item)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px',
      }
    )

    items.forEach(item => observer.observe(item))
  }
})()
