import { getWishlist, removeFromWishlist, type WishlistGame } from '../utils/wishlist'

function wishCard(game: WishlistGame, onDetails: (id: number) => void, onRemove: (id: number) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-card'
  el.tabIndex = 0
  el.innerHTML = `
    <div class="card-image-wrap">
      <img src="${game.image}" alt="${game.name}" loading="lazy" />
      <button class="wish-remove-btn" title="حذف">✕</button>
    </div>
    <div class="card-body">
      <h3 class="card-title">${game.name}</h3>
      <div class="price-row"><span class="price-final">${game.price}</span></div>
    </div>
  `
  el.querySelector('.wish-remove-btn')!.addEventListener('click', (e) => {
    e.stopPropagation()
    removeFromWishlist(game.id)
    el.style.opacity = '0'
    el.style.transform = 'scale(.95)'
    el.style.transition = 'all .2s'
    setTimeout(() => el.remove(), 200)
    onRemove(game.id)
  })
  const go = () => onDetails(game.id)
  el.addEventListener('click', go)
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go() })
  return el
}

export function renderWishlistView(
  container: HTMLElement,
  onAppClick: (id: number) => void
): void {
  const list = getWishlist()

  container.innerHTML = `
    <div class="section-title">علاقه‌مندی‌ها <span id="wish-count" class="wish-count">${list.length}</span></div>
    ${list.length === 0
      ? `<div class="wish-empty">
          <div class="wish-empty-icon">♡</div>
          <p>هنوز بازی‌ای اضافه نکرده‌اید.</p>
          <p style="font-size:.85rem;color:var(--muted);margin-top:6px">در صفحه جزئیات هر بازی دکمه ♥ را بزنید.</p>
         </div>`
      : `<div id="wish-grid" class="game-grid"></div>`
    }
  `

  if (!list.length) return

  const grid = container.querySelector('#wish-grid') as HTMLElement
  const countEl = container.querySelector('#wish-count') as HTMLElement

  list.forEach((game) =>
    grid.appendChild(wishCard(game, onAppClick, () => {
      const remaining = getWishlist().length
      countEl.textContent = String(remaining)
      if (remaining === 0) {
        grid.innerHTML = `
          <div class="wish-empty" style="grid-column:1/-1">
            <div class="wish-empty-icon">♡</div>
            <p>لیست خالی شد.</p>
          </div>`
      }
    }))
  )
}
