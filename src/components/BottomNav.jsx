import React from 'react'

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <button
        data-tab="home"
        className={tab === 'home' ? 'active' : ''}
        onClick={() => setTab('home')}
      >
        <svg viewBox="0 0 24 24">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z"/>
          <path d="M9 21V13h6v8"/>
        </svg>
        <span>홈</span>
      </button>
      <button
        data-tab="search"
        className={tab === 'search' ? 'active' : ''}
        onClick={() => setTab('search')}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="6.5"/>
          <path d="M15.5 15.5L20 20"/>
        </svg>
        <span>검색</span>
      </button>
      <button
        data-tab="sell"
        className={tab === 'sell' ? 'active' : ''}
        onClick={() => setTab('sell')}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        <span>팔기</span>
      </button>
      <button
        data-tab="garage"
        className={tab === 'garage' ? 'active' : ''}
        onClick={() => setTab('garage')}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="3.5"/>
          <path d="M5 21v-1a7 7 0 0114 0v1"/>
          <path d="M8 21h8"/>
        </svg>
        <span>마이마린</span>
      </button>
      <button
        data-tab="more"
        className={tab === 'more' ? 'active' : ''}
        onClick={() => setTab('more')}
      >
        <svg viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <span>더보기</span>
      </button>
    </nav>
  )
}
