import { Router, Request, Response } from 'express'
import axios from 'axios'

const router = Router()

const STORE_BASE = 'https://store.steampowered.com'
const COMMUNITY_BASE = 'https://steamcommunity.com'

async function proxyGet(url: string, params: Record<string, string> = {}): Promise<unknown> {
  const response = await axios.get(url, {
    params,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SteamExplorer/1.0)',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 10000,
  })
  return response.data
}

router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const data = await proxyGet(`${STORE_BASE}/api/featured`, { cc: 'us', l: 'english' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured games' })
  }
})

router.get('/search', async (req: Request, res: Response) => {
  const { term = '', page = '1' } = req.query as Record<string, string>
  try {
    const data = await proxyGet(`${STORE_BASE}/api/storesearch`, {
      term,
      l: 'english',
      cc: 'us',
      realm: '1',
      page,
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to search games' })
  }
})

router.get('/appdetails/:appid', async (req: Request, res: Response) => {
  const { appid } = req.params
  try {
    const data = await proxyGet(`${STORE_BASE}/api/appdetails`, {
      appids: appid,
      cc: 'us',
      l: 'english',
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch app details' })
  }
})

router.get('/market/search', async (req: Request, res: Response) => {
  const { query = '', appid = '730', start = '0', count = '20' } = req.query as Record<string, string>
  try {
    const data = await proxyGet(`${COMMUNITY_BASE}/market/search/render`, {
      query,
      appid,
      search_descriptions: '0',
      sort_column: 'popular',
      sort_dir: 'desc',
      start,
      count,
      norender: '1',
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to search market' })
  }
})

router.get('/market/pricehistory', async (req: Request, res: Response) => {
  const { appid = '730', market_hash_name = '' } = req.query as Record<string, string>
  try {
    const data = await proxyGet(`${COMMUNITY_BASE}/market/pricehistory`, {
      appid,
      market_hash_name,
      currency: '1',
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price history' })
  }
})

router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const data = await proxyGet(`${STORE_BASE}/api/getappsingenre`, {
      genre_id: '1',
      sort_by: 'Name',
      page: '1',
      l: 'english',
      cc: 'us',
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

export default router
