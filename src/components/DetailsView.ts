import { steamApi } from '../api/steam'

export async function renderDetailsView(
  container: HTMLElement,
  appid: number,
  onBack: () => void
): Promise<void> {
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>
  `

  try {
    const app = await steamApi.getAppDetails(appid)

    if (!app) {
      container.innerHTML = `
        <button class="btn-back" id="back">بازگشت</button>
        <p class="error-msg">اطلاعات بازی یافت نشد.</p>
      `
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
      : app.is_free
        ? `<div class="price-block"><span class="free-label">رایگان</span></div>`
        : ''

    const genres = (app.genres ?? []).map((g) => `<span class="tag">${g.description}</span>`).join('')
    const cats = (app.categories ?? []).slice(0, 5).map((c) => `<span class="tag">${c.description}</span>`).join('')

    const meta = app.metacritic
      ? `<div class="metacritic-block">
          <div class="mc-score" style="background:${app.metacritic.score >= 75 ? '#4caf78' : app.metacritic.score >= 50 ? '#d4a843' : '#e05252'}">
            ${app.metacritic.score}
          </div>
          <div>
            <div style="font-weight:600;color:var(--text)">Metacritic</div>
            <div style="font-size:.78rem">امتیاز منتقدان</div>
          </div>
        </div>`
      : ''

    const shots = (app.screenshots ?? []).slice(0, 4).map((s) =>
      `<img src="${s.path_thumbnail}" class="screenshot" loading="lazy" alt="" />`
    ).join('')

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
          </div>

          <aside class="details-sidebar">
            ${meta}
            <div class="info-block">
              <div class="info-row">
                <span class="info-label">سازنده</span>
                <span class="info-value">${app.developers?.join('، ') ?? '—'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">ناشر</span>
                <span class="info-value">${app.publishers?.join('، ') ?? '—'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">تاریخ انتشار</span>
                <span class="info-value">${app.release_date?.date ?? '—'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">نوع</span>
                <span class="info-value">${app.type}</span>
              </div>
            </div>
            <a
              href="https://store.steampowered.com/app/${appid}"
              target="_blank"
              rel="noopener noreferrer"
              class="steam-link"
            >مشاهده در استیم ↗</a>
          </aside>
        </div>
      </div>
    `

    container.querySelector('#back')?.addEventListener('click', onBack)
  } catch {
    container.innerHTML = `
      <button class="btn-back" id="back">بازگشت</button>
      <p class="error-msg">بارگذاری اطلاعات با خطا مواجه شد.</p>
    `
    container.querySelector('#back')?.addEventListener('click', onBack)
  }
}
