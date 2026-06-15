import { steamApi } from '../api/steam'
import type { SteamApp } from '../types/steam'

let currentTerm = ''

function renderAppCard(app: SteamApp, onClick: (id: number) => void): HTMLElement {
  const card = document.createElement('div')
  card.className = 'game-card'
  card.setAttribute('role', 'button')
  card.setAttribute('tabindex', '0')

  const priceHtml = app.price
    ? app.price.discount_percent > 0
      ? `<div class="price-row">
          <span class="badge-discount">-${app.price.discount_percent}%</span>
          <span class="price-original">${app.price.initial_formatted}</span>
          <span class="price-final">${app.price.final_formatted}</span>
         </div>`
      : `<div class="price-row"><span class="price-final">${app.price.final_formatted}</span></div>`
    : '<div class="price-row"><span class="price-final">Free / N/A</span></div>'

  card.innerHTML = `
    <div class="card-image-wrap">
      <img src="${app.tiny_image}" alt="${app.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${app.name}</h3>
      ${priceHtml}
    </div>
  `

  const activate = () => onClick(app.id)
  card.addEventListener('click', activate)
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate() })

  return card
}

export function renderSearchView(
  container: HTMLElement,
  onAppClick: (appid: number) => void,
  initialTerm = ''
): void {
  currentTerm = initialTerm

  container.innerHTML = `
    <section class="search-section">
      <h2 class="section-title">Search Games</h2>
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Search for a game..." value="${initialTerm}" autocomplete="off" />
        <button id="search-btn" class="btn-primary">Search</button>
      </div>
      <div id="search-results" class="game-grid"></div>
      <div id="pagination" class="pagination"></div>
    </section>
  `

  const input = container.querySelector('#search-input') as HTMLInputElement
  const btn = container.querySelector('#search-btn') as HTMLButtonElement

  const doSearch = async (term: string, page: number) => {
    if (!term.trim()) return
    currentTerm = term

    const grid = container.querySelector('#search-results') as HTMLElement
    const pag = container.querySelector('#pagination') as HTMLElement
    grid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('')
    pag.innerHTML = ''

    try {
      const data = await steamApi.search(term, String(page))
      grid.innerHTML = ''

      if (!data.items || data.items.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No results found.</p>'
        return
      }

      data.items.forEach((app) => grid.appendChild(renderAppCard(app, onAppClick)))

      const totalPages = Math.ceil(data.total / 25)
      if (totalPages > 1) {
        renderPagination(pag, page, totalPages, (p) => doSearch(currentTerm, p))
      }
    } catch {
      grid.innerHTML = '<p class="error-msg">Search failed. Please try again.</p>'
    }
  }

  btn.addEventListener('click', () => doSearch(input.value, 1))
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch(input.value, 1)
  })

  if (initialTerm) {
    doSearch(initialTerm, 1)
  }

  setTimeout(() => input.focus(), 50)
}

function renderPagination(
  container: HTMLElement,
  current: number,
  total: number,
  onPage: (page: number) => void
): void {
  container.innerHTML = ''

  const prev = document.createElement('button')
  prev.className = 'btn-page'
  prev.textContent = '← Prev'
  prev.disabled = current === 1
  prev.addEventListener('click', () => onPage(current - 1))

  const info = document.createElement('span')
  info.className = 'page-info'
  info.textContent = `Page ${current} of ${total}`

  const next = document.createElement('button')
  next.className = 'btn-page'
  next.textContent = 'Next →'
  next.disabled = current === total
  next.addEventListener('click', () => onPage(current + 1))

  container.append(prev, info, next)
}
