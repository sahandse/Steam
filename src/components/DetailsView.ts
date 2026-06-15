import { steamApi } from '../api/steam'
import type { DLCBasicInfo, Review, ReviewSummary } from '../types/steam'

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

function fmtTime(min: number) {
  return min < 60 ? `${min} دقیقه` : `${Math.round(min / 60)} ساعت`
}

function scoreColor(score: number) {
  if (score >= 75) return '#4caf78'
  if (score >= 50) return '#d4a843'
  return '#e05252'
}

function renderReviewSummary(s: ReviewSummary): string {
  const pct = s.total_reviews > 0
    ? Math.round((s.total_positive / s.total_reviews) * 100) : 0
  const label = SCORE_FA[s.review_score_desc] ?? s.review_score_desc
  const color = scoreColor(pct)
  return `
    <div class="review-summary">
      <div class="review-bar-wrap">
        <div class="review-bar" style="width:${pct}%;background:${color}"></div>
      </div>
      <div class="review-meta">
        <span style="color:${color};font-weight:700">${label}</span>
        <span class="review-counts">${s.total_positive.toLocaleString()} مثبت از ${s.total_reviews.toLocaleString()} نقد</span>
      </div>
    </div>
  `
}

function renderReviewCard(r: Review): string {
  const date = new Date(r.timestamp_created * 1000).toLocaleDateString('fa-IR')
  const playtime = fmtTime(r.author.playtime_at_review ?? r.author.playtime_forever)
  const thumb = r.voted_up ? '👍' : '👎'
  const short = r.review.length > 280 ? r.review.slice(0, 280) + '...' : r.review
  return `
    <div class="review-card">
      <div class="review-header">
        <span class="review-vote">${thumb}</span>
        <span class="review-time">${playtime} بازی کرده</span>
        <span class="review-date">${date}</span>
      </div>
      <p class="review-text">${short.replace(/</g, '&lt;')}</p>
    </div>
  `
}

function renderDLCCard(info: DLCBasicInfo): string {
  const price = info.is_free
    ? '<span class="free-label">رایگان</span>'
    : info.price_overview
      ? info.price_overview.discount_percent > 0
        ? `<span class="badge-discount">٪${info.price_overview.discount_percent}-</span>
           <span class="price-final">${info.price_overview.final_formatted}</span>`
        : `<span class="price-final">${info.price_overview.final_formatted}</span>`
      : ''

  return `
    <div class="dlc-card">
      <img src="${info.header_image}" alt="${info.name}" loading="lazy" />
      <div class="dlc-info">
        <div class="dlc-name">${info.name}</div>
        <div class="price-row">${price}</div>
      </div>
    </div>
  `
}

export async function renderDetailsView(
  container: HTMLElement,
  appid: number,
  onBack: () => void
): Promise<void> {
  container.innerHTML = `
    <div class="loading-state"><div class="spinner"></div><p>در حال بارگذاری...</p></div>
  `

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
         </div>`
      : ''

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

            <!-- Reviews section -->
            <div class="sub-heading" style="margin-top:28px">نقد و بررسی کاربران</div>
            <div id="reviews-section"><div class="loading-state" style="min-height:80px"><div class="spinner"></div></div></div>

            <!-- DLC section (only if has dlc) -->
            <div id="dlc-section"></div>
          </div>

          <aside class="details-sidebar">
            ${meta}
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
            <a href="https://store.steampowered.com/app/${appid}#app_reviews_hash" target="_blank" rel="noopener noreferrer" class="steam-link" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text)">
              پخش زنده ↗
            </a>
          </aside>
        </div>
      </div>
    `

    container.querySelector('#back')?.addEventListener('click', onBack)

    // Load reviews async
    const reviewsEl = container.querySelector('#reviews-section') as HTMLElement
    steamApi.getReviews(appid).then((data) => {
      if (!data?.query_summary) { reviewsEl.innerHTML = ''; return }
      const reviews = (data.reviews ?? []).filter((r) => r.review?.trim().length > 10).slice(0, 6)
      reviewsEl.innerHTML = `
        ${renderReviewSummary(data.query_summary)}
        <div class="reviews-list">
          ${reviews.length ? reviews.map(renderReviewCard).join('') : '<p class="empty-msg">نقدی یافت نشد.</p>'}
        </div>
      `
    }).catch(() => { reviewsEl.innerHTML = '<p class="error-msg">بارگذاری نقدها ناموفق بود.</p>' })

    // Load DLC async
    if (app.dlc?.length) {
      const dlcEl = container.querySelector('#dlc-section') as HTMLElement
      dlcEl.innerHTML = `<div class="sub-heading" style="margin-top:28px">محتوای دانلودی (DLC)</div><div class="loading-state" style="min-height:60px"><div class="spinner"></div></div>`
      steamApi.getDLCIds(appid).then(async (res) => {
        if (!res.dlc?.length) { dlcEl.innerHTML = ''; return }
        const details = await steamApi.getDLCDetails(res.dlc)
        const cards = Object.values(details)
          .filter((d) => d.success)
          .map((d) => renderDLCCard(d.data))
          .join('')
        dlcEl.innerHTML = `
          <div class="sub-heading" style="margin-top:28px">محتوای دانلودی (DLC) — ${res.dlc.length} عدد</div>
          <div class="dlc-grid">${cards || '<p class="empty-msg">جزئیات DLC در دسترس نیست.</p>'}</div>
        `
      }).catch(() => { dlcEl.innerHTML = '' })
    }

  } catch {
    container.innerHTML = `<button class="btn-back" id="back">بازگشت</button><p class="error-msg">بارگذاری با خطا مواجه شد.</p>`
    container.querySelector('#back')?.addEventListener('click', onBack)
  }
}
