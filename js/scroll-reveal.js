// scroll-reveal.js — IntersectionObserver with all variant support

(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Wait for site to be visible before setting up reveals
  function init() {
    // Hide all reveal elements initially
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '0'
      if (!prefersReducedMotion) {
        el.style.willChange = 'opacity, transform, clip-path, filter'
      }
    })

    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach(el => {
        el.style.opacity = '1'
        el.classList.add('revealed')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return

          const el = entry.target
          const delay = parseInt(el.dataset.revealDelay) || 0
          const duration = el.dataset.revealDuration || null

          setTimeout(() => {
            if (duration) {
              el.style.animationDuration = `${duration}ms`
            }
            el.classList.add('revealed')
            el.style.opacity = ''
          }, delay)

          observer.unobserve(el)
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    document.querySelectorAll('[data-reveal]').forEach(el => {
      observer.observe(el)
    })

    // Stagger support
    document.querySelectorAll('[data-stagger]').forEach(container => {
      const delay = parseInt(container.dataset.stagger) || 80
      const children = container.querySelectorAll('[data-reveal]')
      children.forEach((child, i) => {
        child.dataset.revealDelay = String(i * delay)
      })
    })
  }

  // Run when site becomes visible or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to let loader cookie check run first
      setTimeout(init, 50)
    })
  } else {
    setTimeout(init, 50)
  }
})()
