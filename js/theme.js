// theme.js — Light/dark theme toggle with localStorage persistence
//
// Default theme is LIGHT — the site is intentionally light-first for
// new visitors, regardless of system preference. The dark theme is
// opt-in via the toggle button.
//
// Persistence chain (highest priority wins):
//   1. localStorage 'fire2026_theme'   — explicit user choice
//   2. LIGHT                           — first-visit default
//
// An inline blocking script in each page's <head> reads the same
// localStorage key and sets <html data-theme="dark"> before first
// paint, so dark-mode users don't see a light flash. See the
// snippet documented in .notes/theme-fouc-prevent.js.

(function () {
  'use strict'

  const STORAGE_KEY = 'fire2026_theme'
  const html = document.documentElement

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch (e) {
      return null
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark')
    } else {
      // Light is the default — remove the attribute to fall through
      // to :root in base.css (so first paint without JS still works).
      html.removeAttribute('data-theme')
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (e) {
      // localStorage may be blocked (Safari private mode, etc.) —
      // the toggle still works for the current session, just won't
      // persist across reloads.
    }

    // Update ALL toggle button labels
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? 'Light' : 'Dark'
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`)
    })

    // Update meta theme-color for browser chrome (status bar, address bar)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.content = theme === 'dark' ? '#000000' : '#f5f0e8'
    }
  }

  function toggleTheme() {
    const isDark = html.getAttribute('data-theme') === 'dark'
    applyTheme(isDark ? 'light' : 'dark')
  }

  // Bind ALL toggle buttons (desktop nav + mobile overlay)
  function bindAllToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme)
    })
  }

  // Re-apply the stored theme on script load. The inline FOUC
  // prevention script in <head> already set data-theme for the
  // first paint; this just makes sure the toggle buttons reflect
  // the current state and the meta theme-color is in sync.
  const stored = getStoredTheme()
  if (stored === 'dark') {
    applyTheme('dark')
  } else {
    applyTheme('light')
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAllToggles)
  } else {
    bindAllToggles()
  }
})()
