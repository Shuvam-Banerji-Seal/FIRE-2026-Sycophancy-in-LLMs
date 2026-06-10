// nav.js — Sticky nav, scroll progress, mobile menu

(function () {
  'use strict'

  const nav = document.querySelector('.nav')
  const toggle = document.querySelector('.nav__toggle')
  const overlay = document.querySelector('.nav__overlay')
  const progress = document.querySelector('.scroll-progress')
  const overlayLinks = overlay ? overlay.querySelectorAll('.nav-link') : []
  const overlayToggle = overlay ? overlay.querySelector('.theme-toggle') : null

  // ── Sticky nav state ────────────────────────────────────
  let lastScroll = 0
  let ticking = false

  function onScroll() {
    lastScroll = window.scrollY
    if (!ticking) {
      requestAnimationFrame(updateNav)
      ticking = true
    }
  }

  function updateNav() {
    ticking = false

    // Scrolled class
    if (lastScroll > 40) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }

    // Scroll progress
    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = docHeight > 0 ? lastScroll / docHeight : 0
      progress.style.transform = `scaleX(${scrolled})`
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  updateNav()

  // ── Mobile menu ─────────────────────────────────────────
  if (toggle && overlay) {
    toggle.addEventListener('click', () => {
      const isOpen = overlay.classList.contains('open')
      if (isOpen) {
        closeMenu()
      } else {
        openMenu()
      }
    })

    // Close on link click
    overlayLinks.forEach((link, i) => {
      link.addEventListener('click', () => closeMenu())
      // Staggered entrance
      link.style.transitionDelay = `${i * 40}ms`
    })

    // Close on theme toggle click
    if (overlayToggle) {
      overlayToggle.addEventListener('click', () => closeMenu())
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeMenu()
      }
    })
  }

  function openMenu() {
    overlay.classList.add('open')
    toggle.classList.add('active')
    document.body.style.overflow = 'hidden'
    // Trigger staggered entrance
    requestAnimationFrame(() => {
      overlayLinks.forEach((link, i) => {
        link.style.transitionDelay = `${i * 40}ms`
      })
    })
  }

  function closeMenu() {
    overlay.classList.remove('open')
    toggle.classList.remove('active')
    document.body.style.overflow = ''
    overlayLinks.forEach(link => {
      link.style.transitionDelay = '0ms'
    })
  }

  // ── Active link tracking ────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href')
    if (href === currentPath || (href === 'index.html' && currentPath === '')) {
      link.setAttribute('aria-current', 'page')
    }
  })
})()
