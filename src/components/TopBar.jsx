import React from 'react'

export default function TopBar({ tab, compared, onBack, onHome, onCompare, onWish }) {
  const cmpCount = compared.size

  return (
    <header className="topbar">
      <button
        className="icon-btn"
        onClick={onBack}
        title="뒤로가기"
        aria-label="뒤로가기"
        style={{ visibility: tab === 'home' ? 'hidden' : 'visible' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button className="brand" onClick={onHome} aria-label="홈으로">
        <span className="brand-mark">M</span>
        <span>모두의 마린</span>
      </button>
      <div className="top-actions">
        <button className="icon-btn" onClick={onCompare} title="비교함" aria-label="비교함" style={{position:'relative'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l-4-6 4-6"/>
            <path d="M15 6l4 6-4 6"/>
          </svg>
          <span className={`cmp-topbadge${cmpCount > 0 ? ' visible' : ''}`} aria-label="비교함 대수">
            {cmpCount > 0 ? cmpCount : ''}
          </span>
        </button>
        <button className="icon-btn" onClick={onWish} title="찜" aria-label="찜">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
