import { steamApi } from '../api/steam'
import type { SteamApp } from '../types/steam'

function appCard(app: SteamApp, onClick: (id: number) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-card'
  el.tabIndex = 0

  const priceHtml = app.price
    ? app.price.discount_percent > 0
      ? `<div class="price-row">
          <span class="badge-discount">٪${app.price.discount_percent}-</span>
          <span class="price-final">${app.price.final_formatted}</span>
          <span class="price-original">${app.price.initial_formatted}</span>
         </div>`
      : `<div class="price-row"><span class="price-final">${app.price.final_formatted}</span></div>`
    : '<div class="price-row"><span class="free-label">رایگان</span></div>'

  el.innerHTML = `
    <div class="card-image-wrap">
      <img src="${app.tiny_image}" alt="${app.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${app.name}</h3>
      ${priceHtml}
    </div>
  `

  const go = () => onClick(app.id)
  el.addEventListener('click', go)
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go() })
  return el
}

export function renderSearchView(
  container: HTMLElement,
  onAppClick: (appid: number) => void,
  initialTerm = ''
): void {
  let currentTerm = initialTerm

  container.innerHTML = `
    <div class="section-title">جستجوی بازی</div>
    <div class="search-row">
      <input class="input" id="search-input" type="text" placeholder="نام بازی را بنویسید..." value="${initialTerm}" autocomplete="off" />
      <button class="btn btn-primary" id="search-btn">جستجو</button>
    </div>
    <div id="results" class="game-grid"></div>
    <div id="pager" class="pagination"></div>
  `

  const input = container.querySelector('#search-input') as HTMLInputElement
  const btn = container.querySelector('#search-btn') as HTMLButtonElement

  const doSearch = async (term: string, page: number) => {
    if (!term.trim()) return
    currentTerm = term
    const grid = container.querySelector('#results') as HTMLElement
    const pager = container.querySelector('#pager') as HTMLElement
    grid.innerHTML = Array(6).fill('<div class="skeleton skeleton-card"></div>').join('')
    pager.innerHTML = ''

    try {
      const data = await steamApi.search(term, String(page))
      grid.innerHTML = ''

      if (!data.items?.length) {
        grid.innerHTML = '<p class="empty-msg">نتیجه‌ای پیدا نشد.</p>'
        return
      }

      data.items.forEach((app) => grid.appendChild(appCard(app, onAppClick)))

      const totalPages = Math.ceil(data.total / 25)
      if (totalPages > 1) renderPager(pager, page, totalPages, (p) => doSearch(currentTerm, p))
    } catch {
      grid.innerHTML = '<p class="error-msg">جستجو با خطا مواجه شد.</p>'
    }
  }

  btn.addEventListener('click', () => doSearch(input.value, 1))
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(input.value, 1) })

  if (initialTerm) doSearch(initialTerm, 1)
  else setTimeout(() => input.focus(), 50)
}

function renderPager(
  el: HTMLElement,
  current: number,
  total: number,
  onPage: (p: number) => void
): void {
  el.innerHTML = ''
  const prev = document.createElement('button')
  prev.className = 'btn-page'
  prev.textContent = 'قبلی'
  prev.disabled = current === 1
  prev.onclick = () => onPage(current - 1)

  const info = document.createElement('span')
  info.className = 'page-info'
  info.textContent = `صفحه ${current} از ${total}`

  const next = document.createElement('button')
  next.className = 'btn-page'
  next.textContent = 'بعدی'
  next.disabled = current === total
  next.onclick = () => onPage(current + 1)

  el.append(next, info, prev)
}
