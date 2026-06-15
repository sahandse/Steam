import { steamApi } from '../api/steam'

export async function renderDetailsView(
  container: HTMLElement,
  appid: number,
  onBack: () => void
): Promise<void> {
  container.innerHTML = `
    <div class="details-loading">
      <div class="spinner"></div>
      <p>Loading game details...</p>
    </div>
  `

  try {
    const app = await steamApi.getAppDetails(appid)

    if (!app) {
      container.innerHTML = `
        <div class="error-state">
          <p class="error-msg">Could not load game details.</p>
          <button class="btn-primary" id="back-btn">← Go Back</button>
        </div>
      `
      container.querySelector('#back-btn')?.addEventListener('click', onBack)
      return
    }

    const price = app.price_overview
      ? app.price_overview.discount_percent > 0
        ? `<div class="price-block">
            <span class="badge-discount">-${app.price_overview.discount_percent}%</span>
            <span class="price-original">${app.price_overview.initial_formatted}</span>
            <span class="price-final">${app.price_overview.final_formatted}</span>
           </div>`
        : `<div class="price-block"><span class="price-final">${app.price_overview.final_formatted}</span></div>`
      : app.is_free
        ? `<div class="price-block"><span class="price-final free-tag">Free to Play</span></div>`
        : `<div class="price-block"><span class="price-final">N/A</span></div>`

    const genres = app.genres?.map((g) => `<span class="tag">${g.description}</span>`).join('') ?? ''
    const categories = app.categories?.slice(0, 6).map((c) => `<span class="tag tag-alt">${c.description}</span>`).join('') ?? ''

    const metacritic = app.metacritic
      ? `<div class="metacritic">
          <span class="mc-score" style="background:${app.metacritic.score >= 75 ? '#66c0f4' : app.metacritic.score >= 50 ? '#f4c266' : '#e57373'}">
            ${app.metacritic.score}
          </span>
          <span>Metacritic</span>
         </div>`
      : ''

    const screenshots = app.screenshots?.slice(0, 4).map((s) =>
      `<img src="${s.path_thumbnail}" alt="Screenshot" class="screenshot" loading="lazy" />`
    ).join('') ?? ''

    container.innerHTML = `
      <button class="btn-back" id="back-btn">← Back</button>
      <div class="details-wrapper">
        <div class="details-hero" style="background-image: url('${app.header_image}')">
          <div class="details-hero-overlay">
            <h1 class="details-title">${app.name}</h1>
            ${price}
          </div>
        </div>

        <div class="details-body">
          <div class="details-main">
            <p class="short-desc">${app.short_description}</p>
            <div class="tags-row">${genres}${categories}</div>

            ${screenshots
              ? `<h3 class="sub-heading">Screenshots</h3>
                 <div class="screenshots-grid">${screenshots}</div>`
              : ''}

            <h3 class="sub-heading">About</h3>
            <div class="long-desc">${app.detailed_description}</div>
          </div>

          <aside class="details-sidebar">
            ${metacritic}
            <div class="info-block">
              <div class="info-row"><span class="info-label">Developer</span><span>${app.developers?.join(', ') ?? 'N/A'}</span></div>
              <div class="info-row"><span class="info-label">Publisher</span><span>${app.publishers?.join(', ') ?? 'N/A'}</span></div>
              <div class="info-row"><span class="info-label">Release Date</span><span>${app.release_date?.date ?? 'TBA'}</span></div>
              <div class="info-row"><span class="info-label">Type</span><span>${app.type}</span></div>
            </div>
            <a
              href="https://store.steampowered.com/app/${appid}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary steam-link"
            >View on Steam ↗</a>
          </aside>
        </div>
      </div>
    `

    container.querySelector('#back-btn')?.addEventListener('click', onBack)
  } catch {
    container.innerHTML = `
      <div class="error-state">
        <p class="error-msg">Failed to load game details.</p>
        <button class="btn-primary" id="back-btn">← Go Back</button>
      </div>
    `
    container.querySelector('#back-btn')?.addEventListener('click', onBack)
  }
}
