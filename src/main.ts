import './style.css'
import { renderHeader } from './components/Header'
import { renderHomeView } from './components/HomeView'
import { renderSearchView } from './components/SearchView'
import { renderDetailsView } from './components/DetailsView'
import { renderMarketView } from './components/MarketView'
import { renderSuggestView } from './components/SuggestView'
import type { View } from './types/steam'

const app = document.querySelector<HTMLDivElement>('#app')!
const main = document.createElement('main')
main.className = 'main-content'

let currentView: View = 'home'
let prevView: View = 'home'
let headerEl: HTMLElement | null = null

function renderApp(): void {
  if (headerEl) headerEl.remove()
  headerEl = renderHeader(navigateTo, currentView)
  app.insertBefore(headerEl, main)
}

function navigateTo(view: View, data?: unknown): void {
  prevView = currentView
  currentView = view
  main.innerHTML = ''
  renderApp()

  switch (view) {
    case 'home':
      renderHomeView(main, (id) => navigateTo('details', id))
      break
    case 'search':
      renderSearchView(main, (id) => navigateTo('details', id), typeof data === 'string' ? data : '')
      break
    case 'suggest':
      renderSuggestView(main, (id) => navigateTo('details', id))
      break
    case 'details':
      if (typeof data === 'number') renderDetailsView(main, data, () => navigateTo(prevView))
      break
    case 'market':
      renderMarketView(main)
      break
  }
}

app.appendChild(main)
navigateTo('home')
