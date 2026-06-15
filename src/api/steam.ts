import type {
  SearchResult,
  AppDetails,
  FeaturedResponse,
  MarketSearchResult,
} from '../types/steam'

const BASE = '/api'

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(BASE + path, window.location.origin)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json() as Promise<T>
}

export const steamApi = {
  getFeatured: () => get<FeaturedResponse>('/featured'),

  search: (term: string, page = '1') =>
    get<SearchResult>('/search', { term, page }),

  getAppDetails: async (appid: number): Promise<AppDetails | null> => {
    const data = await get<Record<string, { success: boolean; data: AppDetails }>>(
      `/appdetails/${appid}`
    )
    const entry = data[String(appid)]
    return entry?.success ? entry.data : null
  },

  searchMarket: (query: string, appid = '730', start = '0') =>
    get<MarketSearchResult>('/market/search', { query, appid, start }),
}
