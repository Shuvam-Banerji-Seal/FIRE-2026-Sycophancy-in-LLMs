// logo.js - Reusable logo component
// Usage: <div data-logo="loader|main"></div>

function getLogoPath() {
  // Detect depth: if we're in pages/, go up one level
  const path = window.location.pathname
  const inSubfolder = path.includes('/pages/')
  return inSubfolder ? '../assets/logo.svg' : 'assets/logo.svg'
}

const LOGO_HTML = `
  <img class="logo-mark" src="" alt="Sycophancy Logo">
  <div class="wordmark">SYCO<span>PHANCY</span></div>
  <div class="subtitle">Shared Task on Detecting LLM Sycophancy</div>
  <div class="track-info">FIRE 2026 — Forum for Information Retrieval and Evaluation</div>
`

function initLogos() {
  const logoPath = getLogoPath()
  document.querySelectorAll('[data-logo]').forEach(el => {
    const variant = el.dataset.logo // "loader" or "main"
    el.classList.add('logo-container', `${variant}-logo`)
    el.innerHTML = LOGO_HTML
    // Set correct path after injection
    el.querySelector('.logo-mark').src = logoPath
  })
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogos)
} else {
  initLogos()
}
