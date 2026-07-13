import React, { useMemo, useState } from 'react'
import { MARINAS } from '../data.js'
import MarinaInquiryModal from '../components/MarinaInquiryModal.jsx'

const regions = ['전체', '경기', '인천', '부산', '경남', '제주']
const facilities = ['전체', '전기', '급수', '육상보관', '정비', '요트', '트레일러']

export default function Marinas({ showToast, user }) {
  const [region, setRegion] = useState('전체')
  const [facility, setFacility] = useState('전체')
  const [inquiryMarina, setInquiryMarina] = useState(null)

  const rows = useMemo(() => {
    return MARINAS.filter(m => {
      const matchRegion = region === '전체' || m.region.includes(region)
      const matchFacility = facility === '전체' || m.tags.includes(facility)
      return matchRegion && matchFacility
    })
  }, [region, facility])

  return (
    <>
      <div className="marina-hero">
        <div>
          <div className="home-mode">계류장 찾기</div>
          <h1>보트 둘 곳까지<br/>한 번에 확인하세요</h1>
          <p>위치와 시설을 확인하고 바로 문의하세요.</p>
        </div>
        <div className="marina-hero-stat">
          <strong>{MARINAS.length}</strong>
          <span>등록 계류장</span>
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
      </div>

      <div className="section-head" style={{padding:'0 0 4px'}}>
        <h2 style={{fontSize:'16px',fontWeight:950,color:'var(--navy)'}}>계류장 {rows.length}곳</h2>
        <small style={{color:'var(--muted)'}}>지역·시설별</small>
      </div>

      <div className="marina-list">
        {rows.length ? rows.map(m => (
          <article className="marina-card" key={m.id}>
            <div className="marina-img" style={{backgroundImage:`url('${m.image}')`}} />
            <div className="marina-body">
              <div className="marina-title-row">
                <div>
                  <h2>{m.name}</h2>
                  <p>{m.region} · {m.type}</p>
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
                <button className="primary" onClick={() => setInquiryMarina(m)}>문의하기</button>
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
          실제 계약 전 계류 가능 여부, 계류비, 선체 길이·흘수, 전기 사용량, 장기 계류 조건, 보험 요건을 계류장에 직접 확인하세요.
        </div>
      </section>

      {inquiryMarina && (
        <MarinaInquiryModal
          marina={inquiryMarina}
          user={user}
          onClose={() => setInquiryMarina(null)}
          showToast={showToast}
        />
      )}
    </>
  )
}
