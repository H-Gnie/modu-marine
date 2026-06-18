import React from 'react'
import { byId, won, gradeOf, badgeClass } from '../utils.js'

function badgeHtml(item) {
  return item.badges.slice(0, 2).map(b => (
    <span key={b} className={badgeClass(b)}>{b}</span>
  ))
}

export default function Compare({ compared, clearCompare, toggleCompare, setTab, viewDetail }) {
  const items = [...compared].map(byId).filter(Boolean)

  if (items.length === 0) {
    return (
      <div className="panel">
        <h1 className="detail-title" style={{marginTop:0}}>비교함</h1>
        <div className="empty" style={{padding:'52px 0',textAlign:'center'}}>
          비교할 매물이 없습니다.<br/>
          <small style={{color:'var(--muted)'}}>매물 카드의 ⇄ 버튼으로 추가하세요.</small>
        </div>
        <button
          className="wide-btn primary"
          style={{borderRadius:'var(--r-md)',marginTop:'8px'}}
          onClick={() => setTab('search')}
        >
          매물 검색하러 가기
        </button>
      </div>
    )
  }

  const gradeRank = { 'S': 5, 'A+': 4, 'A': 3, 'B+': 2, 'B': 1 }
  const minPrice = Math.min(...items.map(x => x.price))
  const minHours = Math.min(...items.map(x => x.hours))
  const maxYear  = Math.max(...items.map(x => x.year))
  const maxGrade = Math.max(...items.map(x => gradeRank[gradeOf(x.score)]))

  const rows = [
    { label: '가격',      fn: x => won(x.price),                                best: x => x.price === minPrice },
    { label: 'AI시세',    fn: x => (x.market.split('·')[1] || '').trim() || '-' },
    { label: '등급',      fn: x => gradeOf(x.score),                             best: x => gradeRank[gradeOf(x.score)] === maxGrade },
    { label: '연식',      fn: x => `${x.year}년`,                                best: x => x.year === maxYear },
    { label: '운항시간',  fn: x => `${x.hours}h`,                                best: x => x.hours === minHours },
    { label: '선체 길이', fn: x => x.length },
    { label: '엔진',      fn: x => x.engine },
    { label: '지역',      fn: x => x.location },
  ]

  return (
    <div className="panel">
      <div className="cmp-page-header">
        <h1 className="detail-title" style={{margin:0}}>
          비교함 <span style={{color:'var(--blue)'}}>{items.length}</span>대
        </h1>
        <button className="text-link" onClick={clearCompare}>전체 초기화</button>
      </div>
      <p className="cmp-legend">녹색 ✓ 는 비교 항목 중 유리한 값입니다.</p>
      <div className="cmp-table">
        <div className="cmp-label-col">
          <div className="cmp-head-cell"></div>
          <div className="cmp-img-head"></div>
          {rows.map(r => (
            <div key={r.label} className="cmp-label-cell">{r.label}</div>
          ))}
          <div className="cmp-label-cell badge-row">배지</div>
          <div className="cmp-action-head"></div>
        </div>
        <div className="cmp-scroll">
          {items.map(item => {
            const grade = gradeOf(item.score)
            const gradeCls = grade.replace('+', 'p')
            return (
              <div key={item.id} className="cmp-col">
                <div className="cmp-head-cell">
                  <button
                    className="cmp-remove-btn"
                    onClick={() => toggleCompare(item.id)}
                    aria-label="제거"
                  >×</button>
                </div>
                <div className="cmp-img-cell" onClick={() => viewDetail(item.id)} style={{cursor:'pointer'}}>
                  <div className="cmp-thumb" style={{backgroundImage:`url('${item.image}')`}}>
                    <div className={`grade-dot grade-${gradeCls}`} style={{bottom:'5px',left:'5px',fontSize:'10px',padding:'2px 5px'}}>{grade}</div>
                  </div>
                  <div className="cmp-item-title">{item.title}</div>
                </div>
                {rows.map(r => {
                  const isBest = r.best && items.length > 1 && r.best(item)
                  return (
                    <div key={r.label} className={`cmp-cell${isBest ? ' best' : ''}`}>
                      {r.fn(item)}{isBest ? ' ✓' : ''}
                    </div>
                  )
                })}
                <div className="cmp-cell cmp-badge-cell">{badgeHtml(item)}</div>
                <div className="cmp-action-cell">
                  <button
                    className="wide-btn primary"
                    style={{borderRadius:'var(--r-sm)',fontSize:'12px',padding:'8px 0'}}
                    onClick={() => viewDetail(item.id)}
                  >
                    상세보기
                  </button>
                </div>
              </div>
            )
          })}
          {items.length < 4 && (
            <div className="cmp-col cmp-add-col">
              <div className="cmp-head-cell"></div>
              <div className="cmp-img-head cmp-add-slot" onClick={() => setTab('search')} style={{cursor:'pointer'}}>
                <span style={{fontSize:'26px',fontWeight:300,color:'var(--muted)'}}>+</span>
                <span style={{fontSize:'11px',color:'var(--muted)'}}>매물 추가</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
