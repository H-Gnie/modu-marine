import React, { useState, useEffect, useCallback } from 'react'
import { byId, won } from '../utils.js'
import { supabase } from '../lib/supabase.js'
import Card from '../components/Card.jsx'
import DealerApplyModal from '../components/DealerApplyModal.jsx'
import EditListingModal from '../components/EditListingModal.jsx'

const INQ_LABEL = { general: '일반 문의', visit: '방문/시승', delivery: '운송/인도' }
const STATUS_LABEL = { active: '게시중', reserved: '예약중', sold: '판매완료', hidden: '숨김' }

export default function Garage({
  wished, compared, recent,
  toggleWish, toggleCompare, viewDetail, listings, setTab, user, openAuth, showToast, removeSellRequest
}) {
  const [role, setRole] = useState(null)
  const [dealerOpen, setDealerOpen] = useState(false)
  const [myListings, setMyListings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [editItem, setEditItem] = useState(null)

  const loadMine = useCallback(async () => {
    if (!user) { setMyListings([]); setInquiries([]); return }
    const { data: mine } = await supabase.from('listings')
      .select('*').eq('seller_id', user.id).order('created_at', { ascending: false })
    setMyListings(mine || [])
    // RLS상 내가 판매자/구매자인 문의만 반환됨 → 내 매물에 달린 것만 추림
    const { data: inq } = await supabase.from('inquiries')
      .select('*, listings(title, seller_id)').order('created_at', { ascending: false })
    setInquiries((inq || []).filter(x => x.listings?.seller_id === user.id))
  }, [user])

  useEffect(() => {
    if (!user) { setRole(null); setMyListings([]); setInquiries([]); return }
    let cancelled = false
    supabase.from('profiles').select('role').eq('id', user.id).single()
      .then(({ data }) => { if (!cancelled) setRole(data?.role || 'user') })
    loadMine()
    return () => { cancelled = true }
  }, [user, loadMine])

  async function markSold(id) {
    await supabase.from('listings').update({ status: 'sold' }).eq('id', id)
    showToast('판매완료로 변경했습니다')
    loadMine()
  }
  async function deleteListing(id) {
    if (!window.confirm('이 매물을 내릴까요? 목록에서 삭제됩니다.')) return
    await supabase.from('listings').delete().eq('id', id)
    removeSellRequest && removeSellRequest(id) // localStorage 정리
    showToast('매물을 내렸습니다')
    loadMine()
  }

  // 실매물(DB)은 listings prop에서, 더미는 byId에서 조회
  const resolve = id => listings?.find(x => x.id === Number(id)) || byId(id)
  const wishedItems = [...wished].map(resolve).filter(Boolean)
  const recentItems = recent.map(resolve).filter(Boolean)

  const top = myListings[0]
  const topName = top ? ([top.brand, top.model].filter(Boolean).join(' ') || top.type || '등록 마린') : ''

  return (
    <>
      <div className="panel">
        <h1 className="detail-title" style={{marginTop:0}}>내마린고</h1>
        {!user ? (
          <div className="garage-empty">
            <p>로그인하면 등록한 매물과 받은 문의를 관리할 수 있어요.</p>
            <button className="garage-empty-btn" onClick={() => openAuth && openAuth()}>로그인 / 회원가입</button>
          </div>
        ) : myListings.length > 0 ? (
          <div className="info-grid">
            <div className="info"><span>등록 매물</span><strong>{myListings.length}대</strong></div>
            <div className="info"><span>대표 마린</span><strong>{topName}</strong></div>
            <div className="info"><span>등록가</span><strong>{top.price ? won(Number(top.price)) : '—'}</strong></div>
            <div className="info"><span>받은 문의</span><strong>{inquiries.length}건</strong></div>
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
      ) : user ? (
        <button
          className="dealer-cta"
          onClick={() => setDealerOpen(true)}
        >
          <div>
            <strong>사업자세요? 딜러로 전환하세요</strong>
            <span>사업자 인증 시 매물에 ‘딜러’ 배지가 표시됩니다</span>
          </div>
          <span className="dealer-cta-arrow">›</span>
        </button>
      ) : null}

      {user && myListings.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>내 매물</h2>
            <small>{myListings.length}건</small>
          </div>
          <div className="summary-list">
            {myListings.map(r => (
              <div key={r.id} className={`sell-request${r.status === 'sold' ? ' sold' : ''}`}>
                <div className="sr-left">
                  <div className="sr-mode">{r.sell_mode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self'}</div>
                  <div className="sr-title">
                    {[r.brand, r.model, r.year ? r.year + '년' : ''].filter(Boolean).join(' ') || r.type || '선박명 미입력'}
                  </div>
                  <div className="sr-meta">
                    {r.type || ''}{r.price ? ' · ' + won(Number(r.price)) : ''}{r.region ? ' · ' + r.region : ''}
                  </div>
                  <div className="sr-actions">
                    <button onClick={() => setEditItem(r)}>수정</button>
                    {r.status !== 'sold' && <button onClick={() => markSold(r.id)}>판매완료</button>}
                    <button className="danger" onClick={() => deleteListing(r.id)}>내리기</button>
                  </div>
                </div>
                <span className={`sr-status${r.status === 'sold' ? ' done' : ''}`}>{STATUS_LABEL[r.status] || r.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {user && (
        <section className="section">
          <div className="section-head">
            <h2>받은 문의</h2>
            <small>{inquiries.length}건</small>
          </div>
          {inquiries.length ? (
            <div className="summary-list">
              {inquiries.map(q => (
                <div key={q.id} className="inquiry-item">
                  <div className="inquiry-item-head">
                    <span className="inquiry-item-type">{INQ_LABEL[q.inquiry_type] || '문의'}</span>
                    <span className="inquiry-item-listing">{q.listings?.title || '매물'}</span>
                    <span className="inquiry-item-time">{q.created_at?.slice(0, 10)}</span>
                  </div>
                  <div className="inquiry-item-msg">{q.message}</div>
                  <div className="inquiry-item-buyer">
                    {q.buyer_name || '구매희망자'}{q.buyer_phone ? ` · ${q.buyer_phone}` : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="empty">아직 받은 문의가 없습니다.</div>}
        </section>
      )}

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
      {editItem && (
        <EditListingModal
          listing={editItem}
          onClose={() => setEditItem(null)}
          showToast={showToast}
          onSaved={loadMine}
        />
      )}
    </>
  )
}
