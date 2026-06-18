import React, { useState } from 'react'

const CATS = [
  { label: '전체매물',  key: 'all' },
  { label: '제트스키', key: '제트스키' },
  { label: '모터보트', key: '모터보트' },
  { label: '낚시보트', key: '낚시보트' },
  { label: '요트',     key: '요트' },
  { label: 'RIB',      key: 'RIB' },
  { label: '모두인증', key: 'cert' },
  { label: '홈배송', key: 'delivery' },
]

export default function PCTopNav({
  tab, setTab, updateFilters, goTheme, goServiceSearch,
  wished, compared, showToast, user, openAuth, handleLogout
}) {
  const [q, setQ] = useState('')

  function search() {
    updateFilters({ q: q.trim(), category: '전체', service: '전체매물' })
    setTab('search')
  }

  function handleCat(key) {
    if (key === 'all')    { updateFilters({ category: '전체', service: '전체매물' }); setTab('search') }
    else if (key === 'cert')     goServiceSearch('모두인증')
    else if (key === 'delivery') goServiceSearch('홈배송')
    else goTheme(key)
  }

  return (
    <header className="pc-topnav">
      <div className="pc-topnav-row1">
        <div className="pc-search-wrap">
          <input
            className="pc-search-input"
            placeholder="제조사, 모델명, 지역, 마리나 이름으로 검색"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
          />
          <button className="pc-search-btn" onClick={search}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>
            </svg>
            검색
          </button>
        </div>
        <div className="pc-topnav-utils">
          <button className="pc-util-btn" onClick={() => setTab('garage')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            찜{wished?.size > 0 ? <span className="pc-util-badge">{wished.size}</span> : null}
          </button>
          <button className="pc-util-btn" onClick={() => setTab('compare')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l-4-6 4-6"/><path d="M15 6l4 6-4 6"/>
            </svg>
            비교함{compared?.size > 0 ? <span className="pc-util-badge">{compared.size}</span> : null}
          </button>
          {user ? (
            <button className="pc-util-btn" onClick={handleLogout}>
              {user.user_metadata?.name || user.email?.split('@')[0]} · 로그아웃
            </button>
          ) : (
            <button className="pc-util-btn login-btn" onClick={openAuth}>
              로그인
            </button>
          )}
          <button className="pc-sell-btn" onClick={() => setTab('sell')}>내마린팔기</button>
        </div>
      </div>
      <nav className="pc-topnav-cats">
        <div className="pc-topnav-cats-inner">
          {CATS.map(c => (
            <button
              key={c.key}
              className={`pc-cat-item${c.key === 'marina' ? ' marina' : ''}`}
              onClick={() => handleCat(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
