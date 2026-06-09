// scrollspy.js — Task page sidebar active section tracking

(function () {
  'use strict'

  const sidebar = document.querySelector('.sidebar__nav')
  if (!sidebar) return

  const links = sidebar.querySelectorAll('.sidebar__link')
  const sections = []

  links.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '')
    const section = id ? document.getElementById(id) : null
    if (section) {
      sections.push({ link, section })
    }
  })

  if (sections.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const id = entry.target.id
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        })

        // Update counter
        const counter = document.querySelector('.sidebar__counter')
        if (counter) {
          const idx = sections.findIndex(s => s.section.id === id)
          counter.textContent = `${idx + 1} / ${sections.length} sections`
        }
      })
    },
    {
      threshold: 0,
      rootMargin: '-80px 0px -60% 0px',
    }
  )

  sections.forEach(({ section }) => observer.observe(section))

  // Smooth scroll on click
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href')?.replace('#', '')
      const section = id ? document.getElementById(id) : null
      if (section) {
        e.preventDefault()
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.pushState(null, '', `#${id}`)
      }
    })
  })
})()
