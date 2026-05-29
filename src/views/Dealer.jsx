import React from 'react'
import { DEALER } from '../data.js'
import { byId, won } from '../utils.js'

const statusColor = { '게시중': '#1469FF', '문의중': '#FF5F1F', '상담예약': '#00A8C6', '거래완료': '#8896A7' }
const statusBg   = { '게시중': '#EEF5FF', '문의중': '#FFF4EE', '상담예약': '#E6F7FA', '거래완료': '#F4F7FB' }

export default function Dealer({ viewDetail, setTab, showToast }) {
  const unread = DEALER.inquiries.filter(q => !q.read).length

  return (
    <>
      <div className="dealer-header">
        <div className="dealer-thumb" style={{backgroundImage:`url('${DEALER.image}')`}} />
        <div className="dealer-info">
          <div className="dealer-name">
            {DEALER.name}
            {DEALER.certified && <span className="dealer-cert">모두인증</span>}
          </div>
          <div className="dealer-meta">{DEALER.region} · {DEALER.since}년 개업</div>
          <div className="dealer-rating">★ {DEALER.rating} <span>(후기 {DEALER.reviewCount}건)</span></div>
        </div>
      </div>

      <section className="section">
        <div className="section-head"><h2>이번달 현황</h2></div>
        <div className="dstat-grid">
          <div className="dstat">
            <div className="dstat-val">{DEALER.stats.listed}</div>
            <div className="dstat-label">등록 매물</div>
          </div>
          <div className="dstat">
            <div className="dstat-val">{DEALER.stats.monthlyInquiries}</div>
            <div className="dstat-label">이달 문의</div>
          </div>
          <div className="dstat">
            <div className="dstat-val">{DEALER.stats.completedDeals}</div>
            <div className="dstat-label">누적 거래</div>
          </div>
          <div className="dstat">
            <div className="dstat-val">{DEALER.stats.settlementPending}만</div>
            <div className="dstat-label">정산 예정</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>내 매물</h2>
          <button className="mini-btn primary" onClick={() => setTab('sell')} style={{height:'30px',fontSize:'12px'}}>+ 새 매물</button>
        </div>
        <div className="dlisting-list">
          {DEALER.myListings.map(dl => {
            const item = byId(dl.id)
            if (!item) return null
            const sc = statusColor[dl.status] || '#8896A7'
            const sb = statusBg[dl.status]   || '#F4F7FB'
            return (
              <div key={dl.id} className="dlisting">
                <div className="dlisting-thumb" style={{backgroundImage:`url('${item.image}')`}} />
                <div className="dlisting-body">
                  <div className="dlisting-status" style={{color:sc,background:sb}}>{dl.status}</div>
                  <div className="dlisting-title">{item.title}</div>
                  <div className="dlisting-price">{won(item.price)}</div>
                  <div className="dlisting-meta">조회 {dl.views} · 문의 {dl.inquiries}건</div>
                </div>
                <div className="dlisting-actions">
                  <button className="mini-btn" onClick={() => viewDetail(item.id)}>상세</button>
                  <button className="mini-btn" onClick={() => showToast('매물 수정 화면은 준비 중입니다')}>수정</button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="section" style={{paddingBottom:'22px'}}>
        <div className="section-head">
          <h2>최근 문의</h2>
          {unread > 0
            ? <span className="unread-badge">{unread}건 미확인</span>
            : <small>모두 확인</small>
          }
        </div>
        <div className="dinquiry-list">
          {DEALER.inquiries.map((q, i) => (
            <div key={i} className={`dinquiry${q.read ? '' : ' dinquiry-unread'}`}>
              <div className={`dinquiry-dot${q.read ? '' : ' dot-active'}`} />
              <div className="dinquiry-info">
                <div className="dinquiry-item">{q.item}</div>
                <div className="dinquiry-type">{q.type}</div>
              </div>
              <div className="dinquiry-meta">
                <div className="dinquiry-time">{q.time}</div>
                <button
                  className="mini-btn"
                  style={{height:'28px',fontSize:'11px'}}
                  onClick={() => showToast('문의 답변 화면은 준비 중입니다')}
                >
                  {q.read ? '보기' : '답변'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
