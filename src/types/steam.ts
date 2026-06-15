export interface SteamApp {
  id: number
  name: string
  tiny_image: string
  price?: {
    currency: string
    initial: number
    final: number
    discount_percent: number
    final_formatted: string
    initial_formatted?: string
  }
}

export interface SearchResult {
  total: number
  items: SteamApp[]
}

export interface AppDetails {
  type: string
  name: string
  steam_appid: number
  required_age: number
  is_free: boolean
  detailed_description: string
  short_description: string
  header_image: string
  website: string | null
  developers: string[]
  publishers: string[]
  price_overview?: {
    currency: string
    initial: number
    final: number
    discount_percent: number
    final_formatted: string
    initial_formatted: string
  }
  release_date: {
    coming_soon: boolean
    date: string
  }
  genres?: { id: string; description: string }[]
  categories?: { id: number; description: string }[]
  screenshots?: { id: number; path_thumbnail: string; path_full: string }[]
  metacritic?: { score: number; url: string }
}

export interface FeaturedItem {
  id: number
  name: string
  discounted: boolean
  discount_percent: number
  original_price: number
  final_price: number
  currency: string
  large_capsule_image: string
  small_capsule_image: string
  header_image: string
  discount_expiration: number
  purchase_package: number
  type: number
}

export interface FeaturedResponse {
  large_capsules: FeaturedItem[]
  featured_win: FeaturedItem[]
  featured_mac: FeaturedItem[]
  featured_linux: FeaturedItem[]
  layout: string
  status: number
}

export interface MarketItem {
  name: string
  hash_name: string
  sell_listings: number
  sell_price: number
  sell_price_text: string
  app_icon: string
  app_name: string
  asset_description: {
    appid: number
    classid: string
    icon_url: string
    tradable: number
    name: string
    name_color: string
    type: string
    market_name: string
  }
}

export interface MarketSearchResult {
  success: boolean
  start: number
  pagesize: number
  total_count: number
  results: MarketItem[]
}

export type View = 'home' | 'search' | 'details' | 'market' | 'suggest'
