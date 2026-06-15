import { steamApi } from '../api/steam'
import type { FeaturedItem, SteamApp } from '../types/steam'

function fmtPrice(p: number, cur: string) {
  return p === 0 ? 'رایگان' : `${cur} ${(p / 100).toFixed(2)}`
}

function featuredCard(item: FeaturedItem, onClick: (id: number) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-card'
  el.tabIndex = 0

  const badge = item.discount_percent > 0
    ? `<span class="badge-discount">٪${item.discount_percent}-</span>` : ''

  const price = item.discount_percent > 0
    ? `<div class="price-row">
        <span class="price-final">${fmtPrice(item.final_price, item.currency)}</span>
        <span class="price-original">${fmtPrice(item.original_price, item.currency)}</span>
       </div>`
    : `<div class="price-row"><span class="${item.final_price === 0 ? 'free-label' : 'price-final'}">${fmtPrice(item.final_price, item.currency)}</span></div>`

  el.innerHTML = `
    <div class="card-image-wrap">
      <img src="${item.header_image || item.small_capsule_image}" alt="${item.name}" loading="lazy" />
      ${badge}
    </div>
    <div class="card-body">
      <h3 class="card-title">${item.name}</h3>
      ${price}
    </div>
  `
  const go = () => onClick(item.id)
  el.addEventListener('click', go)
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go() })
  return el
}

function freeCard(app: SteamApp, onClick: (id: number) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-card'
  el.tabIndex = 0
  el.innerHTML = `
    <div class="card-image-wrap">
      <img src="${app.tiny_image}" alt="${app.name}" loading="lazy" />
      <span class="badge-free">رایگان</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${app.name}</h3>
      <div class="price-row"><span class="free-label">رایگان</span></div>
    </div>
  `
  const go = () => onClick(app.id)
  el.addEventListener('click', go)
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go() })
  return el
}

function skeletons(n: number, cls = 'skeleton-card') {
  return Array(n).fill(`<div class="skeleton ${cls}"></div>`).join('')
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
    <div id="featured-grid" class="game-grid">${skeletons(8)}</div>

    <div class="section-title" style="margin-top:36px">بیشترین تخفیف 🔥</div>
    <div id="deals-grid" class="game-grid">${skeletons(6)}</div>

    <div class="section-title" style="margin-top:36px">بازی‌های رایگان 🎮</div>
    <div id="free-grid" class="game-grid">${skeletons(6, 'skeleton-suggest')}</div>
  `

  // Featured + deals from one API call
  steamApi.getFeatured().then((data) => {
    const all: FeaturedItem[] = [
      ...(data.large_capsules ?? []),
      ...(data.featured_win ?? []),
    ]

    const featGrid = container.querySelector('#featured-grid') as HTMLElement
    const dealGrid = container.querySelector('#deals-grid') as HTMLElement

    const featured = all.slice(0, 10)
    featGrid.innerHTML = ''
    if (featured.length) featured.forEach((item) => featGrid.appendChild(featuredCard(item, onAppClick)))
    else featGrid.innerHTML = '<p class="empty-msg">بازی‌ای یافت نشد.</p>'

    const deals = [...all]
      .filter((i) => i.discount_percent > 0)
      .sort((a, b) => b.discount_percent - a.discount_percent)
      .slice(0, 8)

    dealGrid.innerHTML = ''
    if (deals.length) deals.forEach((item) => dealGrid.appendChild(featuredCard(item, onAppClick)))
    else dealGrid.innerHTML = '<p class="empty-msg">تخفیفی موجود نیست.</p>'
  }).catch(() => {
    const featGrid = container.querySelector('#featured-grid') as HTMLElement
    featGrid.innerHTML = '<p class="error-msg">خطا در بارگذاری.</p>'
    const dealGrid = container.querySelector('#deals-grid') as HTMLElement
    dealGrid.innerHTML = '<p class="error-msg">خطا در بارگذاری.</p>'
  })

  // Free games — separate call
  steamApi.getFreeGames().then((data) => {
    const freeGrid = container.querySelector('#free-grid') as HTMLElement
    freeGrid.innerHTML = ''
    const free = (data.items ?? []).filter((a) => !a.price || a.price.final === 0).slice(0, 8)
    if (free.length) free.forEach((app) => freeGrid.appendChild(freeCard(app, onAppClick)))
    else freeGrid.innerHTML = '<p class="empty-msg">بازی رایگانی یافت نشد.</p>'
  }).catch(() => {
    const freeGrid = container.querySelector('#free-grid') as HTMLElement
    freeGrid.innerHTML = '<p class="error-msg">خطا در بارگذاری.</p>'
  })
}
