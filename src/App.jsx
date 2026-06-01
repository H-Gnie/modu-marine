import React, { useState, useEffect, useCallback } from 'react'
import { listings, PHOTO_SLOTS } from './data.js'
import { freshSellData } from './state.js'
import { byId, won, gradeOf, getPhotos } from './utils.js'
import { useIsMobile } from './hooks/useIsMobile.js'

import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Sidebar from './components/Sidebar.jsx'
import CompareBar from './components/CompareBar.jsx'
import Toast from './components/Toast.jsx'
import ChatBot from './components/ChatBot.jsx'
import Home from './views/Home.jsx'
import Search from './views/Search.jsx'
import Detail from './views/Detail.jsx'
import Compare from './views/Compare.jsx'
import Sell from './views/Sell.jsx'
import Garage from './views/Garage.jsx'
import More from './views/More.jsx'
import Dealer from './views/Dealer.jsx'

// localStorage helpers
function loadArr(key) {
  try {
    const v = localStorage.getItem(key)
    if (!v) return []
    const p = JSON.parse(v)
    return Array.isArray(p) ? p : []
  } catch { return [] }
}
function loadSet(key) {
  return new Set(loadArr(key).map(Number).filter(Number.isFinite))
}

export default function App() {
  const isMobile = useIsMobile()
  const [tab, setTabState] = useState('home')
  const [listing, setListing] = useState(null)
  const [filters, setFilters] = useState({
    category: '전체', maxPrice: '', region: '전체',
    certified: false, delivery: false, sort: '추천순',
    q: '', service: '전체매물', chatIds: []
  })
  const [wished, setWished] = useState(() => loadSet('modu_wished'))
  const [compared, setCompared] = useState(() => loadSet('modu_compared'))
  const [recent, setRecent] = useState(() => loadArr('modu_recent').map(Number).filter(Number.isFinite).slice(0, 8))
  const [sellStep, setSellStep] = useState(0)
  const [sellMode, setSellMode] = useState('self')
  const [sellData, setSellData] = useState(freshSellData)
  const [sellRequests, setSellRequests] = useState(() => {
    try {
      const v = localStorage.getItem('modu_sellRequests')
      if (!v) return []
      const p = JSON.parse(v)
      return Array.isArray(p) ? p.filter(x => x && typeof x === 'object') : []
    } catch { return [] }
  })
  const [toast, setToast] = useState({ msg: '', visible: false })
  const [chatOpen, setChatOpen] = useState(false)
  const [fabVisible, setFabVisible] = useState(
    () => localStorage.getItem('chat_fab_hidden') !== '1'
  )

  // 첫 방문 시 1.5초 후 자동 슬라이드업 (세션당 1회)
  useEffect(() => {
    if (!sessionStorage.getItem('chat_dismissed') && fabVisible) {
      const t = setTimeout(() => setChatOpen(true), 1500)
      return () => clearTimeout(t)
    }
  }, [fabVisible])

  const closeChat = useCallback(() => {
    setChatOpen(false)
    sessionStorage.setItem('chat_dismissed', '1')
  }, [])

  const dismissFab = useCallback(() => {
    setChatOpen(false)
    setFabVisible(false)
    localStorage.setItem('chat_fab_hidden', '1')
  }, [])

  const restoreFab = useCallback(() => {
    setFabVisible(true)
    localStorage.removeItem('chat_fab_hidden')
    sessionStorage.removeItem('chat_dismissed')
  }, [])

  const handleChatSelect = useCallback((ids) => {
    setFilters(prev => ({ ...prev, chatIds: ids, category: '전체', service: '전체매물', q: '' }))
    setTabState('search')
    setListing(null)
    window.scrollTo(0, 0)
    setChatOpen(false)
  }, [])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem('modu_wished', JSON.stringify([...wished]))
      localStorage.setItem('modu_compared', JSON.stringify([...compared]))
      localStorage.setItem('modu_recent', JSON.stringify(recent))
      localStorage.setItem('modu_sellRequests', JSON.stringify(sellRequests))
    } catch {}
  }, [wished, compared, recent, sellRequests])

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 1600)
  }, [])

  const setTab = useCallback((t) => {
    setTabState(t)
    setListing(null)
    window.scrollTo(0, 0)
  }, [])

  const viewDetail = useCallback((id) => {
    const item = byId(id)
    setListing(item)
    setTabState('detail')
    setRecent(prev => [Number(id), ...prev.filter(x => x !== Number(id))].slice(0, 8))
    window.scrollTo(0, 0)
  }, [])

  const toggleWish = useCallback((id) => {
    const numId = Number(id)
    setWished(prev => {
      const next = new Set(prev)
      if (next.has(numId)) {
        next.delete(numId)
        showToast('찜을 해제했습니다')
      } else {
        next.add(numId)
        showToast('찜했습니다')
      }
      return next
    })
  }, [showToast])

  const toggleCompare = useCallback((id) => {
    const numId = Number(id)
    setCompared(prev => {
      const next = new Set(prev)
      if (next.has(numId)) {
        next.delete(numId)
        showToast('비교함에서 제거됐습니다')
      } else {
        if (next.size >= 4) { showToast('비교함은 최대 4대까지 가능합니다'); return prev }
        next.add(numId)
        showToast(`비교함에 추가됐습니다 (${next.size}대)`)
      }
      return next
    })
  }, [showToast])

  const clearCompare = useCallback(() => {
    setCompared(new Set())
  }, [])

  const updateFilters = useCallback((updates) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const goServiceSearch = useCallback((service) => {
    setFilters(prev => ({ ...prev, service, q: '' }))
    setTabState('search')
    setListing(null)
    window.scrollTo(0, 0)
  }, [])

  const goBudget = useCallback((maxPrice) => {
    setFilters(prev => ({ ...prev, maxPrice, category: '전체' }))
    setTabState('search')
    setListing(null)
    window.scrollTo(0, 0)
  }, [])

  const goTheme = useCallback((category) => {
    setFilters(prev => ({ ...prev, category }))
    setTabState('search')
    setListing(null)
    window.scrollTo(0, 0)
  }, [])

  const submitSell = useCallback((finalData) => {
    const photoUrls = PHOTO_SLOTS.map(s => finalData.photos[s.key]).filter(Boolean)
    setSellRequests(prev => [{
      mode: sellMode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self',
      status: '접수 완료',
      type: finalData.type, brand: finalData.brand, model: finalData.model,
      year: finalData.year, price: finalData.price, region: finalData.region,
      created: new Date().toLocaleDateString('ko-KR'),
      image: photoUrls[0] || '',
      photos: { ...finalData.photos },
      diagnosisNoticeVersion: '1.0',
      diagnosisNoticeAcceptedAt: new Date().toISOString(),
      consentAcceptedAt: new Date().toISOString(),
    }, ...prev])
    setSellStep(0)
    setSellData(freshSellData())
    showToast('내마린팔기 접수 완료')
    setTab('garage')
  }, [sellMode, showToast, setTab])

  const handleBack = useCallback(() => {
    if (tab === 'detail') { setTabState('search'); window.scrollTo(0, 0) }
    else if (tab === 'dealer') { setTabState('more'); window.scrollTo(0, 0) }
    else { setTabState('home'); window.scrollTo(0, 0) }
  }, [tab])

  const isPadded = ['search', 'sell', 'garage', 'more', 'dealer', 'compare'].includes(tab)
  const isDetail = tab === 'detail'
  const screenClass = 'screen' + (isPadded ? ' padded' : '') + (isDetail ? ' detail-pad' : '')

  const sharedProps = {
    tab, listing, filters, wished, compared, recent,
    sellStep, sellMode, sellData, sellRequests,
    setTab, viewDetail, toggleWish, toggleCompare, clearCompare,
    updateFilters, goServiceSearch, goBudget, goTheme,
    setSellStep, setSellMode, setSellData, submitSell,
    showToast,
  }

  const mainContent = (
    <>
      {tab === 'home'    && <Home    {...sharedProps} />}
      {tab === 'search'  && <Search  {...sharedProps} />}
      {tab === 'detail'  && <Detail  {...sharedProps} />}
      {tab === 'compare' && <Compare {...sharedProps} />}
      {tab === 'sell'    && <Sell    {...sharedProps} />}
      {tab === 'garage'  && <Garage  {...sharedProps} />}
      {tab === 'dealer'  && <Dealer  {...sharedProps} />}
      {tab === 'more'    && <More    {...sharedProps} onRestoreChat={restoreFab} fabVisible={fabVisible} />}
    </>
  )

  const chatFab = fabVisible && (
    <div className="chat-fab">
      <button
        className={`chat-fab-btn${!sessionStorage.getItem('chat_dismissed') ? ' pulse' : ''}`}
        onClick={() => setChatOpen(v => !v)}
        aria-label="AI 매물 추천 챗봇"
      >
        {chatOpen
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        }
      </button>
      {!chatOpen && (
        <button className="chat-fab-dismiss" onClick={dismissFab} aria-label="챗봇 숨기기">✕</button>
      )}
    </div>
  )

  const sharedOverlays = (
    <>
      <CompareBar compared={compared} tab={tab} onGo={() => setTab('compare')} />
      <Toast msg={toast.msg} visible={toast.visible} />
      <ChatBot visible={chatOpen} onClose={closeChat} onSelectListings={handleChatSelect} />
      {chatFab}
    </>
  )

  if (!isMobile) {
    return (
      <div className="app-desktop">
        <Sidebar
          tab={tab}
          setTab={setTab}
          compared={compared}
          onCompare={() => setTab('compare')}
          onWish={() => setTab('garage')}
        />
        <main id="app" className={`desktop-main ${screenClass}`}>
          {mainContent}
        </main>
        {sharedOverlays}
      </div>
    )
  }

  return (
    <div className="app-shell">
      <TopBar
        tab={tab}
        compared={compared}
        onBack={handleBack}
        onHome={() => setTab('home')}
        onCompare={() => setTab('compare')}
        onWish={() => setTab('garage')}
      />
      <main id="app" className={screenClass}>
        {mainContent}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
      {sharedOverlays}
    </div>
  )
}
