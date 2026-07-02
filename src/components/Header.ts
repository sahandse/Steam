import type { View } from '../types/steam'
import { getWishlist } from '../utils/wishlist'

export function renderHeader(onNavigate: (view: View) => void, activeView: View): HTMLElement {
  const header = document.createElement('header')
  header.className = 'app-header'

  const wishCount = getWishlist().length

  const navItems: { label: string; view: View }[] = [
    { label: 'خانه', view: 'home' },
    { label: 'جستجو', view: 'search' },
    { label: 'پیشنهاد', view: 'suggest' },
    { label: 'بازار', view: 'market' },
  ]

  header.innerHTML = `
    <div class="header-inner">
      <nav class="nav-links">
        ${navItems.map(({ label, view }) =>
          `<button class="nav-btn${view === activeView ? ' active' : ''}" data-view="${view}">${label}</button>`
        ).join('')}
        <button class="nav-btn nav-wish${activeView === 'wishlist' ? ' active' : ''}" data-view="wishlist">
          ♥<span class="wish-badge${wishCount > 0 ? ' has-items' : ''}">${wishCount > 0 ? wishCount : ''}</span>
        </button>
      </nav>
      <div class="logo" role="button" tabindex="0">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="10" stroke="#5b8def" stroke-width="1.5"/>
          <circle cx="11" cy="11" r="5.5" fill="#5b8def"/>
          <circle cx="11" cy="11" r="2.2" fill="#0c0c0c"/>
        </svg>
        استیم
      </div>
    </div>
  `

  header.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      onNavigate((btn as HTMLElement).dataset.view as View)
    })
  })

  const logo = header.querySelector('.logo') as HTMLElement
  logo.addEventListener('click', () => onNavigate('home'))
  logo.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter') onNavigate('home') })

  return header
}
