import React from 'react'

const navItems = [
  {
    tab: 'home',
    label: '홈',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z"/>
        <path d="M9 21V13h6v8"/>
      </svg>
    ),
  },
  {
    tab: 'search',
    label: '검색',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="6.5"/>
        <path d="M15.5 15.5L20 20"/>
      </svg>
    ),
  },
  {
    tab: 'sell',
    label: '내마린팔기',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    ),
  },
  {
    tab: 'garage',
    label: '내마린고',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="3.5"/>
        <path d="M5 21v-1a7 7 0 0114 0v1"/>
        <path d="M8 21h8"/>
      </svg>
    ),
  },
  {
    tab: 'marinas',
    label: '계류장',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 20h16"/>
        <path d="M6 16c2 0 2-1.5 4-1.5S12 16 14 16s2-1.5 4-1.5S20 16 22 16"/>
        <path d="M12 3v11"/>
        <path d="M8 7l4-4 4 4"/>
      </svg>
    ),
  },
  {
    tab: 'more',
    label: '전체서비스',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    ),
  },
]

export default function Sidebar({ tab, setTab, compared, onCompare, onWish }) {
  const cmpCount = compared ? compared.size : 0

  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-logo" onClick={() => setTab('home')} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
        <span className="sidebar-brand-mark">M</span>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">모두의 마린</span>
          <span className="sidebar-brand-sub">수상레저 거래 플랫폼</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="사이드바 메뉴">
        {navItems.map(item => (
          <button
            key={item.tab}
            className={`sidebar-nav-item${tab === item.tab ? ' active' : ''}`}
            onClick={() => setTab(item.tab)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-actions">
        <button className="sidebar-action-btn" onClick={onCompare} aria-label="비교함">
          <span className="sidebar-action-icon" style={{ position: 'relative' }}>
            <svg viewBox="0 0 24 24">
              <path d="M9 18l-4-6 4-6"/>
              <path d="M15 6l4 6-4 6"/>
            </svg>
            {cmpCount > 0 && (
              <span className="sidebar-cmp-badge">{cmpCount}</span>
            )}
          </span>
          <span>비교함 {cmpCount > 0 ? `(${cmpCount})` : ''}</span>
        </button>
        <button className="sidebar-action-btn" onClick={onWish} aria-label="찜 목록">
          <span className="sidebar-action-icon">
            <svg viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </span>
          <span>찜 목록</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">모두의 마린 &copy; 2026</p>
        <p className="sidebar-footer-sub">수상레저 중고 거래</p>
      </div>
    </aside>
  )
}
