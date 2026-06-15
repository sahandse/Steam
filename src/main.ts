import './style.css'
import { renderHeader } from './components/Header'
import { renderHomeView } from './components/HomeView'
import { renderSearchView } from './components/SearchView'
import { renderDetailsView } from './components/DetailsView'
import { renderMarketView } from './components/MarketView'
import type { View } from './types/steam'

const app = document.querySelector<HTMLDivElement>('#app')!

let currentView: View = 'home'
let previousView: View = 'home'

const header = renderHeader(navigateTo)
const main = document.createElement('main')
main.className = 'main-content'

app.appendChild(header)
app.appendChild(main)

function navigateTo(view: View, data?: unknown): void {
  previousView = currentView
  currentView = view
  main.innerHTML = ''

  switch (view) {
    case 'home':
      renderHomeView(main, (appid) => navigateTo('details', appid))
      break
    case 'search':
      renderSearchView(main, (appid) => navigateTo('details', appid), typeof data === 'string' ? data : '')
      break
    case 'details':
      if (typeof data === 'number') {
        renderDetailsView(main, data, () => navigateTo(previousView))
      }
      break
    case 'market':
      renderMarketView(main)
      break
  }
}

navigateTo('home')
