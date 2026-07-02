import { steamApi } from '../api/steam'
import type { DLCBasicInfo, Review, ReviewSummary, AchievementPercent, SteamApp } from '../types/steam'
import { isInWishlist, toggleWishlist } from '../utils/wishlist'

const SCORE_FA: Record<string, string> = {
  'Overwhelmingly Positive': 'بی‌نهایت مثبت',
  'Very Positive': 'بسیار مثبت',
  'Mostly Positive': 'عمدتاً مثبت',
  'Positive': 'مثبت',
  'Mixed': 'مختلط',
  'Mostly Negative': 'عمدتاً منفی',
  'Negative': 'منفی',
  'Very Negative': 'بسیار منفی',
  'Overwhelmingly Negative': 'بی‌نهایت منفی',
}

function scoreColor(n: number) {
  return n >= 75 ? '#4caf78' : n >= 50 ? '#d4a843' : '#e05252'
}
function fmtTime(min: number) {
  return min < 60 ? `${min} دقیقه` : `${Math.round(min / 60)} ساعت`
}
function fmtPlayers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(Math.round(n / 100) / 10).toFixed(1)}K`
  return n.toLocaleString()
}
function fmtAchName(name: string): string {
  return name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function renderReviewSummary(s: ReviewSummary): string {
  const pct = s.total_reviews > 0 ? Math.round((s.total_positive / s.total_reviews) * 100) : 0
  const label = SCORE_FA[s.review_score_desc] ?? s.review_score_desc
  const color = scoreColor(pct)
  return `
    <div class="review-summary">
      <div class="review-bar-wrap"><div class="review-bar" style="width:${pct}%;background:${color}"></div></div>
      <div class="review-meta">
        <span style="color:${color};font-weight:700">${label}</span>
        <span class="review-counts">${s.total_positive.toLocaleString()} مثبت از ${s.total_reviews.toLocaleString()}</span>
      </div>
    </div>`
}

function renderReviewCard(r: Review): string {
  const date = new Date(r.timestamp_created * 1000).toLocaleDateString('fa-IR')
  const thumb = r.voted_up ? '👍' : '👎'
  const short = r.review.length > 260 ? r.review.slice(0, 260) + '…' : r.review
  return `
    <div class="review-card">
      <div class="review-header">
        <span class="review-vote">${thumb}</span>
        <span class="review-time">${fmtTime(r.author.playtime_at_review ?? r.author.playtime_forever)} بازی کرده</span>
        <span class="review-date">${date}</span>
      </div>
      <p class="review-text">${short.replace(/</g, '&lt;')}</p>
    </div>`
}

function renderDLCCard(info: DLCBasicInfo): string {
  const price = info.is_free ? '<span class="free-label">رایگان</span>'
    : info.price_overview
      ? info.price_overview.discount_percent > 0
        ? `<span class="badge-discount">٪${info.price_overview.discount_percent}-</span><span class="price-final">${info.price_overview.final_formatted}</span>`
        : `<span class="price-final">${info.price_overview.final_formatted}</span>`
      : ''
  return `
    <div class="dlc-card">
      <img src="${info.header_image}" alt="${info.name}" loading="lazy" />
      <div class="dlc-info">
        <div class="dlc-name">${info.name}</div>
        <div class="price-row">${price}</div>
      </div>
    </div>`
}

function renderAchievements(list: AchievementPercent[]): string {
  if (!list.length) return '<p class="empty-msg">دستاوردی یافت نشد.</p>'
  const sorted = [...list].sort((a, b) => b.percent - a.percent)
  const common = sorted.slice(0, 5)
  const rare = sorted.slice(-5).reverse()

  const row = (a: AchievementPercent) => `
    <div class="ach-row">
      <div class="ach-name">${fmtAchName(a.name)}</div>
      <div class="ach-bar-wrap">
        <div class="ach-bar" style="width:${Math.max(a.percent, 0.5)}%"></div>
      </div>
      <div class="ach-pct">${a.percent.toFixed(1)}٪</div>
    </div>`

  return `
    <div class="ach-group">
      <div class="ach-group-label">آسان‌ترین (بیشترین بازیکن)</div>
      ${common.map(row).join('')}
    </div>
    <div class="ach-group" style="margin-top:16px">
      <div class="ach-group-label">نادرترین (کمترین بازیکن)</div>
      ${rare.map(row).join('')}
    </div>
    <p class="ach-total">مجموع: ${list.length} دستاورد</p>`
}

function similarCard(app: SteamApp, onClick: (id: number) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-card'
  el.tabIndex = 0
  const price = app.price
    ? app.price.discount_percent > 0
      ? `<span class="badge-discount">٪${app.price.discount_percent}-</span><span class="price-final">${app.price.final_formatted}</span>`
      : `<span class="price-final">${app.price.final_formatted}</span>`
    : '<span class="free-label">رایگان</span>'
  el.innerHTML = `
    <div class="card-image-wrap"><img src="${app.tiny_image}" alt="${app.name}" loading="lazy" /></div>
    <div class="card-body">
      <h3 class="card-title">${app.name}</h3>
      <div class="price-row">${price}</div>
    </div>`
  const go = () => onClick(app.id)
  el.addEventListener('click', go)
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go() })
  return el
}

export async function renderDetailsView(
  container: HTMLElement,
  appid: number,
  onBack: () => void,
  onAppClick: (id: number) => void = () => {}
): Promise<void> {
  container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>در حال بارگذاری...</p></div>`

  try {
    const app = await steamApi.getAppDetails(appid)
    if (!app) {
      container.innerHTML = `<button class="btn-back" id="back">بازگشت</button><p class="error-msg">اطلاعات بازی یافت نشد.</p>`
      container.querySelector('#back')?.addEventListener('click', onBack)
      return
    }

    const priceHtml = app.price_overview
      ? app.price_overview.discount_percent > 0
        ? `<div class="price-block">
            <span class="badge-discount">٪${app.price_overview.discount_percent}-</span>
            <span class="price-final">${app.price_overview.final_formatted}</span>
            <span class="price-original">${app.price_overview.initial_formatted}</span>
           </div>`
        : `<div class="price-block"><span class="price-final">${app.price_overview.final_formatted}</span></div>`
      : app.is_free ? `<div class="price-block"><span class="free-label">رایگان</span></div>` : ''

    const genres = (app.genres ?? []).map((g) => `<span class="tag">${g.description}</span>`).join('')
    const cats = (app.categories ?? []).slice(0, 5).map((c) => `<span class="tag">${c.description}</span>`).join('')

    const meta = app.metacritic
      ? `<div class="metacritic-block">
          <div class="mc-score" style="background:${scoreColor(app.metacritic.score)}">${app.metacritic.score}</div>
          <div><div style="font-weight:600;color:var(--text)">Metacritic</div><div style="font-size:.78rem">امتیاز منتقدان</div></div>
         </div>` : ''

    const shots = (app.screenshots ?? []).slice(0, 4)
      .map((s) => `<img src="${s.path_thumbnail}" class="screenshot" loading="lazy" alt="" />`).join('')

    container.innerHTML = `
      <button class="btn-back" id="back">بازگشت</button>
      <div class="details-wrap">
        <div class="details-hero">
          <img src="${app.header_image}" alt="${app.name}" />
          <div class="details-hero-overlay">
            <h1 class="details-title">${app.name}</h1>
            ${priceHtml}
          </div>
        </div>

        <div class="details-body">
          <div class="details-main">
            <p class="short-desc">${app.short_description}</p>
            <div class="tags-row">${genres}${cats}</div>
            ${shots ? `<div class="sub-heading">تصاویر</div><div class="screenshots-grid">${shots}</div>` : ''}
            <div class="sub-heading">درباره بازی</div>
            <div class="long-desc">${app.detailed_description}</div>

            <div class="sub-heading" style="margin-top:28px">نقد و بررسی کاربران</div>
            <div id="reviews-section"><div class="loading-state" style="min-height:60px"><div class="spinner"></div></div></div>

            <div class="sub-heading" style="margin-top:28px">
              دستاوردها
              <button class="ach-toggle-btn" id="ach-toggle">نمایش</button>
            </div>
            <div id="ach-section" style="display:none"></div>

            <div id="dlc-section"></div>

            <!-- Similar games -->
            <div class="sub-heading" style="margin-top:28px">بازی‌های مشابه</div>
            <div id="similar-grid" class="game-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
              ${Array(4).fill('<div class="skeleton skeleton-card"></div>').join('')}
            </div>
          </div>

          <aside class="details-sidebar">
            ${meta}

            <!-- Wishlist button -->
            <button class="wishlist-btn" id="wishlist-btn">
              <span id="wish-icon">${isInWishlist(appid) ? '♥' : '♡'}</span>
              <span id="wish-label">${isInWishlist(appid) ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}</span>
            </button>

            <!-- Live players -->
            <div class="stat-block" id="players-block">
              <div class="loading-state" style="min-height:70px"><div class="spinner"></div></div>
            </div>

            <div class="info-block">
              <div class="info-row"><span class="info-label">سازنده</span><span class="info-value">${app.developers?.join('، ') ?? '—'}</span></div>
              <div class="info-row"><span class="info-label">ناشر</span><span class="info-value">${app.publishers?.join('، ') ?? '—'}</span></div>
              <div class="info-row"><span class="info-label">تاریخ انتشار</span><span class="info-value">${app.release_date?.date ?? '—'}</span></div>
              <div class="info-row"><span class="info-label">نوع</span><span class="info-value">${app.type}</span></div>
              ${app.dlc?.length ? `<div class="info-row"><span class="info-label">DLC</span><span class="info-value">${app.dlc.length} عدد</span></div>` : ''}
            </div>

            <a href="https://store.steampowered.com/app/${appid}" target="_blank" rel="noopener noreferrer" class="steam-link">
              مشاهده در استیم ↗
            </a>
          </aside>
        </div>
      </div>
    `

    container.querySelector('#back')?.addEventListener('click', onBack)

    // ── Wishlist toggle ──
    const wishBtn = container.querySelector('#wishlist-btn') as HTMLButtonElement
    const wishIcon = container.querySelector('#wish-icon') as HTMLElement
    const wishLabel = container.querySelector('#wish-label') as HTMLElement
    wishBtn.addEventListener('click', () => {
      const price = app.price_overview?.final_formatted ?? (app.is_free ? 'رایگان' : '—')
      const added = toggleWishlist({ id: appid, name: app.name, image: app.header_image, price })
      wishIcon.textContent = added ? '♥' : '♡'
      wishLabel.textContent = added ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'
      wishBtn.classList.toggle('active', added)
    })
    if (isInWishlist(appid)) wishBtn.classList.add('active')

    // ── Similar games ──
    const similarGrid = container.querySelector('#similar-grid') as HTMLElement
    const firstGenre = app.genres?.[0]?.description
    if (firstGenre) {
      steamApi.search(firstGenre).then((data) => {
        similarGrid.innerHTML = ''
        const similar = (data.items ?? []).filter((a) => a.id !== appid).slice(0, 8)
        if (similar.length) similar.forEach((a) => similarGrid.appendChild(similarCard(a, onAppClick)))
        else similarGrid.innerHTML = '<p class="empty-msg">بازی مشابهی یافت نشد.</p>'
      }).catch(() => { similarGrid.innerHTML = '' })
    } else {
      similarGrid.innerHTML = ''
    }

    // ── Current players (sidebar) ──
    const playersEl = container.querySelector('#players-block') as HTMLElement
    steamApi.getCurrentPlayers(appid).then((data) => {
      const count = data.response?.player_count ?? 0
      playersEl.innerHTML = `
        <div class="players-header">
          <span class="pulse-dot"></span>
          <span class="players-label">بازیکنان آنلاین</span>
        </div>
        <div class="players-count">${fmtPlayers(count)}</div>
        <div class="players-exact">${count.toLocaleString()} نفر در حال حاضر</div>
      `
    }).catch(() => { playersEl.innerHTML = '' })

    // ── Reviews ──
    const reviewsEl = container.querySelector('#reviews-section') as HTMLElement
    steamApi.getReviews(appid).then((data) => {
      if (!data?.query_summary) { reviewsEl.innerHTML = ''; return }
      const reviews = (data.reviews ?? []).filter((r) => r.review?.trim().length > 10).slice(0, 6)
      reviewsEl.innerHTML = `
        ${renderReviewSummary(data.query_summary)}
        <div class="reviews-list">
          ${reviews.length ? reviews.map(renderReviewCard).join('') : '<p class="empty-msg">نقدی یافت نشد.</p>'}
        </div>`
    }).catch(() => { reviewsEl.innerHTML = '<p class="error-msg">بارگذاری نقدها ناموفق بود.</p>' })

    // ── Achievements (toggle) ──
    const achSection = container.querySelector('#ach-section') as HTMLElement
    const achToggle = container.querySelector('#ach-toggle') as HTMLButtonElement
    let achLoaded = false
    achToggle.addEventListener('click', async () => {
      const visible = achSection.style.display !== 'none'
      if (visible) {
        achSection.style.display = 'none'
        achToggle.textContent = 'نمایش'
        return
      }
      achSection.style.display = 'block'
      achToggle.textContent = 'بستن'
      if (achLoaded) return
      achLoaded = true
      achSection.innerHTML = '<div class="loading-state" style="min-height:60px"><div class="spinner"></div></div>'
      try {
        const data = await steamApi.getAchievements(appid)
        const list = data.achievementpercentages?.achievements ?? []
        achSection.innerHTML = renderAchievements(list)
      } catch {
        achSection.innerHTML = '<p class="error-msg">دستاوردها در دسترس نیستند.</p>'
      }
    })

    // ── DLC ──
    if (app.dlc?.length) {
      const dlcEl = container.querySelector('#dlc-section') as HTMLElement
      dlcEl.innerHTML = `<div class="sub-heading" style="margin-top:28px">محتوای دانلودی (DLC)</div><div class="loading-state" style="min-height:50px"><div class="spinner"></div></div>`
      steamApi.getDLCIds(appid).then(async (res) => {
        if (!res.dlc?.length) { dlcEl.innerHTML = ''; return }
        const details = await steamApi.getDLCDetails(res.dlc)
        const cards = Object.values(details).filter((d) => d.success).map((d) => renderDLCCard(d.data)).join('')
        dlcEl.innerHTML = `
          <div class="sub-heading" style="margin-top:28px">محتوای دانلودی — ${res.dlc.length} عدد</div>
          <div class="dlc-grid">${cards || '<p class="empty-msg">جزئیات در دسترس نیست.</p>'}</div>`
      }).catch(() => { dlcEl.innerHTML = '' })
    }

  } catch {
    container.innerHTML = `<button class="btn-back" id="back">بازگشت</button><p class="error-msg">بارگذاری با خطا مواجه شد.</p>`
    container.querySelector('#back')?.addEventListener('click', onBack)
  }
}
