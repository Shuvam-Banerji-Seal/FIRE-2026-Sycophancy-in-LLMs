// theme.js — Light/dark theme toggle with localStorage persistence

(function () {
  'use strict'

  const STORAGE_KEY = 'fire2026_theme'
  const html = document.documentElement

  // ── Determine initial theme ────────────────────────────
  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    // Respect system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
    return 'dark'
  }

  // ── Apply theme ────────────────────────────────────────
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)

    // Update toggle button text
    const toggle = document.querySelector('.theme-toggle')
    if (toggle) {
      toggle.textContent = theme === 'dark' ? 'Light' : 'Dark'
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`)
    }

    // Swap logos
    document.querySelectorAll('.logo-dark, .logo-light').forEach(img => {
      // Handled by CSS display rules
    })

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.content = theme === 'dark' ? '#000000' : '#f5f0e8'
    }
  }

  // ── Toggle ─────────────────────────────────────────────
  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  }

  // ── Initialize ─────────────────────────────────────────
  const initial = getInitialTheme()
  applyTheme(initial)

  // Bind toggle button (works even if script loads after DOM)
  function bindToggle() {
    const btn = document.querySelector('.theme-toggle')
    if (btn) {
      btn.addEventListener('click', toggleTheme)
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggle)
  } else {
    bindToggle()
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
})()
