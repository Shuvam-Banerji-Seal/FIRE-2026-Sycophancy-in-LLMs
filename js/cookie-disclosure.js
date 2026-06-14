// cookie-disclosure.js — Functional-cookie disclosure banner
//
// Shows a one-time disclosure when a user first visits, listing the
// strictly functional cookies the site uses:
//   - fire2026_loader_seen  (1 day)  — gates the sycophancy loader
//   - fire2026_theme        (∞)       — remembers dark/light choice
//   - fire2026_cookie_ack   (180 d)   — remembers this disclosure
//
// No analytics, no tracking, no third-party cookies. Clicking
// "Got it" sets the ack cookie and hides the banner forever (or
// for 180 days, whichever comes first). Clearing the cookie resets
// the disclosure.

(function () {
  'use strict'

  const ACK_COOKIE = 'fire2026_cookie_ack'
  const ACK_DAYS = 180
  const BANNER_ID = 'cookie-disclosure'

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }

  function setCookie(name, value, days) {
    const d = new Date()
    d.setTime(d.getTime() + days * 86400000)
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax'
  }

  // Build the banner DOM (or return early if not needed).
  function ensureBanner() {
    let banner = document.getElementById(BANNER_ID)
    if (banner) return banner

    banner = document.createElement('div')
    banner.id = BANNER_ID
    banner.className = 'cookie-disclosure'
    banner.setAttribute('role', 'region')
    banner.setAttribute('aria-label', 'Cookie disclosure')
    banner.innerHTML = `
      <div class="cookie-disclosure__icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
             stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
          <circle cx="8.5" cy="8.5" r="0.5" fill="currentColor"/>
          <circle cx="15" cy="13" r="0.5" fill="currentColor"/>
          <circle cx="10" cy="14" r="0.5" fill="currentColor"/>
        </svg>
      </div>
      <div class="cookie-disclosure__text">
        <strong>This site uses strictly functional cookies.</strong>
        <div class="cookie-disclosure__list">
          <code>fire2026_loader_seen</code> · <code>fire2026_theme</code> · <code>fire2026_cookie_ack</code>
        </div>
      </div>
      <div class="cookie-disclosure__actions">
        <button type="button" class="cookie-disclosure__btn cookie-disclosure__btn--primary" data-action="ack">
          Got it
        </button>
      </div>
    `

    document.body.appendChild(banner)

    banner.querySelector('[data-action="ack"]').addEventListener('click', function () {
      setCookie(ACK_COOKIE, '1', ACK_DAYS)
      banner.classList.remove('visible')
      // Remove from DOM after the fade so it can't be tabbed to.
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner)
      }, 500)
    })

    return banner
  }

  function show() {
    const banner = ensureBanner()
    // requestAnimationFrame so the CSS transition runs
    requestAnimationFrame(function () {
      banner.classList.add('visible')
    })
  }

  // Only show if no ack cookie present
  if (!getCookie(ACK_COOKIE)) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', show)
    } else {
      // Small delay so the banner doesn't compete with hero / loader
      setTimeout(show, 1200)
    }
  }
})()
