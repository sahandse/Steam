import { steamApi } from '../api/steam'
import type { FeaturedItem } from '../types/steam'

function fmtPrice(price: number, currency: string): string {
  if (price === 0) return 'رایگان'
  return `${currency} ${(price / 100).toFixed(2)}`
}

function gameCard(item: FeaturedItem, onClick: (id: number) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-card'
  el.tabIndex = 0

  const discount = item.discount_percent > 0
    ? `<span class="badge-discount">٪${item.discount_percent}-</span>` : ''

  const priceHtml = item.discount_percent > 0
    ? `<div class="price-row">
        <span class="price-final">${fmtPrice(item.final_price, item.currency)}</span>
        <span class="price-original">${fmtPrice(item.original_price, item.currency)}</span>
       </div>`
    : `<div class="price-row"><span class="${item.final_price === 0 ? 'free-label' : 'price-final'}">${fmtPrice(item.final_price, item.currency)}</span></div>`

  el.innerHTML = `
    <div class="card-image-wrap">
      <img src="${item.header_image || item.small_capsule_image}" alt="${item.name}" loading="lazy" />
      ${discount}
    </div>
    <div class="card-body">
      <h3 class="card-title">${item.name}</h3>
      ${priceHtml}
    </div>
  `

  const go = () => onClick(item.id)
  el.addEventListener('click', go)
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go() })
  return el
}

export async function renderHomeView(
  container: HTMLElement,
  onAppClick: (appid: number) => void
): Promise<void> {
  container.innerHTML = `
    <div class="hero">
      <h1>دنیای بازی را کشف کن</h1>
      <p>جستجو، قیمت‌ها و بازار استیم — همه در یک جا</p>
    </div>
    <div class="section-title">ویژه و پیشنهادی</div>
    <div class="game-grid">
      ${Array(8).fill('<div class="skeleton skeleton-card"></div>').join('')}
    </div>
  `

  try {
    const data = await steamApi.getFeatured()
    const items: FeaturedItem[] = [
      ...(data.large_capsules ?? []),
      ...(data.featured_win ?? []),
    ].slice(0, 12)

    const grid = container.querySelector('.game-grid') as HTMLElement
    grid.innerHTML = ''

    if (!items.length) {
      grid.innerHTML = '<p class="empty-msg">بازی‌ای یافت نشد.</p>'
      return
    }
    items.forEach((item) => grid.appendChild(gameCard(item, onAppClick)))
  } catch {
    const grid = container.querySelector('.game-grid') as HTMLElement
    grid.innerHTML = '<p class="error-msg">خطا در بارگذاری. لطفاً دوباره تلاش کنید.</p>'
  }
}
