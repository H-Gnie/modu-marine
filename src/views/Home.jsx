import React, { useState } from 'react'
import { listings, MARINAS } from '../data.js'
import { won } from '../utils.js'
import Card from '../components/Card.jsx'

function badgeHtml(item) {
  return item.badges.slice(0, 3).map(b => (
    <span key={b} className={`badge ${b === '모두인증' ? 'orange' : ''}`}>{b}</span>
  ))
}

export default function Home({
  wished, compared, toggleWish, toggleCompare, viewDetail,
  setTab, goServiceSearch, goBudget, goTheme, updateFilters, showToast
}) {
  const [searchQ, setSearchQ] = useState('')
  const star = listings.filter(x => x.badges.includes('모두인증') || x.badges.includes('모두진단')).slice(0, 4)
  const videos = listings.filter(x => x.video).slice(0, 5)
  const newest = listings.slice(0, 4)

  function handleSearch() {
    updateFilters({ q: searchQ, category: '전체', service: '전체매물' })
    setTab('search')
  }

  return (
    <>
      <section className="hero-search">
        <div className="home-mode">내마린사기</div>
        <div className="hero-count">
          <span className="hero-count-num">{listings.length}</span>개 매물 실시간 등록 중
        </div>
        <h1>찾고 있는 마린이<br/>있으신가요?</h1>
        <div className="search-wrap">
          <input
            className="search-box"
            placeholder="제트스키, 요트, 모델명, 지역 검색"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch} aria-label="검색">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10.5" cy="10.5" r="6.5"/>
              <path d="M15.5 15.5L20 20"/>
            </svg>
          </button>
        </div>
        <div className="home-icons">
          <button onClick={() => goServiceSearch('모두진단')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
            </svg>
            <span>모두진단</span>
          </button>
          <button onClick={() => goServiceSearch('모두인증')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            <span>모두인증</span>
          </button>
          <button onClick={() => goServiceSearch('홈배송')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span>홈배송</span>
          </button>
          <button onClick={() => setTab('sell')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            <span>내마린팔기</span>
          </button>
        </div>
      </section>

      <div className="service-strip">
        <button onClick={() => goServiceSearch('전체매물')}>전체매물</button>
        <button className="service-strip-highlight" onClick={() => setTab('marinas')}>⚓ 계류장</button>
        <button onClick={() => goServiceSearch('모두진단')}>진단 매물</button>
        <button onClick={() => goServiceSearch('모두인증')}>인증 매물</button>
        <button onClick={() => goServiceSearch('홈배송')}>홈배송</button>
        <button onClick={() => showToast('AI시세 화면은 다음 단계에서 연결합니다')}>AI시세</button>
      </div>

      <div className="cat-strip">
        <button onClick={() => goServiceSearch('전체매물')}>전체</button>
        <button onClick={() => goTheme('제트스키')}>제트스키</button>
        <button onClick={() => goTheme('모터보트')}>모터보트</button>
        <button onClick={() => goTheme('낚시보트')}>낚시보트</button>
        <button onClick={() => goTheme('요트')}>요트</button>
        <button onClick={() => goTheme('RIB')}>RIB</button>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>모두스타픽</h2>
          <small onClick={() => goServiceSearch('모두인증')} style={{cursor:'pointer'}}>전체보기</small>
        </div>
        <div className="star-grid">
          {star.map(x => (
            <button key={x.id} className="star-card" onClick={() => viewDetail(x.id)}>
              <div className="sc-img" style={{backgroundImage:`url('${x.image}')`}}>
                <div className="badges">{badgeHtml(x)}</div>
              </div>
              <div className="sc-body">
                <b>{x.badges[0]}</b>
                <strong>{x.title}</strong>
                <span>{x.year}년 · {x.hours}시간<br/>{won(x.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>영상으로 생생하게</h2>
          <small onClick={() => goServiceSearch('영상')} style={{cursor:'pointer'}}>전체보기</small>
        </div>
        <div className="hscroll">
          {videos.map(x => (
            <button key={x.id} className="vid-card" onClick={() => viewDetail(x.id)}>
              <div className="vid-img" style={{backgroundImage:`url('${x.image}')`}}>
                <span className="play">▶ 영상</span>
              </div>
              <div className="vid-body">
                <div className="vid-price">{won(x.price)}</div>
                <div className="vid-title">{x.title}</div>
                <div className="vid-sub">{x.year}년 · {x.hours}시간</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>오늘의 테마픽</h2><small>더보기</small></div>
        <div className="theme-grid">
          <button onClick={() => goTheme('제트스키')}>입문용<br/>제트스키</button>
          <button onClick={() => goBudget('5000')}>5천만원 이하<br/>낚시보트</button>
          <button onClick={() => goServiceSearch('홈배송')}>바로 인도<br/>가능 매물</button>
          <button onClick={() => goTheme('요트')}>주말 크루징<br/>요트</button>
        </div>
      </section>

      <section className="section">
        <div className="budget-box">
          <h2>예산으로 마린 찾기</h2>
          <p>먼저 낼 수 있는 금액 <b>1,500만원</b> 기준,<br/>48개월 동안 <b>월 80만원대</b> 납입 시</p>
          <button className="wide-btn primary" onClick={() => goBudget('8000')}>월 80만원대 매물 찾기</button>
        </div>
      </section>

      <section className="section">
        <div className="sell-banner">
          <div>
            <h2>최고가에 내 마린 팔기</h2>
            <p>사진 5장 Self, 전문가 방문 Pro,<br/>검증 딜러 입찰</p>
          </div>
          <button className="wide-btn orange" onClick={() => setTab('sell')}>내마린팔기</button>
        </div>
      </section>

      <section className="section">
        <button className="marina-home-entry" onClick={() => setTab('marinas')}>
          <div className="marina-home-entry-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16"/>
              <path d="M6 16c2 0 2-1.5 4-1.5S12 16 14 16s2-1.5 4-1.5"/>
              <path d="M12 3v11"/>
              <path d="M8 7l4-4 4 4"/>
            </svg>
          </div>
          <div className="marina-home-entry-text">
            <strong>계류장 찾기</strong>
            <span>전국 {MARINAS.length}곳 · 상담 가능 {MARINAS.reduce((s, m) => s + m.available, 0)}자리</span>
          </div>
          <svg className="marina-home-entry-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>신규 등록 매물</h2>
          <small onClick={() => goServiceSearch('전체매물')} style={{cursor:'pointer'}}>전체보기</small>
        </div>
        <div className="card-list">
          {newest.map(x => (
            <Card key={x.id} item={x} wished={wished} compared={compared}
              onWish={toggleWish} onCompare={toggleCompare} onDetail={viewDetail} />
          ))}
        </div>
      </section>

      <section className="section" style={{paddingBottom:'22px'}}>
        <div className="panel">
          <h2 style={{margin:'0 0 13px',fontSize:'17px',fontWeight:950,color:'var(--navy)',letterSpacing:'-.025em'}}>매거진</h2>
          <div className="summary-list">
            <button className="mini-btn" style={{width:'100%',textAlign:'left',height:'40px',padding:'0 14px'}} onClick={() => showToast('매거진 화면은 준비 중입니다')}>첫 제트스키 구매 전 확인할 7가지</button>
            <button className="mini-btn" style={{width:'100%',textAlign:'left',height:'40px',padding:'0 14px'}} onClick={() => showToast('매거진 화면은 준비 중입니다')}>중고 보트 엔진시간 보는 법</button>
            <button className="mini-btn" style={{width:'100%',textAlign:'left',height:'40px',padding:'0 14px'}} onClick={() => showToast('매거진 화면은 준비 중입니다')}>선박검사와 보험 만료일 체크</button>
          </div>
        </div>
      </section>
    </>
  )
}
