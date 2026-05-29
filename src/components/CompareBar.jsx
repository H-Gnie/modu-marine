import React from 'react'

export default function CompareBar({ compared, tab, onGo }) {
  const showBar = compared.size > 0 && !['compare', 'detail'].includes(tab)
  return (
    <div id="cmpBar" className={`cmp-bar${showBar ? '' : ' hidden'}`} role="status" aria-live="polite">
      <span className="cmp-bar-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l-4-6 4-6"/>
          <path d="M15 6l4 6-4 6"/>
        </svg>
        <span id="cmpBarLabel">비교함 {compared.size}대</span>
      </span>
      <button id="cmpBarBtn" className="cmp-bar-btn" onClick={onGo}>비교하기 →</button>
    </div>
  )
}
