import React, { useMemo, useState } from 'react'
import { MARINAS } from '../data.js'
import { won } from '../utils.js'

const regions = ['전체', '경기', '인천', '부산', '경남', '제주']
const facilities = ['전체', '전기', '급수', '육상보관', '정비', '요트', '트레일러']

export default function Marinas({ showToast }) {
  const [region, setRegion] = useState('전체')
  const [facility, setFacility] = useState('전체')
  const [availableOnly, setAvailableOnly] = useState(false)

  const rows = useMemo(() => {
    return MARINAS.filter(m => {
      const matchRegion = region === '전체' || m.region.includes(region)
      const matchFacility = facility === '전체' || m.tags.includes(facility)
      const matchAvailable = !availableOnly || m.available > 0
      return matchRegion && matchFacility && matchAvailable
    }).sort((a, b) => b.available - a.available)
  }, [region, facility, availableOnly])

  return (
    <>
      <div className="marina-hero">
        <div>
          <div className="home-mode">계류장 찾기</div>
          <h1>보트 둘 곳까지<br/>한 번에 확인하세요</h1>
          <p>월 계류비, 빈자리, 시설, 상담 가능 여부를 모아봤습니다.</p>
        </div>
        <div className="marina-hero-stat">
          <strong>{MARINAS.reduce((sum, m) => sum + m.available, 0)}</strong>
          <span>상담 가능 자리</span>
        </div>
      </div>

      <div className="filter-panel marina-filter">
        <div className="filter-row">
          <div className="field">
            <label>지역</label>
            <select value={region} onChange={e => setRegion(e.target.value)}>
              {regions.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className="field">
            <label>필요 시설</label>
            <select value={facility} onChange={e => setFacility(e.target.value)}>
              {facilities.map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <label className="marina-check">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={e => setAvailableOnly(e.target.checked)}
          />
          <span>상담 가능 자리만 보기</span>
        </label>
      </div>

      <div className="section-head" style={{padding:'0 0 4px'}}>
        <h2 style={{fontSize:'16px',fontWeight:950,color:'var(--navy)'}}>계류장 {rows.length}곳</h2>
        <small style={{color:'var(--muted)'}}>월 예상비 기준</small>
      </div>

      <div className="marina-list">
        {rows.length ? rows.map(m => (
          <article className="marina-card" key={m.id}>
            <div className="marina-img" style={{backgroundImage:`url('${m.image}')`}}>
              <span className={`marina-status ${m.available > 5 ? 'good' : m.available > 0 ? 'warn' : 'full'}`}>
                {m.available > 0 ? `빈자리 ${m.available}` : '대기'}
              </span>
            </div>
            <div className="marina-body">
              <div className="marina-title-row">
                <div>
                  <h2>{m.name}</h2>
                  <p>{m.region} · {m.type}</p>
                </div>
                <div className="marina-price">
                  <strong>{won(m.monthlyFee)}</strong>
                  <span>/월~</span>
                </div>
              </div>
              <p className="marina-desc">{m.desc}</p>
              <div className="marina-spec-grid">
                <div><span>최대 선체</span><strong>{m.maxLength}</strong></div>
                <div><span>수심</span><strong>{m.depth}</strong></div>
                <div><span>총 계류</span><strong>{m.capacity}척</strong></div>
              </div>
              <div className="include-list marina-tags">
                {m.tags.map(tag => <span className="include-tag" key={tag}>{tag}</span>)}
              </div>
              <div className="marina-services">
                {m.services.map(s => <span key={s}>{s}</span>)}
              </div>
              <div className="cta-row marina-actions">
                <button className="primary" onClick={() => showToast(`${m.name} 상담 요청을 남겼습니다`)}>상담 요청</button>
                <button onClick={() => showToast(`${m.phone}로 연결 준비 중입니다`)}>전화 문의</button>
              </div>
            </div>
          </article>
        )) : (
          <div className="empty">조건에 맞는 계류장이 없습니다.</div>
        )}
      </div>

      <section className="section" style={{paddingBottom:'22px'}}>
        <div className="notice">
          계류비와 빈자리는 mock 데이터입니다. 실제 계약 전 선체 길이, 흘수, 전기 사용량, 장기 계류 조건, 보험 요건을 계류장에 직접 확인하세요.
        </div>
      </section>
    </>
  )
}
