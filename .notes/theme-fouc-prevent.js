// theme-fouc-prevent.js — INLINE snippet, do NOT load as a module
//
// This file is documentation. The actual code is inlined verbatim
// into the <head> of every HTML page (see /pages/*.html and
// /index.html) so it can run synchronously before the first paint.
//
// Why inline?  A regular <script src="..."> with `defer` or `async`
// runs after the first paint, causing a flash of light theme (the
// :root default) on dark-mode users. An inline blocking script in
// <head> runs before any style is applied.
//
// --- BEGIN INLINE SNIPPET ----------------------------------------
(function () {
  try {
    var stored = localStorage.getItem('fire2026_theme')
    if (stored === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      // Reflect on the toggle button text so it doesn't briefly
      // show the wrong label. The deferred theme.js will sync the
      // meta theme-color, aria-label, and any other toggles.
      document.querySelectorAll('.theme-toggle').forEach(function (b) {
        b.textContent = 'Light'
      })
    } else {
      // Stored is 'light' or null. Ensure the attribute is absent
      // so :root tokens resolve.
      document.documentElement.removeAttribute('data-theme')
    }
  } catch (e) { /* localStorage blocked — default to light */ }
})();
// --- END INLINE SNIPPET ------------------------------------------

