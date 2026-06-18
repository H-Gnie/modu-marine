import React from 'react'
import { won, gradeOf, badgeClass, visibleBadges } from '../utils.js'

function badgeHtml(item) {
  return visibleBadges(item.badges).slice(0, 3).map(b => (
    <span key={b} className={badgeClass(b)}>{b}</span>
  ))
}

export default function Card({ item, compact = false, wished, compared, onWish, onCompare, onDetail }) {
  const grade = gradeOf(item.score ?? 0)
  const gradeCls = grade.replace('+', 'p')
  const mktPart = (item.market?.split('·')[1] || '').trim()
  const hintCls = mktPart.includes('낮음') ? 'hint-good' : mktPart.includes('높음') ? 'hint-high' : 'hint-fair'
  const isWished = wished.has(item.id)
  const isCompared = compared.has(item.id)

  return (
    <article
      className={`listing-card${compact ? ' compact' : ''}`}
      onClick={() => onDetail(item.id)}
      style={{cursor:'pointer'}}
    >
      <div className="thumb" style={{backgroundImage:`url('${item.image}')`}}>
        <div className="badges">{badgeHtml(item)}</div>
        <button
          className="card-wish"
          onClick={e => { e.stopPropagation(); onWish(item.id) }}
          aria-label={isWished ? '찜 해제' : '찜하기'}
        >
          {isWished ? '♥' : '♡'}
        </button>
        {item.video && <span className="play">▶</span>}
        <div className={`grade-dot grade-${gradeCls}`}>{grade}</div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <div className="price">{won(item.price)}</div>
        <div className="specs">{item.year}년 · {item.hours}h · {item.location}</div>
        <div className="specs">{item.length} · {item.engine}</div>
        {mktPart && <div className={`mkt-hint ${hintCls}`}>{mktPart}</div>}
        <div className="card-bottom-row">
          <div className="one-line">{item.seller}</div>
          <button
            className={`card-cmp-btn${isCompared ? ' on' : ''}`}
            onClick={e => { e.stopPropagation(); onCompare(item.id) }}
          >
            ⇄ {isCompared ? '비교중' : '비교'}
          </button>
        </div>
      </div>
    </article>
  )
}
