import { steamApi } from '../api/steam'
import type { MarketItem } from '../types/steam'

const GAMES = [
  { fa: 'CS2', appid: '730' },
  { fa: 'Dota 2', appid: '570' },
  { fa: 'TF2', appid: '440' },
  { fa: 'Rust', appid: '252490' },
  { fa: 'Apex', appid: '1172470' },
]

const PAGE = 20

function marketCard(item: MarketItem): HTMLElement {
  const el = document.createElement('div')
  el.className = 'market-card'

  const icon = item.asset_description?.icon_url
    ? `<img src="https://community.cloudflare.steamstatic.com/economy/image/${item.asset_description.icon_url}/96fx96f" alt="" />`
    : '?'

  const color = item.asset_description?.name_color
    ? `#${item.asset_description.name_color}`
    : 'var(--text)'

  el.innerHTML = `
    <div class="market-icon">${icon}</div>
    <div class="market-info">
      <div class="market-name" style="color:${color}">${item.name}</div>
      <div class="market-type">${item.asset_description?.type ?? ''}</div>
      <div class="market-meta">
        <span class="market-price">${item.sell_price_text}</span>
        <span class="market-count">${item.sell_listings.toLocaleString()} آیتم</span>
      </div>
    </div>
  `
  return el
}

export function renderMarketView(container: HTMLElement): void {
  container.innerHTML = `
    <div class="section-title">بازار استیم</div>
    <div class="market-controls">
      <div class="game-tabs">
        ${GAMES.map((g, i) =>
          `<button class="tab-btn${i === 0 ? ' active' : ''}" data-appid="${g.appid}">${g.fa}</button>`
        ).join('')}
      </div>
      <div class="search-row">
        <input class="input" id="market-input" type="text" placeholder="جستجوی آیتم..." autocomplete="off" />
        <button class="btn btn-primary" id="market-btn">جستجو</button>
      </div>
    </div>
    <div id="market-list" class="market-list">
      ${Array(8).fill('<div class="skeleton skeleton-market"></div>').join('')}
    </div>
    <div id="market-pager" class="pagination"></div>
  `

  let appid = '730'
  let query = ''

  const search = async (q: string, aid: string, start: number) => {
    query = q
    appid = aid
    const list = container.querySelector('#market-list') as HTMLElement
    const pager = container.querySelector('#market-pager') as HTMLElement
    list.innerHTML = Array(8).fill('<div class="skeleton skeleton-market"></div>').join('')
    pager.innerHTML = ''

    try {
      const data = await steamApi.searchMarket(q, aid, String(start))
      list.innerHTML = ''

      if (!data.success || !data.results?.length) {
        list.innerHTML = '<p class="empty-msg">آیتمی یافت نشد.</p>'
        return
      }

      data.results.forEach((item: MarketItem) => list.appendChild(marketCard(item)))

      if (data.total_count > PAGE) renderPager(pager, start, data.total_count, (s) => search(query, appid, s))
    } catch {
      list.innerHTML = '<p class="error-msg">بارگذاری بازار با خطا مواجه شد.</p>'
    }
  }

  container.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      search(query, (btn as HTMLElement).dataset.appid ?? '730', 0)
    })
  })

  const input = container.querySelector('#market-input') as HTMLInputElement
  const btn = container.querySelector('#market-btn') as HTMLButtonElement
  btn.addEventListener('click', () => search(input.value, appid, 0))
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') search(input.value, appid, 0) })

  search('', '730', 0)
}

function renderPager(el: HTMLElement, start: number, total: number, go: (s: number) => void): void {
  el.innerHTML = ''
  const page = Math.floor(start / PAGE) + 1
  const pages = Math.ceil(total / PAGE)

  const prev = document.createElement('button')
  prev.className = 'btn-page'
  prev.textContent = 'قبلی'
  prev.disabled = start === 0
  prev.onclick = () => go(Math.max(0, start - PAGE))

  const info = document.createElement('span')
  info.className = 'page-info'
  info.textContent = `${page} از ${pages} (${total.toLocaleString()} آیتم)`

  const next = document.createElement('button')
  next.className = 'btn-page'
  next.textContent = 'بعدی'
  next.disabled = start + PAGE >= total
  next.onclick = () => go(start + PAGE)

  el.append(next, info, prev)
}
