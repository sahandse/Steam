const KEY = 'steam_wishlist'

export interface WishlistGame {
  id: number
  name: string
  image: string
  price: string
}

export function getWishlist(): WishlistGame[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

export function isInWishlist(id: number): boolean {
  return getWishlist().some((g) => g.id === id)
}

export function toggleWishlist(game: WishlistGame): boolean {
  const list = getWishlist()
  if (list.some((g) => g.id === game.id)) {
    localStorage.setItem(KEY, JSON.stringify(list.filter((g) => g.id !== game.id)))
    return false
  }
  localStorage.setItem(KEY, JSON.stringify([game, ...list]))
  return true
}

export function removeFromWishlist(id: number): void {
  localStorage.setItem(KEY, JSON.stringify(getWishlist().filter((g) => g.id !== id)))
}
