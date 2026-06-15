import type {
  SearchResult,
  AppDetails,
  FeaturedResponse,
  MarketSearchResult,
} from '../types/steam'

const IS_PROD = import.meta.env.PROD
const CORS = 'https://corsproxy.io/?url='

function storeUrl(path: string, params: Record<string, string> = {}): string {
  if (IS_PROD) {
    const u = new URL(`https://store.steampowered.com${path}`)
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
    return `${CORS}${encodeURIComponent(u.toString())}`
  }
  const u = new URL(`/steam-store${path}`, window.location.origin)
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
  return u.toString()
}

function communityUrl(path: string, params: Record<string, string> = {}): string {
  if (IS_PROD) {
    const u = new URL(`https://steamcommunity.com${path}`)
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
    return `${CORS}${encodeURIComponent(u.toString())}`
  }
  const u = new URL(`/steam-community${path}`, window.location.origin)
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
  return u.toString()
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export const steamApi = {
  getFeatured: () =>
    get<FeaturedResponse>(storeUrl('/api/featured', { cc: 'us', l: 'english' })),

  search: (term: string, page = '1') =>
    get<SearchResult>(
      storeUrl('/api/storesearch', { term, l: 'english', cc: 'us', realm: '1', page })
    ),

  getAppDetails: async (appid: number): Promise<AppDetails | null> => {
    const data = await get<Record<string, { success: boolean; data: AppDetails }>>(
      storeUrl('/api/appdetails', { appids: String(appid), cc: 'us', l: 'english' })
    )
    const entry = data[String(appid)]
    return entry?.success ? entry.data : null
  },

  searchMarket: (query: string, appid = '730', start = '0') =>
    get<MarketSearchResult>(
      communityUrl('/market/search/render', {
        query,
        appid,
        search_descriptions: '0',
        sort_column: 'popular',
        sort_dir: 'desc',
        start,
        count: '20',
        norender: '1',
      })
    ),
}
