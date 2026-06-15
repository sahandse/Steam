import type { View } from '../types/steam'

export function renderHeader(onNavigate: (view: View) => void): HTMLElement {
  const header = document.createElement('header')
  header.className = 'app-header'
  header.innerHTML = `
    <div class="header-inner">
      <div class="logo" role="button" tabindex="0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#66c0f4" stroke-width="2"/>
          <circle cx="14" cy="14" r="7" fill="#66c0f4"/>
          <circle cx="14" cy="14" r="3" fill="#1b2838"/>
        </svg>
        <span>Steam Explorer</span>
      </div>
      <nav class="nav-links">
        <button class="nav-btn" data-view="home">Home</button>
        <button class="nav-btn" data-view="search">Search</button>
        <button class="nav-btn" data-view="market">Market</button>
      </nav>
    </div>
  `

  header.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = (btn as HTMLElement).dataset.view as View
      onNavigate(view)
    })
  })

  const logo = header.querySelector('.logo') as HTMLElement
  logo.addEventListener('click', () => onNavigate('home'))
  logo.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') onNavigate('home')
  })

  return header
}
