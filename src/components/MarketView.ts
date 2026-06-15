import { steamApi } from '../api/steam'
import type { MarketItem } from '../types/steam'

const GAMES: { label: string; appid: string }[] = [
  { label: 'CS2', appid: '730' },
  { label: 'Dota 2', appid: '570' },
  { label: 'Team Fortress 2', appid: '440' },
  { label: 'Rust', appid: '252490' },
  { label: 'Apex Legends', appid: '1172470' },
]

function renderMarketCard(item: MarketItem): HTMLElement {
  const card = document.createElement('div')
  card.className = 'market-card'

  const iconUrl = item.asset_description?.icon_url
    ? `https://community.cloudflare.steamstatic.com/economy/image/${item.asset_description.icon_url}/96fx96f`
    : ''

  const nameColor = item.asset_description?.name_color
    ? `#${item.asset_description.name_color}`
    : '#c6d4df'

  card.innerHTML = `
    <div class="market-icon-wrap">
      ${iconUrl ? `<img src="${iconUrl}" alt="${item.name}" loading="lazy" />` : '<div class="no-icon">?</div>'}
    </div>
    <div class="market-info">
      <p class="market-name" style="color: ${nameColor}">${item.name}</p>
      <p class="market-type">${item.asset_description?.type ?? ''}</p>
      <div class="market-price-row">
        <span class="market-price">${item.sell_price_text}</span>
        <span class="market-listings">${item.sell_listings.toLocaleString()} listings</span>
      </div>
    </div>
  `

  return card
}

export function renderMarketView(container: HTMLElement): void {
  container.innerHTML = `
    <section class="market-section">
      <h2 class="section-title">Steam Marketplace</h2>
      <div class="market-controls">
        <div class="game-tabs">
          ${GAMES.map((g, i) => `<button class="tab-btn${i === 0 ? ' active' : ''}" data-appid="${g.appid}">${g.label}</button>`).join('')}
        </div>
        <div class="search-bar">
          <input type="text" id="market-search" placeholder="Search items..." autocomplete="off" />
          <button id="market-search-btn" class="btn-primary">Search</button>
        </div>
      </div>
      <div id="market-results" class="market-grid">
        ${Array(8).fill('<div class="skeleton-card market-skeleton"></div>').join('')}
      </div>
      <div id="market-pagination" class="pagination"></div>
    </section>
  `

  let currentAppid = '730'
  let currentQuery = ''
  const PAGE_SIZE = 20

  const doSearch = async (query: string, appid: string, start: number) => {
    currentQuery = query
    currentAppid = appid

    const grid = container.querySelector('#market-results') as HTMLElement
    const pag = container.querySelector('#market-pagination') as HTMLElement
    grid.innerHTML = Array(8).fill('<div class="skeleton-card market-skeleton"></div>').join('')
    pag.innerHTML = ''

    try {
      const data = await steamApi.searchMarket(query, appid, String(start))
      grid.innerHTML = ''

      if (!data.success || !data.results || data.results.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No items found.</p>'
        return
      }

      data.results.forEach((item: MarketItem) => grid.appendChild(renderMarketCard(item)))

      if (data.total_count > PAGE_SIZE) {
        renderMarketPagination(pag, start, data.total_count, PAGE_SIZE, (s) =>
          doSearch(currentQuery, currentAppid, s)
        )
      }
    } catch {
      grid.innerHTML = '<p class="error-msg">Failed to load market items. Try again.</p>'
    }
  }

  container.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      const appid = (btn as HTMLElement).dataset.appid ?? '730'
      doSearch(currentQuery, appid, 0)
    })
  })

  const searchInput = container.querySelector('#market-search') as HTMLInputElement
  const searchBtn = container.querySelector('#market-search-btn') as HTMLButtonElement

  searchBtn.addEventListener('click', () => doSearch(searchInput.value, currentAppid, 0))
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch(searchInput.value, currentAppid, 0)
  })

  doSearch('', '730', 0)
}

function renderMarketPagination(
  container: HTMLElement,
  start: number,
  total: number,
  pageSize: number,
  onPage: (start: number) => void
): void {
  container.innerHTML = ''

  const currentPage = Math.floor(start / pageSize) + 1
  const totalPages = Math.ceil(total / pageSize)

  const prev = document.createElement('button')
  prev.className = 'btn-page'
  prev.textContent = '← Prev'
  prev.disabled = start === 0
  prev.addEventListener('click', () => onPage(Math.max(0, start - pageSize)))

  const info = document.createElement('span')
  info.className = 'page-info'
  info.textContent = `Page ${currentPage} of ${totalPages} (${total.toLocaleString()} items)`

  const next = document.createElement('button')
  next.className = 'btn-page'
  next.textContent = 'Next →'
  next.disabled = start + pageSize >= total
  next.addEventListener('click', () => onPage(start + pageSize))

  container.append(prev, info, next)
}
