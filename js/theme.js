// theme.js — Light/dark theme toggle with localStorage persistence

(function () {
  'use strict'

  const STORAGE_KEY = 'fire2026_theme'
  const html = document.documentElement

  function getInitialTheme() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)

    // Update ALL toggle button texts
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? 'Light' : 'Dark'
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`)
    })

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.content = theme === 'dark' ? '#000000' : '#f5f0e8'
    }
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  }

  // Apply initial theme
  const initial = getInitialTheme()
  applyTheme(initial)

  // Bind ALL toggle buttons
  function bindAllToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAllToggles)
  } else {
    bindAllToggles()
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
})()
