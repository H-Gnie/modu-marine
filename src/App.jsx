import React, { useState, useEffect, useCallback } from 'react'
import { listings, PHOTO_SLOTS } from './data.js'
import { freshSellData } from './state.js'
import { byId, won, gradeOf, getPhotos } from './utils.js'
import { useIsMobile } from './hooks/useIsMobile.js'
import { useListings } from './hooks/useListings.js'
import { supabase } from './lib/supabase.js'

import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Sidebar from './components/Sidebar.jsx'
import PCTopNav from './components/PCTopNav.jsx'
import CompareBar from './components/CompareBar.jsx'
import Toast from './components/Toast.jsx'
import ChatBot from './components/ChatBot.jsx'
import AuthModal from './components/AuthModal.jsx'
import Home from './views/Home.jsx'
import Search from './views/Search.jsx'
import Detail from './views/Detail.jsx'
import Compare from './views/Compare.jsx'
import Sell from './views/Sell.jsx'
import Garage from './views/Garage.jsx'
import More from './views/More.jsx'
import Dealer from './views/Dealer.jsx'
import Marinas from './views/Marinas.jsx'

const CHAT_AUTO_DISMISSED_KEY = 'chat_auto_dismissed'
const CHAT_FAB_HIDDEN_KEY = 'chat_fab_hidden'

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
  const { listings: allListings, refresh: refreshListings } = useListings()
  const [tab, setTabState] = useState('home')
  const [user, setUser] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
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

  // Supabase Auth 세션 감지
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Kakao OIDC 콜백 처리 (?code=... 파라미터)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) return

    window.history.replaceState({}, '', window.location.pathname)

    fetch(`/api/kakao-token?code=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(async ({ id_token, error }) => {
        if (error) {
          showToast(`카카오 로그인 실패: ${error}`)
          return
        }
        const { data, error: authError } = await supabase.auth.signInWithIdToken({
          provider: 'kakao',
          token: id_token,
        })
        if (authError) {
          showToast(`로그인 오류: ${authError.message}`)
        } else {
          if (data?.session?.user) setUser(data.session.user)
          showToast('카카오 로그인 완료!')
        }
      })
      .catch(err => showToast(`오류: ${err.message}`))
  }, [showToast])
  const [fabVisible, setFabVisible] = useState(
    () => localStorage.getItem(CHAT_FAB_HIDDEN_KEY) !== '1'
  )

  // 접속 시 한 번만 자동 슬라이드업. 사용자가 닫으면 같은 세션에서는 다시 열지 않는다.
  useEffect(() => {
    if (!fabVisible || sessionStorage.getItem(CHAT_AUTO_DISMISSED_KEY) === '1') return
    const t = setTimeout(() => setChatOpen(true), 1500)
    return () => clearTimeout(t)
  }, [fabVisible])

  const closeChat = useCallback(() => {
    sessionStorage.setItem(CHAT_AUTO_DISMISSED_KEY, '1')
    sessionStorage.setItem('chat_dismissed', '1')
    setChatOpen(false)
  }, [])

  const dismissFab = useCallback(() => {
    sessionStorage.setItem(CHAT_AUTO_DISMISSED_KEY, '1')
    sessionStorage.setItem('chat_dismissed', '1')
    setChatOpen(false)
    setFabVisible(false)
    localStorage.setItem(CHAT_FAB_HIDDEN_KEY, '1')
  }, [])

  const restoreFab = useCallback(() => {
    setFabVisible(true)
    localStorage.removeItem(CHAT_FAB_HIDDEN_KEY)
    sessionStorage.removeItem(CHAT_AUTO_DISMISSED_KEY)
    sessionStorage.removeItem('chat_dismissed')
    setChatOpen(true)
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

  const openAuth = useCallback(() => setAuthOpen(true), [])
  const closeAuth = useCallback(() => setAuthOpen(false), [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    showToast('로그아웃 되었습니다')
  }, [showToast])

  const setTab = useCallback((t) => {
    setTabState(t)
    setListing(null)
    window.scrollTo(0, 0)
  }, [])

  const viewDetail = useCallback((id) => {
    const item = allListings.find(x => x.id === Number(id)) || byId(id)
    setListing(item)
    setTabState('detail')
    setRecent(prev => [Number(id), ...prev.filter(x => x !== Number(id))].slice(0, 8))
    window.scrollTo(0, 0)
  }, [allListings])

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

  const submitSell = useCallback(async (finalData) => {
    if (!user) { showToast('로그인 후 매물을 등록할 수 있습니다'); openAuth(); return }

    showToast('매물 등록 중...')

    try {
      // 1. 이미지 Supabase Storage 업로드
      const imageUrls = []
      const fileEntries = Object.entries(finalData.photoFiles || {})
      for (const [key, file] of fileEntries) {
        if (!file) continue
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}_${key}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(path, file, { upsert: true })
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(path)
          imageUrls.push(publicUrl)
        }
      }

      // 2. listings 테이블에 저장
      const { data, error } = await supabase.from('listings').insert({
        seller_id: user.id,
        type: finalData.type,
        brand: finalData.brand || null,
        model: finalData.model || null,
        year: finalData.year ? Number(finalData.year) : null,
        price: Number(finalData.price) || 0,
        region: finalData.region || null,
        marina: finalData.marina || null,
        engine: finalData.engine || null,
        engine_hours: finalData.hours ? Number(finalData.hours) : null,
        length_m: finalData.length ? parseFloat(finalData.length) : null,
        horsepower: finalData.hp ? Number(finalData.hp) : null,
        description: finalData.desc || null,
        sell_mode: sellMode,
        images: imageUrls.length > 0 ? imageUrls : null,
        status: 'active',
      }).select().single()

      if (error) throw error

      // 3. 로컬 상태에도 추가 (내마린고 즉시 반영)
      setSellRequests(prev => [{
        id: data.id,
        mode: sellMode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self',
        status: '접수 완료',
        type: data.type, brand: data.brand, model: data.model,
        year: data.year, price: data.price, region: data.region,
        created: new Date().toLocaleDateString('ko-KR'),
        image: imageUrls[0] || '',
      }, ...prev])

      setSellStep(0)
      setSellData(freshSellData())
      refreshListings()
      showToast('매물이 등록됐습니다!')
      setTab('garage')
    } catch (err) {
      console.error('매물 등록 오류:', err)
      showToast('등록 중 오류가 발생했습니다')
    }
  }, [user, sellMode, showToast, openAuth, setTab])

  const handleBack = useCallback(() => {
    if (tab === 'detail') { setTabState('search'); window.scrollTo(0, 0) }
    else if (tab === 'dealer') { setTabState('more'); window.scrollTo(0, 0) }
    else { setTabState('home'); window.scrollTo(0, 0) }
  }, [tab])

  const isPadded = ['search', 'sell', 'garage', 'more', 'dealer', 'compare', 'marinas'].includes(tab)
  const isDetail = tab === 'detail'
  const screenClass = 'screen' + (isPadded ? ' padded' : '') + (isDetail ? ' detail-pad' : '')

  const sharedProps = {
    tab, listing, filters, wished, compared, recent,
    sellStep, sellMode, sellData, sellRequests,
    listings: allListings,
    setTab, viewDetail, toggleWish, toggleCompare, clearCompare,
    updateFilters, goServiceSearch, goBudget, goTheme,
    setSellStep, setSellMode, setSellData, submitSell,
    showToast,
    user, openAuth, handleLogout,
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
      {tab === 'marinas' && <Marinas {...sharedProps} />}
      {tab === 'more'    && <More    {...sharedProps} onRestoreChat={restoreFab} fabVisible={fabVisible} />}
    </>
  )

  const chatFab = fabVisible && (
    <div className="chat-fab">
      <button
        className={`chat-fab-btn${!sessionStorage.getItem('chat_dismissed') ? ' pulse' : ''}`}
        onClick={() => {
          if (chatOpen) closeChat()
          else {
            sessionStorage.setItem('chat_dismissed', '1')
            setChatOpen(true)
          }
        }}
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
      {authOpen && <AuthModal onClose={closeAuth} />}
    </>
  )

  if (!isMobile) {
    const pcNavProps = {
      tab, setTab, updateFilters, goTheme, goServiceSearch,
      wished, compared, showToast, user, openAuth, handleLogout
    }
    return (
      <div className="app-desktop">
        <Sidebar
          tab={tab}
          setTab={setTab}
          compared={compared}
          onCompare={() => setTab('compare')}
          onWish={() => setTab('garage')}
        />
        <div className="desktop-right">
          <PCTopNav {...pcNavProps} />
          <main id="app" className={`desktop-main ${screenClass}`}>
            {mainContent}
          </main>
        </div>
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
