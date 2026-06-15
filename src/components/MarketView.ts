import { steamApi } from '../api/steam'
import type { MarketItem, PricePoint } from '../types/steam'

const GAMES = [
  { fa: 'CS2', appid: '730' },
  { fa: 'Dota 2', appid: '570' },
  { fa: 'TF2', appid: '440' },
  { fa: 'Rust', appid: '252490' },
  { fa: 'Apex', appid: '1172470' },
]

const PAGE = 20

function buildChart(prices: PricePoint[], prefix: string): string {
  if (prices.length < 2) return '<p class="empty-msg">داده‌ای برای نمایش وجود ندارد.</p>'

  const vals = prices.slice(-90).map((p) => parseFloat(p[1])).filter(Boolean)
  if (!vals.length) return ''

  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const W = 420, H = 110, padL = 52, padR = 10, padT = 12, padB = 24
  const cw = W - padL - padR
  const ch = H - padT - padB

  const pts = vals.map((v, i) => {
    const x = padL + (i / (vals.length - 1)) * cw
    const y = padT + ch - ((v - min) / range) * ch
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const last = vals[vals.length - 1]
  const change = vals.length > 1 ? ((last - vals[0]) / vals[0]) * 100 : 0
  const changeColor = change >= 0 ? '#4caf78' : '#e05252'
  const changeSign = change >= 0 ? '+' : ''

  const area = [`${padL},${padT + ch}`, ...pts, `${padL + cw},${padT + ch}`].join(' ')

  return `
    <div class="chart-wrap">
      <div class="chart-stats">
        <span>کمترین: <b>${prefix}${min.toFixed(2)}</b></span>
        <span style="color:${changeColor}">${changeSign}${change.toFixed(1)}٪</span>
        <span>بیشترین: <b>${prefix}${max.toFixed(2)}</b></span>
      </div>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" class="price-chart">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5b8def" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#5b8def" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="${area}" fill="url(#chartGrad)"/>
        <polyline points="${pts.join(' ')}" fill="none" stroke="#5b8def" stroke-width="1.8" stroke-linejoin="round"/>
        <text x="${padL - 4}" y="${padT + ch}" fill="#555" font-size="9" text-anchor="end">${prefix}${min.toFixed(2)}</text>
        <text x="${padL - 4}" y="${padT + 8}" fill="#555" font-size="9" text-anchor="end">${prefix}${max.toFixed(2)}</text>
        <circle cx="${padL + cw}" cy="${padT + ch - ((last - min) / range) * ch}" r="3" fill="#5b8def"/>
        <text x="${padL + cw}" y="${padT + ch + 16}" fill="#666" font-size="9" text-anchor="end">اکنون: ${prefix}${last.toFixed(2)}</text>
      </svg>
    </div>
  `
}

function marketCard(item: MarketItem, appid: string): HTMLElement {
  const el = document.createElement('div')
  el.className = 'market-card clickable'
  el.dataset.hash = item.hash_name
  el.dataset.appid = appid

  const icon = item.asset_description?.icon_url
    ? `<img src="https://community.cloudflare.steamstatic.com/economy/image/${item.asset_description.icon_url}/96fx96f" alt="" />`
    : '?'
  const color = item.asset_description?.name_color
    ? `#${item.asset_description.name_color}` : 'var(--text)'

  el.innerHTML = `
    <div class="market-icon">${icon}</div>
    <div class="market-info">
      <div class="market-name" style="color:${color}">${item.name}</div>
      <div class="market-type">${item.asset_description?.type ?? ''}</div>
      <div class="market-meta">
        <span class="market-price">${item.sell_price_text}</span>
        <span class="market-count">${item.sell_listings.toLocaleString()} آیتم</span>
        <span class="chart-hint">📈 تاریخچه قیمت</span>
      </div>
    </div>
  `

  let chartEl: HTMLElement | null = null

  el.addEventListener('click', async () => {
    if (chartEl) { chartEl.remove(); chartEl = null; el.classList.remove('expanded'); return }
    el.classList.add('expanded')
    chartEl = document.createElement('div')
    chartEl.className = 'chart-loading'
    chartEl.innerHTML = '<div class="spinner" style="width:24px;height:24px;margin:12px auto"></div>'
    el.after(chartEl)

    try {
      const data = await steamApi.getPriceHistory(appid, item.hash_name)
      if (data.success && data.prices?.length) {
        chartEl.className = 'chart-container'
        chartEl.innerHTML = buildChart(data.prices, data.price_prefix)
      } else {
        chartEl.className = 'chart-container'
        chartEl.innerHTML = '<p class="empty-msg" style="padding:12px 0">تاریخچه قیمت در دسترس نیست.</p>'
      }
    } catch {
      chartEl.className = 'chart-container'
      chartEl.innerHTML = '<p class="error-msg" style="padding:12px 0">خطا در بارگذاری تاریخچه.</p>'
    }
  })

  return el
}

export function renderMarketView(container: HTMLElement): void {
  container.innerHTML = `
    <div class="section-title">بازار استیم</div>
    <div class="market-controls">
      <div class="game-tabs">
        ${GAMES.map((g, i) => `<button class="tab-btn${i === 0 ? ' active' : ''}" data-appid="${g.appid}">${g.fa}</button>`).join('')}
      </div>
      <div class="search-row">
        <input class="input" id="market-input" type="text" placeholder="جستجوی آیتم..." autocomplete="off" />
        <button class="btn btn-primary" id="market-btn">جستجو</button>
      </div>
    </div>
    <p class="market-hint">روی هر آیتم کلیک کنید تا نمودار تاریخچه قیمت آن را ببینید</p>
    <div id="market-list" class="market-list">
      ${Array(8).fill('<div class="skeleton skeleton-market"></div>').join('')}
    </div>
    <div id="market-pager" class="pagination"></div>
  `

  let appid = '730'
  let query = ''

  const search = async (q: string, aid: string, start: number) => {
    query = q; appid = aid
    const list = container.querySelector('#market-list') as HTMLElement
    const pager = container.querySelector('#market-pager') as HTMLElement
    list.innerHTML = Array(8).fill('<div class="skeleton skeleton-market"></div>').join('')
    pager.innerHTML = ''

    try {
      const data = await steamApi.searchMarket(q, aid, String(start))
      list.innerHTML = ''
      if (!data.success || !data.results?.length) {
        list.innerHTML = '<p class="empty-msg">آیتمی یافت نشد.</p>'; return
      }
      data.results.forEach((item: MarketItem) => list.appendChild(marketCard(item, aid)))
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

function renderPager(el: HTMLElement, start: number, total: number, go: (s: number) => void) {
  const page = Math.floor(start / PAGE) + 1, pages = Math.ceil(total / PAGE)
  el.innerHTML = ''
  const prev = document.createElement('button')
  prev.className = 'btn-page'; prev.textContent = 'قبلی'
  prev.disabled = start === 0; prev.onclick = () => go(Math.max(0, start - PAGE))

  const info = document.createElement('span')
  info.className = 'page-info'
  info.textContent = `${page} از ${pages} (${total.toLocaleString()} آیتم)`

  const next = document.createElement('button')
  next.className = 'btn-page'; next.textContent = 'بعدی'
  next.disabled = start + PAGE >= total; next.onclick = () => go(start + PAGE)
  el.append(next, info, prev)
}
