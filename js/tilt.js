// tilt.js — 3D card tilt + light-source effect

(function () {
  'use strict'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const width = rect.width
      const height = rect.height

      const tiltX = ((y - height / 2) / height) * 8
      const tiltY = ((x - width / 2) / width) * -8

      card.style.transform = `
        perspective(800px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        translateZ(8px)
      `

      card.style.setProperty('--light-x', `${(x / width) * 100}%`)
      card.style.setProperty('--light-y', `${(y / height) * 100}%`)
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = ''
      card.style.setProperty('--light-x', '50%')
      card.style.setProperty('--light-y', '50%')
    })
  })
})()
