import React from 'react'
import { byId, won } from '../utils.js'
import Card from '../components/Card.jsx'

export default function Garage({
  wished, compared, recent, sellRequests,
  toggleWish, toggleCompare, viewDetail, listings
}) {
  // 실매물(DB)은 listings prop에서, 더미는 byId에서 조회
  const resolve = id => listings?.find(x => x.id === Number(id)) || byId(id)
  const wishedItems = [...wished].map(resolve).filter(Boolean)
  const recentItems = recent.map(resolve).filter(Boolean)

  return (
    <>
      <div className="panel">
        <h1 className="detail-title" style={{marginTop:0}}>내마린고</h1>
        <div className="info-grid">
          <div className="info"><span>보유 장비</span><strong>Sea-Doo Spark</strong></div>
          <div className="info"><span>AI 예상 시세</span><strong>1,420만원</strong></div>
          <div className="info"><span>보험 만료</span><strong>2026-09-30</strong></div>
          <div className="info"><span>검사 알림</span><strong>120일 남음</strong></div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>판매 진행</h2>
          <small>{sellRequests.length}건</small>
        </div>
        {sellRequests.length
          ? (
            <div className="summary-list">
              {sellRequests.map((r, idx) => (
                <div key={idx} className="sell-request">
                  <div className="sr-left">
                    <div className="sr-mode">{r.mode}</div>
                    <div className="sr-title">
                      {[r.brand, r.model, r.year ? r.year + '년' : ''].filter(Boolean).join(' ') || r.type || '선박명 미입력'}
                    </div>
                    <div className="sr-meta">
                      {r.type || ''}{r.price ? ' · ' + won(Number(r.price)) : ''}{r.region ? ' · ' + r.region : ''}
                    </div>
                  </div>
                  <span className="sr-status">{r.status}</span>
                </div>
              ))}
            </div>
          )
          : <div className="empty">진행 중인 판매가 없습니다.</div>
        }
      </section>

      <section className="section">
        <div className="section-head">
          <h2>찜한 매물</h2>
          <small>{wishedItems.length}대</small>
        </div>
        <div className="card-list">
          {wishedItems.length
            ? wishedItems.map(x => (
                <Card key={x.id} item={x} wished={wished} compared={compared}
                  onWish={toggleWish} onCompare={toggleCompare} onDetail={viewDetail} />
              ))
            : <div className="empty">찜한 매물이 없습니다.</div>
          }
        </div>
      </section>

      <section className="section" style={{paddingBottom:'22px'}}>
        <div className="section-head">
          <h2>최근 본 매물</h2>
          <small>{recentItems.length}대</small>
        </div>
        <div className="card-list">
          {recentItems.length
            ? recentItems.map(x => (
                <Card key={x.id} item={x} wished={wished} compared={compared}
                  onWish={toggleWish} onCompare={toggleCompare} onDetail={viewDetail} />
              ))
            : <div className="empty">최근 본 매물이 없습니다.</div>
          }
        </div>
      </section>
    </>
  )
}
