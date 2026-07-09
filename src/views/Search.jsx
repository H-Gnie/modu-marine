import React, { useState, useCallback } from 'react'
import { won } from '../utils.js'
import Card from '../components/Card.jsx'

// 면허별 운항 가능 선종
export const LICENSE_CATS = {
  general: ['제트스키', '모터보트', '낚시보트', 'RIB'], // 일반조종면허
  yacht: ['요트'],                                      // 요트조종면허
}

function filteredListings(listings, filters) {
  // AI 챗봇이 추천한 매물 ID가 있으면 해당 매물만 표시
  if (filters.chatIds && filters.chatIds.length > 0) {
    return listings.filter(item => filters.chatIds.includes(item.id))
  }
  let rows = listings.filter(item => {
    const f = filters
    const matchQ = !f.q || `${item.title} ${item.brand} ${item.model} ${item.location} ${item.badges.join(' ')}`.toLowerCase().includes(f.q.toLowerCase())
    const matchCategory = f.category === '전체' || item.category === f.category
    const matchPrice = !f.maxPrice || item.price <= Number(f.maxPrice)
    const matchRegion = f.region === '전체' || item.location.includes(f.region)
    const matchCertified = !f.certified || item.badges.includes('모두인증') || item.badges.includes('모두진단')
    const matchDelivery = !f.delivery || item.badges.includes('홈배송')
    const matchService = f.service === '전체매물' || item.badges.includes(f.service) || item.category === f.service
    const matchLicense = !f.license || (LICENSE_CATS[f.license] || []).includes(item.category)
    return matchQ && matchCategory && matchPrice && matchRegion && matchCertified && matchDelivery && matchService && matchLicense
  })
  const s = filters.sort
  if (s === '최신순') rows.sort((a, b) => b.created.localeCompare(a.created))
  if (s === '낮은 가격순') rows.sort((a, b) => a.price - b.price)
  if (s === '높은 가격순') rows.sort((a, b) => b.price - a.price)
  if (s === '운항시간순') rows.sort((a, b) => a.hours - b.hours)
  if (s === '추천순') rows.sort((a, b) => b.score - a.score)
  return rows
}

const categories = ['전체', '제트스키', '모터보트', '낚시보트', '요트', 'RIB']
const regions = ['전체', '서울', '경기', '부산', '인천', '강원', '충남', '전남', '경남', '제주']
const sorts = ['추천순', '최신순', '낮은 가격순', '높은 가격순', '운항시간순']
const services = ['전체매물', '모두인증', '영상']
const priceopts = [3000, 5000, 8000, 15000, 25000]

export default function Search({
  filters, updateFilters, listings = [],
  wished, compared, toggleWish, toggleCompare, viewDetail
}) {
  const rows = filteredListings(listings, filters)

  return (
    <>
      <div className="filter-panel">
        <div className="chips">
          {services.map(s => (
            <button
              key={s}
              className={`chip${filters.service === s ? ' active' : ''}`}
              onClick={() => updateFilters({ service: s })}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="field">
          <label>검색어</label>
          <input
            id="q"
            value={filters.q}
            placeholder="모델, 제조사, 지역"
            onChange={e => updateFilters({ q: e.target.value })}
          />
        </div>
        <div className="filter-row">
          <div className="field">
            <label>선종</label>
            <select
              id="category"
              value={filters.category}
              onChange={e => updateFilters({ category: e.target.value })}
            >
              {categories.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className="field">
            <label>최대 가격</label>
            <select
              id="maxPrice"
              value={filters.maxPrice}
              onChange={e => updateFilters({ maxPrice: e.target.value })}
            >
              <option value="">전체</option>
              {priceopts.map(x => <option key={x} value={x}>{won(x)} 이하</option>)}
            </select>
          </div>
        </div>
        <div className="filter-row">
          <div className="field">
            <label>지역</label>
            <select
              id="region"
              value={filters.region}
              onChange={e => updateFilters({ region: e.target.value })}
            >
              {regions.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className="field">
            <label>정렬</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={e => updateFilters({ sort: e.target.value })}
            >
              {sorts.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="section-head" style={{padding:'0 0 4px'}}>
        <h2 id="search-count" style={{fontSize:'16px',fontWeight:950,color:'var(--navy)'}}>매물 {rows.length}대</h2>
        <small style={{color:'var(--muted)'}}>{filters.sort}</small>
      </div>
      <div id="search-results" className="card-list">
        {rows.length
          ? rows.map(x => (
              <Card key={x.id} item={x} wished={wished} compared={compared}
                onWish={toggleWish} onCompare={toggleCompare} onDetail={viewDetail} />
            ))
          : <div className="empty">조건에 맞는 매물이 없습니다.</div>
        }
      </div>
    </>
  )
}
