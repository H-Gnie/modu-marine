import React, { useState, useEffect } from 'react'
import { byId, won } from '../utils.js'
import { supabase } from '../lib/supabase.js'
import Card from '../components/Card.jsx'
import DealerApplyModal from '../components/DealerApplyModal.jsx'

export default function Garage({
  wished, compared, recent, sellRequests,
  toggleWish, toggleCompare, viewDetail, listings, setTab, user, openAuth, showToast
}) {
  const [role, setRole] = useState(null)
  const [dealerOpen, setDealerOpen] = useState(false)

  useEffect(() => {
    if (!user) { setRole(null); return }
    let cancelled = false
    supabase.from('profiles').select('role').eq('id', user.id).single()
      .then(({ data }) => { if (!cancelled) setRole(data?.role || 'user') })
    return () => { cancelled = true }
  }, [user])
  // 실매물(DB)은 listings prop에서, 더미는 byId에서 조회
  const resolve = id => listings?.find(x => x.id === Number(id)) || byId(id)
  const wishedItems = [...wished].map(resolve).filter(Boolean)
  const recentItems = recent.map(resolve).filter(Boolean)

  const latest = sellRequests[0]
  const latestName = latest
    ? ([latest.brand, latest.model].filter(Boolean).join(' ') || latest.type || '등록 마린')
    : ''

  return (
    <>
      <div className="panel">
        <h1 className="detail-title" style={{marginTop:0}}>내마린고</h1>
        {sellRequests.length > 0 ? (
          <div className="info-grid">
            <div className="info"><span>등록 매물</span><strong>{sellRequests.length}대</strong></div>
            <div className="info"><span>대표 마린</span><strong>{latestName}</strong></div>
            <div className="info"><span>등록가</span><strong>{latest.price ? won(Number(latest.price)) : '—'}</strong></div>
            <div className="info"><span>최근 등록</span><strong>{latest.created || '—'}</strong></div>
          </div>
        ) : (
          <div className="garage-empty">
            <p>아직 등록한 마린이 없어요.<br/>내 보트·제트스키를 등록하면 여기서 관리할 수 있어요.</p>
            <button className="garage-empty-btn" onClick={() => setTab && setTab('sell')}>내마린팔기로 등록하기</button>
          </div>
        )}
      </div>

      {/* 딜러 전환 — 사업자는 국세청 자동 인증으로 딜러 전환 */}
      {role === 'dealer' ? (
        <div className="dealer-status-card">✓ 딜러 인증 완료 — 전문 매물로 등록됩니다</div>
      ) : (
        <button
          className="dealer-cta"
          onClick={() => { if (!user) { openAuth && openAuth() } else { setDealerOpen(true) } }}
        >
          <div>
            <strong>사업자세요? 딜러로 전환하세요</strong>
            <span>사업자 인증 시 매물에 ‘딜러’ 배지가 표시됩니다</span>
          </div>
          <span className="dealer-cta-arrow">›</span>
        </button>
      )}

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

      {dealerOpen && (
        <DealerApplyModal
          user={user}
          onClose={() => setDealerOpen(false)}
          showToast={showToast}
          onSuccess={() => setRole('dealer')}
        />
      )}
    </>
  )
}
