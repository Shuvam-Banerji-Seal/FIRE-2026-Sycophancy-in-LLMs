// transitions.js — View Transitions API page nav

(function () {
  'use strict'

  if (!document.startViewTransition) return

  document.querySelectorAll('a[href]').forEach(link => {
    // Skip external links, hash links, and links with special attributes
    if (
      link.hostname !== window.location.hostname ||
      link.href.includes('#') ||
      link.hasAttribute('data-no-transition')
    ) {
      return
    }

    link.addEventListener('click', async (e) => {
      e.preventDefault()

      try {
        const res = await fetch(link.href)
        if (!res.ok) return

        const html = await res.text()
        const doc = new DOMParser().parseFromString(html, 'text/html')
        const newMain = doc.querySelector('main')
        const currentMain = document.querySelector('main')

        if (!newMain || !currentMain) {
          window.location.href = link.href
          return
        }

        await document.startViewTransition(() => {
          currentMain.innerHTML = newMain.innerHTML
          history.pushState({}, '', link.href)

          // Re-run scripts in new content
          document.querySelectorAll('script[data-rerun]').forEach(old => old.remove())
          newMain.querySelectorAll('script').forEach(old => {
            const s = document.createElement('script')
            s.textContent = old.textContent
            s.dataset.rerun = ''
            document.body.appendChild(s)
          })

          // Scroll to top
          window.scrollTo(0, 0)
        }).finished
      } catch {
        // Fallback to normal navigation
        window.location.href = link.href
      }
    })
  })

  // Handle back/forward
  window.addEventListener('popstate', () => {
    window.location.reload()
  })
})()
