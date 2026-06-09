// copy.js — JSON block copy-to-clipboard with state feedback

(function () {
  'use strict'

  document.querySelectorAll('.json-block__copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const block = btn.closest('.json-block')
      const code = block?.querySelector('code')
      if (!code) return

      try {
        await navigator.clipboard.writeText(code.textContent)

        // Visual feedback
        const original = btn.innerHTML
        btn.classList.add('copied')
        btn.innerHTML = '<span>✓</span> Copied!'

        // Screen reader announcement
        const announcement = document.createElement('span')
        announcement.setAttribute('role', 'status')
        announcement.setAttribute('aria-live', 'polite')
        announcement.className = 'sr-only'
        announcement.textContent = 'Code copied to clipboard'
        document.body.appendChild(announcement)

        setTimeout(() => {
          btn.classList.remove('copied')
          btn.innerHTML = original
          announcement.remove()
        }, 1500)
      } catch {
        // Fallback: select text
        const range = document.createRange()
        range.selectNodeContents(code)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
      }
    })
  })
})()
