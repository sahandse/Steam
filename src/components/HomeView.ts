import { steamApi } from '../api/steam'
import type { FeaturedItem } from '../types/steam'

function formatPrice(price: number, currency: string): string {
  if (price === 0) return 'Free'
  return `${currency} ${(price / 100).toFixed(2)}`
}

function renderFeaturedCard(item: FeaturedItem, onClick: (id: number) => void): HTMLElement {
  const card = document.createElement('div')
  card.className = 'game-card'
  card.setAttribute('role', 'button')
  card.setAttribute('tabindex', '0')

  const discount = item.discount_percent > 0
    ? `<span class="badge-discount">-${item.discount_percent}%</span>`
    : ''

  const priceHtml = item.discount_percent > 0
    ? `<div class="price-row">
        <span class="price-original">${formatPrice(item.original_price, item.currency)}</span>
        <span class="price-final">${formatPrice(item.final_price, item.currency)}</span>
       </div>`
    : `<div class="price-row"><span class="price-final">${formatPrice(item.final_price, item.currency)}</span></div>`

  card.innerHTML = `
    <div class="card-image-wrap">
      <img src="${item.header_image || item.small_capsule_image}" alt="${item.name}" loading="lazy" />
      ${discount}
    </div>
    <div class="card-body">
      <h3 class="card-title">${item.name}</h3>
      ${priceHtml}
    </div>
  `

  const activate = () => onClick(item.id)
  card.addEventListener('click', activate)
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate() })

  return card
}

export async function renderHomeView(
  container: HTMLElement,
  onAppClick: (appid: number) => void
): Promise<void> {
  container.innerHTML = `
    <section class="hero">
      <h1>Explore the Steam Store</h1>
      <p>Discover games, check prices, and browse the marketplace.</p>
    </section>
    <section class="section">
      <h2 class="section-title">Featured &amp; Recommended</h2>
      <div class="game-grid loading-grid">
        ${Array(6).fill('<div class="skeleton-card"></div>').join('')}
      </div>
    </section>
  `

  try {
    const data = await steamApi.getFeatured()
    const items: FeaturedItem[] = [
      ...(data.large_capsules || []),
      ...(data.featured_win || []),
    ].slice(0, 12)

    const grid = container.querySelector('.game-grid') as HTMLElement
    grid.className = 'game-grid'
    grid.innerHTML = ''

    if (items.length === 0) {
      grid.innerHTML = '<p class="empty-msg">No featured games found.</p>'
      return
    }

    items.forEach((item) => {
      grid.appendChild(renderFeaturedCard(item, onAppClick))
    })
  } catch {
    const grid = container.querySelector('.game-grid') as HTMLElement
    grid.innerHTML = '<p class="error-msg">Failed to load featured games. Try refreshing.</p>'
  }
}
