import React, { useState, useEffect } from 'react'
import { listings } from '../data.js'
import { won, gradeOf, getPhotos, badgeClass, visibleBadges } from '../utils.js'
import { supabase } from '../lib/supabase.js'
import Card from '../components/Card.jsx'
import InquiryModal from '../components/InquiryModal.jsx'

function badgeHtml(item) {
  return visibleBadges(item.badges).slice(0, 3).map(b => (
    <span key={b} className={badgeClass(b)}>{b}</span>
  ))
}

export default function Detail({
  listing, wished, compared, toggleWish, toggleCompare, viewDetail, showToast, user, openAuth
}) {
  const item = listing || listings[0]
  const [imgIdx, setImgIdx] = useState(0)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [modalType, setModalType] = useState('general')
  const openModal = (t) => { setModalType(t); setInquiryOpen(true) }
  const [sellerProfile, setSellerProfile] = useState(null)
  const photos = getPhotos(item)

  // 실매물(회원 등록)이면 판매자 공개 프로필을 불러온다
  useEffect(() => {
    setSellerProfile(null)
    if (!item.sellerId) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('nickname, avatar_url, role, created_at')
      .eq('id', item.sellerId)
      .single()
      .then(({ data }) => { if (!cancelled) setSellerProfile(data) })
    return () => { cancelled = true }
  }, [item.sellerId])
  const grade = gradeOf(item.score)
  const gradeCls = grade.replace('+', 'p')
  const isWished = wished.has(item.id)
  const isCompared = compared.has(item.id)

  return (
    <>
      <div className="detail-gallery">
        <div className="detail-main-img" style={{backgroundImage:`url('${photos[imgIdx]}')`}}>
          <div className="badges" style={{left:'14px',top:'14px'}}>{badgeHtml(item)}</div>
          {item.video && (
            <button className="play big" onClick={() => showToast('영상 플레이어는 준비 중입니다')}>▶ 영상 보기</button>
          )}
          <button
            className={`detail-wish${isWished ? ' wished' : ''}`}
            onClick={() => toggleWish(item.id)}
          >
            {isWished ? '♥' : '♡'}
          </button>
          <div className="detail-img-count">{imgIdx + 1} / {photos.length}</div>
          <div className={`grade-dot grade-${gradeCls}`} style={{bottom:'14px',left:'14px'}}>{grade}</div>
        </div>
        {photos.length > 1 && (
          <div className="detail-thumb-strip">
            {photos.map((url, i) => (
              <div
                key={i}
                className={`detail-thumb${i === imgIdx ? ' active' : ''}`}
                style={{backgroundImage:`url('${url}')`}}
                onClick={() => setImgIdx(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="detail-wrap">
        <div className="detail-price-row">
          <div>
            <h1 className="detail-title">{item.title}</h1>
            <div className="price" style={{fontSize:'26px'}}>{won(item.price)}</div>
          </div>
        </div>
        <div className="market-box">
          <b>{item.market}</b>
          <span>실거래/등록가 기반 모두 AI시세</span>
        </div>

        <section className="section">
          <div className="section-head"><h2>기본 제원</h2></div>
          <div className="info-grid">
            {[
              ['선종', item.category], ['제조사', item.brand], ['모델', item.model],
              ['연식', `${item.year}년`], ['운항시간', `${item.hours}h`], ['선체 길이', item.length],
              ['엔진', item.engine], ['계류지', item.marina],
              ['트레일러', item.trailer ? '포함' : '별도'], ['판매자', item.seller]
            ].map(([a, b]) => (
              <div key={a} className="info"><span>{a}</span><strong>{b}</strong></div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>모두진단 리포트</h2>
            <button className="badge-info-btn" onClick={() => showToast('모두 진단은 점검일 현재 확인 가능한 범위의 거래 참고용 리포트입니다. 법정 선박검사를 대체하지 않습니다.')}>ⓘ 기준 안내</button>
          </div>
          <div className="report-lockwrap">
            <div className={`report${user ? '' : ' locked'}`}>
              {Object.entries(item.inspection).map(([k, v]) => {
                const good = ['A', 'A+', 'S', '완료', '양호', '매우 양호', '예약 가능'].includes(v)
                return (
                  <div key={k}>
                    <strong>{k}</strong>
                    <span className={good ? 'rep-good' : 'rep-warn'}>{v}</span>
                  </div>
                )
              })}
            </div>
            {!user && (
              <div className="report-lock-cta">
                <div className="lock-icon">🔒</div>
                <p>선체·엔진·전장·추진계 <strong>상세 진단 등급</strong>은<br/>회원에게만 공개됩니다</p>
                <button className="lock-btn" onClick={openAuth}>회원가입하고 전체 리포트 보기</button>
              </div>
            )}
          </div>
          <p className="diagnosis-notice">모두 진단은 점검일 현재 확인 가능한 범위에서 작성된 거래 참고용 리포트입니다. 비분해 육안 점검·작동 확인 방식이며, 수중부·내부 부품·잠재 하자·점검 이후 발생한 상태 변화까지 보증하지 않습니다. 법정 선박검사, 선급검사, 제조사 보증을 대체하지 않습니다.</p>
        </section>

        {item.badges.includes('모두인증') && (
          <section className="section">
            <div className="section-head">
              <h2>모두 인증</h2>
              <button className="badge-info-btn" onClick={() => showToast('모두 인증은 법정 선박검사를 대체하지 않는 민간 검증 표시입니다. 선체·엔진·서류·이력 등 주요 항목을 확인하고 기준을 통과한 매물에 부여됩니다.')}>ⓘ 기준 안내</button>
            </div>
            <p className="diagnosis-notice">모두 인증은 모두의 마린이 정한 민간 기준을 통과한 매물에 부여됩니다. 선박의 무하자, 향후 고장 없음, 법정 운항 가능성 또는 특정 목적 적합성을 보증하는 의미가 아닙니다. 최종 구매 판단은 구매자의 직접 확인 및 시운전을 권장합니다.</p>
          </section>
        )}

        <section className="section">
          <div className="section-head"><h2>사고 / 침수 / 좌초 이력</h2></div>
          <div className="history-box">
            {[['사고','이력 없음'],['침수','이력 없음'],['좌초','이력 없음'],['대수리','이력 없음']].map(([k, v]) => (
              <div key={k} className="history-row">
                <span className="hist-label">{k}</span>
                <strong className="hist-none">{v}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head"><h2>등록 / 검사 / 보험</h2></div>
          <div className="info-grid">
            {[['선박 등록증','정상'],['선박 검사','유효'],['보험','가입'],['등록 연도',`${item.year}년`]].map(([a, b]) => (
              <div key={a} className="info"><span>{a}</span><strong>{b}</strong></div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head"><h2>포함 품목</h2></div>
          <div className="include-list">
            {(item.trailer ? ['트레일러'] : [])
              .concat(['구명조끼 2개', '소화기', '선박 서류 일체', item.video ? '영상 자료' : ''])
              .filter(Boolean)
              .map(t => <span key={t} className="include-tag">{t}</span>)}
          </div>
        </section>

        <section className="section">
          <div className="section-head"><h2>예상 추가 비용</h2></div>
          <div className="extra-cost-list">
            <div className="extra-cost"><span>육상 운송비</span><strong>거리에 따라 20~80만원</strong></div>
            <div className="extra-cost"><span>연간 계류비</span><strong>마리나별 상이 (80~300만원/년)</strong></div>
            <div className="extra-cost"><span>선박 보험료</span><strong>차량가액의 약 1~2% (연)</strong></div>
            <div className="extra-cost"><span>선박 검사비</span><strong>5~20만원 (유효 시 해당 없음)</strong></div>
          </div>
          {user ? (
            <div className="member-benefit on">✓ 회원 혜택 적용 중 — 제휴 선박 검사 <strong>10% 할인</strong>, 계류비 견적 무료</div>
          ) : (
            <button className="member-benefit cta" onClick={openAuth}>
              🎁 회원가입 시 <strong>선박 검사비 10% 할인</strong> + 맞춤 비용 견적 제공 →
            </button>
          )}
        </section>

        <section className="section">
          <div className="section-head"><h2>판매자 정보</h2></div>
          <div className="seller-box">
            <div className="seller-avatar">
              {sellerProfile?.avatar_url
                ? <img src={sellerProfile.avatar_url} alt="" />
                : <span>{(sellerProfile?.nickname || item.seller || '판')[0]}</span>}
            </div>
            <div className="seller-info">
              <div className="seller-name">
                {sellerProfile?.nickname || item.seller}
                {item.sellerId && <span className="seller-verified">✓ 인증 회원</span>}
              </div>
              <div className="seller-sub">
                {item.location} · {item.marina}
                {sellerProfile?.created_at && ` · 가입 ${sellerProfile.created_at.slice(0, 7).replace('-', '.')}`}
              </div>
            </div>
          </div>
          <div className="notice" style={{marginTop:'12px'}}>실소유자, 선박 등록 정보, 계류/인도 장소를 반드시 확인하세요. 앱 밖 계약금 송금이나 제3자 명의 거래는 권장하지 않습니다.</div>
        </section>

        <section className="section" style={{paddingBottom:'22px'}}>
          <div className="section-head"><h2>비슷한 매물</h2><small>{item.category}</small></div>
          <div className="card-list">
            {listings.filter(x => x.category === item.category && x.id !== item.id).slice(0, 2).map(x => (
              <Card key={x.id} item={x} wished={wished} compared={compared}
                onWish={toggleWish} onCompare={toggleCompare} onDetail={viewDetail} />
            ))}
          </div>
        </section>
      </div>

      <div className="sticky-cta">
        <button
          className="sticky-btn primary"
          style={{gridColumn:'span 2'}}
          onClick={() => openModal('general')}
        >
          문의하기
        </button>
        <button
          className={`sticky-btn${isCompared ? ' cmp-on' : ' outline'}`}
          onClick={() => toggleCompare(item.id)}
        >
          ⇄ {isCompared ? '비교중' : '비교담기'}
        </button>
        <button
          className="sticky-btn orange"
          onClick={() => openModal('visit')}
        >
          방문예약
        </button>
      </div>

      {inquiryOpen && (
        <InquiryModal
          item={item}
          user={user}
          onClose={() => setInquiryOpen(false)}
          showToast={showToast}
          initialType={modalType}
          title={modalType === 'visit' ? '방문 예약 요청' : '매물 문의'}
        />
      )}
    </>
  )
}
