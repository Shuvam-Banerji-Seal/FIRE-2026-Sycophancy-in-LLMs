// counter.js — Stat number count-up animation

(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count)
    const suffix = el.dataset.suffix || ''
    const duration = 800

    if (prefersReducedMotion) {
      el.textContent = target + suffix
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          observer.unobserve(el)
          animateCount(el, target, suffix, duration)
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
  })

  function animateCount(el, target, suffix, duration) {
    const start = performance.now()

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4)
    }

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuart(progress)
      const current = Math.round(eased * target)

      el.textContent = current + suffix

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }
})()
