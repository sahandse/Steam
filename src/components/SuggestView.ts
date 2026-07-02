import { steamApi } from '../api/steam'
import type { SteamApp } from '../types/steam'

const GENRES: { fa: string; en: string }[] = [
  { fa: 'اکشن', en: 'action' },
  { fa: 'ماجراجویی', en: 'adventure' },
  { fa: 'نقش‌آفرینی', en: 'RPG' },
  { fa: 'استراتژی', en: 'strategy' },
  { fa: 'شبیه‌ساز', en: 'simulation' },
  { fa: 'ترسناک', en: 'horror' },
  { fa: 'پازل', en: 'puzzle' },
  { fa: 'ورزشی', en: 'sports' },
  { fa: 'مسابقه‌ای', en: 'racing' },
  { fa: 'رایگان', en: 'free to play' },
]

function appCard(app: SteamApp, onClick: (id: number) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-card'
  el.tabIndex = 0

  const priceHtml = app.price
    ? app.price.discount_percent > 0
      ? `<div class="price-row">
          <span class="badge-discount">٪${app.price.discount_percent}-</span>
          <span class="price-final">${app.price.final_formatted}</span>
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

export function renderSuggestView(
  container: HTMLElement,
  onAppClick: (appid: number) => void
): void {
  let activeGenre = GENRES[0]

  let currentItems: SteamApp[] = []

  container.innerHTML = `
    <div class="section-title">پیشنهاد بازی</div>
    <div class="suggest-genres">
      ${GENRES.map((g, i) =>
        `<button class="genre-btn${i === 0 ? ' active' : ''}" data-en="${g.en}">${g.fa}</button>`
      ).join('')}
    </div>
    <div class="suggest-header">
      <span id="genre-label" style="font-size:.9rem;color:var(--muted)">بازی‌های ${activeGenre.fa}</span>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="result-count" class="suggest-count"></span>
        <button id="random-btn" class="btn-random" title="بازی تصادفی">🎲 تصادفی</button>
      </div>
    </div>
    <div id="suggest-grid" class="game-grid">
      ${Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join('')}
    </div>
  `

  const load = async (genre: { fa: string; en: string }) => {
    activeGenre = genre
    const grid = container.querySelector('#suggest-grid') as HTMLElement
    const label = container.querySelector('#genre-label') as HTMLElement
    const count = container.querySelector('#result-count') as HTMLElement
    grid.innerHTML = Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join('')
    label.textContent = `بازی‌های ${genre.fa}`
    count.textContent = ''
    currentItems = []

    try {
      const data = await steamApi.search(genre.en, String(Math.floor(Math.random() * 3) + 1))
      grid.innerHTML = ''

      if (!data.items?.length) {
        grid.innerHTML = '<p class="empty-msg">بازی‌ای در این دسته یافت نشد.</p>'
        return
      }

      const shuffled = [...data.items].sort(() => Math.random() - 0.5).slice(0, 12)
      currentItems = shuffled
      shuffled.forEach((app) => grid.appendChild(appCard(app, onAppClick)))
      count.textContent = `${data.total} بازی`
    } catch {
      grid.innerHTML = '<p class="error-msg">خطا در بارگذاری پیشنهادات.</p>'
    }
  }

  container.querySelector('#random-btn')!.addEventListener('click', () => {
    if (!currentItems.length) return
    const pick = currentItems[Math.floor(Math.random() * currentItems.length)]
    onAppClick(pick.id)
  })

  container.querySelectorAll('.genre-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.genre-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      const en = (btn as HTMLElement).dataset.en ?? ''
      const fa = btn.textContent ?? ''
      load({ fa, en })
    })
  })

  load(activeGenre)
}
