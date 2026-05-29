import { listings, DEALER, PHOTO_SLOTS } from './data.js';
import { state } from './state.js';
import { won, byId, gradeOf, getPhotos, showToast } from './utils.js';

export function filteredListings() {
  let rows = listings.filter(item => {
    const f = state.filters;
    const matchQ = !f.q || `${item.title} ${item.brand} ${item.model} ${item.location} ${item.badges.join(' ')}`.toLowerCase().includes(f.q.toLowerCase());
    const matchCategory = f.category === '전체' || item.category === f.category;
    const matchPrice = !f.maxPrice || item.price <= Number(f.maxPrice);
    const matchRegion = f.region === '전체' || item.location.includes(f.region);
    const matchCertified = !f.certified || item.badges.includes('모두인증') || item.badges.includes('모두진단');
    const matchDelivery = !f.delivery || item.badges.includes('홈배송');
    const matchService = f.service === '전체매물' || item.badges.includes(f.service) || item.category === f.service;
    return matchQ && matchCategory && matchPrice && matchRegion && matchCertified && matchDelivery && matchService;
  });
  const s = state.filters.sort;
  if (s === '최신순') rows.sort((a, b) => b.created.localeCompare(a.created));
  if (s === '낮은 가격순') rows.sort((a, b) => a.price - b.price);
  if (s === '높은 가격순') rows.sort((a, b) => b.price - a.price);
  if (s === '운항시간순') rows.sort((a, b) => a.hours - b.hours);
  if (s === '추천순') rows.sort((a, b) => b.score - a.score);
  return rows;
}

export function badgeHtml(item) {
  return item.badges.slice(0, 3).map(b =>
    `<span class="badge ${b === '모두인증' ? 'orange' : ''}">${b}</span>`
  ).join('');
}

export function card(item, compact = false) {
  const wished = state.wished.has(item.id);
  const grade = gradeOf(item.score);
  const gradeCls = grade.replace('+', 'p');
  const mktPart = (item.market.split('·')[1] || '').trim();
  const hintCls = mktPart.includes('낮음') ? 'hint-good' : mktPart.includes('높음') ? 'hint-high' : 'hint-fair';
  return `
    <article class="listing-card ${compact ? 'compact' : ''}" data-detail="${item.id}">
      <div class="thumb" style="background-image:url('${item.image}')">
        <div class="badges">${badgeHtml(item)}</div>
        <button class="card-wish" data-wish="${item.id}" aria-label="${wished ? '찜 해제' : '찜하기'}">${wished ? '♥' : '♡'}</button>
        ${item.video ? '<span class="play">▶</span>' : ''}
        <div class="grade-dot grade-${gradeCls}">${grade}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <div class="price">${won(item.price)}</div>
        <div class="specs">${item.year}년 · ${item.hours}h · ${item.location}</div>
        <div class="specs">${item.length} · ${item.engine}</div>
        ${mktPart ? `<div class="mkt-hint ${hintCls}">${mktPart}</div>` : ''}
        <div class="card-bottom-row">
          <div class="one-line">${item.seller}</div>
          <button class="card-cmp-btn${state.compared.has(item.id) ? ' on' : ''}" data-compare="${item.id}">⇄ ${state.compared.has(item.id) ? '비교중' : '비교'}</button>
        </div>
      </div>
    </article>`;
}

export function home() {
  const star = listings.filter(x => x.badges.includes('모두인증') || x.badges.includes('모두진단')).slice(0, 4);
  const videos = listings.filter(x => x.video).slice(0, 5);
  const newest = listings.slice(0, 4);

  return `
    <section class="hero-search">
      <div class="home-mode">내마린사기</div>
      <div class="hero-count"><span class="hero-count-num">${listings.length}</span>개 매물 실시간 등록 중</div>
      <h1>찾고 있는 마린이<br>있으신가요?</h1>
      <div class="search-wrap">
        <input class="search-box" id="homeSearch" placeholder="제트스키, 요트, 모델명, 지역 검색"/>
        <button class="search-btn" data-do-search aria-label="검색">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg>
        </button>
      </div>
      <div class="home-icons">
        <button data-service="모두진단">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
          <span>모두진단</span>
        </button>
        <button data-service="모두인증">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          <span>모두인증</span>
        </button>
        <button data-service="홈배송">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <span>홈배송</span>
        </button>
        <button data-tab="sell">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <span>내마린팔기</span>
        </button>
      </div>
    </section>

    <div class="service-strip">
      <button data-service="전체매물">전체매물</button>
      <button data-service="모두진단">진단 매물</button>
      <button data-service="모두인증">인증 매물</button>
      <button data-service="홈배송">홈배송</button>
      <button data-open-ai>AI시세</button>
    </div>

    <div class="cat-strip">
      <button data-service="전체매물">전체</button>
      <button data-theme="제트스키">제트스키</button>
      <button data-theme="모터보트">모터보트</button>
      <button data-theme="낚시보트">낚시보트</button>
      <button data-theme="요트">요트</button>
      <button data-theme="RIB">RIB</button>
    </div>

    <section class="section">
      <div class="section-head"><h2>모두스타픽</h2><small data-service="모두인증">전체보기</small></div>
      <div class="star-grid">
        ${star.map(x => `
          <button class="star-card" data-detail="${x.id}">
            <div class="sc-img" style="background-image:url('${x.image}')">
              <div class="badges">${badgeHtml(x)}</div>
            </div>
            <div class="sc-body">
              <b>${x.badges[0]}</b>
              <strong>${x.title}</strong>
              <span>${x.year}년 · ${x.hours}시간<br>${won(x.price)}</span>
            </div>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>영상으로 생생하게</h2><small data-service="영상">전체보기</small></div>
      <div class="hscroll">
        ${videos.map(x => `
          <button class="vid-card" data-detail="${x.id}">
            <div class="vid-img" style="background-image:url('${x.image}')">
              <span class="play">▶ 영상</span>
            </div>
            <div class="vid-body">
              <div class="vid-price">${won(x.price)}</div>
              <div class="vid-title">${x.title}</div>
              <div class="vid-sub">${x.year}년 · ${x.hours}시간</div>
            </div>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>오늘의 테마픽</h2><small>더보기</small></div>
      <div class="theme-grid">
        <button data-theme="제트스키">입문용<br>제트스키</button>
        <button data-budget="5000">5천만원 이하<br>낚시보트</button>
        <button data-service="홈배송">바로 인도<br>가능 매물</button>
        <button data-theme="요트">주말 크루징<br>요트</button>
      </div>
    </section>

    <section class="section">
      <div class="budget-box">
        <h2>예산으로 마린 찾기</h2>
        <p>먼저 낼 수 있는 금액 <b>1,500만원</b> 기준,<br>48개월 동안 <b>월 80만원대</b> 납입 시</p>
        <button class="wide-btn primary" data-budget="8000">월 80만원대 매물 찾기</button>
      </div>
    </section>

    <section class="section">
      <div class="sell-banner">
        <div>
          <h2>최고가에 내 마린 팔기</h2>
          <p>사진 5장 Self, 전문가 방문 Pro,<br>검증 딜러 입찰</p>
        </div>
        <button class="wide-btn orange" data-tab="sell">내마린팔기</button>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>신규 등록 매물</h2><small data-service="전체매물">전체보기</small></div>
      <div class="card-list">${newest.map(x => card(x)).join('')}</div>
    </section>

    <section class="section" style="padding-bottom:22px;">
      <div class="panel">
        <h2 style="margin:0 0 13px;font-size:17px;font-weight:950;color:var(--navy);letter-spacing:-.025em;">매거진</h2>
        <div class="summary-list">
          <button class="mini-btn" style="width:100%;text-align:left;height:40px;padding:0 14px;">첫 제트스키 구매 전 확인할 7가지</button>
          <button class="mini-btn" style="width:100%;text-align:left;height:40px;padding:0 14px;">중고 보트 엔진시간 보는 법</button>
          <button class="mini-btn" style="width:100%;text-align:left;height:40px;padding:0 14px;">선박검사와 보험 만료일 체크</button>
        </div>
      </div>
    </section>`;
}

export function search() {
  const rows = filteredListings();
  const services = ['전체매물', '모두진단', '모두인증', '홈배송', '영상'];
  return `
    <div class="filter-panel">
      <div class="chips">
        ${services.map(s => `<button class="chip ${state.filters.service === s ? 'active' : ''}" data-service-filter="${s}">${s}</button>`).join('')}
      </div>
      <div class="field"><label>검색어</label><input id="q" value="${state.filters.q}" placeholder="모델, 제조사, 지역"/></div>
      <div class="filter-row">
        <div class="field"><label>선종</label>
          <select id="category">${['전체','제트스키','모터보트','낚시보트','요트','RIB'].map(x => `<option ${state.filters.category === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        </div>
        <div class="field"><label>최대 가격</label>
          <select id="maxPrice"><option value="">전체</option>${[3000,5000,8000,15000,25000].map(x => `<option value="${x}" ${state.filters.maxPrice == x ? 'selected' : ''}>${won(x)} 이하</option>`).join('')}</select>
        </div>
      </div>
      <div class="filter-row">
        <div class="field"><label>지역</label>
          <select id="region">${['전체','서울','경기','부산','인천','강원','충남','전남','경남','제주'].map(x => `<option ${state.filters.region === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        </div>
        <div class="field"><label>정렬</label>
          <select id="sort">${['추천순','최신순','낮은 가격순','높은 가격순','운항시간순'].map(x => `<option ${state.filters.sort === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        </div>
      </div>
    </div>
    <div class="section-head" style="padding:0 0 4px;">
      <h2 id="search-count" style="font-size:16px;font-weight:950;color:var(--navy);">매물 ${rows.length}대</h2>
      <small style="color:var(--muted);">${state.filters.sort}</small>
    </div>
    <div id="search-results" class="card-list">${rows.length ? rows.map(x => card(x)).join('') : '<div class="empty">조건에 맞는 매물이 없습니다.</div>'}</div>`;
}

export function detail() {
  const item = state.listing || listings[0];
  const wished = state.wished.has(item.id);
  const grade = gradeOf(item.score);
  const gradeCls = grade.replace('+', 'p');
  return `
    <div class="detail-gallery">
      ${(() => {
        const photos = getPhotos(item);
        return `
      <div class="detail-main-img" style="background-image:url('${photos[0]}')">
        <div class="badges" style="left:14px;top:14px;">${badgeHtml(item)}</div>
        ${item.video ? '<button class="play big" data-action="영상 플레이어는 준비 중입니다">▶ 영상 보기</button>' : ''}
        <button class="detail-wish ${wished ? 'wished' : ''}" data-wish="${item.id}">${wished ? '♥' : '♡'}</button>
        <div class="detail-img-count">1 / ${photos.length}</div>
        <div class="grade-dot grade-${gradeCls}" style="bottom:14px;left:14px;">${grade}</div>
      </div>
      ${photos.length > 1 ? `<div class="detail-thumb-strip">
        ${photos.map((url, i) => `<div class="detail-thumb${i === 0 ? ' active' : ''}" data-src="${url}" data-idx="${i + 1}" style="background-image:url('${url}')"></div>`).join('')}
      </div>` : ''}`;
      })()}
    </div>

    <div class="detail-wrap">
      <div class="detail-price-row">
        <div>
          <h1 class="detail-title">${item.title}</h1>
          <div class="price" style="font-size:26px;">${won(item.price)}</div>
        </div>
      </div>
      <div class="market-box">
        <b>${item.market}</b>
        <span>실거래/등록가 기반 모두 AI시세</span>
      </div>

      <section class="section">
        <div class="section-head"><h2>기본 제원</h2></div>
        <div class="info-grid">
          ${[['선종',item.category],['제조사',item.brand],['모델',item.model],['연식',`${item.year}년`],['운항시간',`${item.hours}h`],['선체 길이',item.length],['엔진',item.engine],['계류지',item.marina],['트레일러',item.trailer?'포함':'별도'],['판매자',item.seller]].map(([a,b]) => `<div class="info"><span>${a}</span><strong>${b}</strong></div>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <h2>모두진단 리포트</h2>
          <button class="badge-info-btn" data-action="모두 진단은 점검일 현재 확인 가능한 범위의 거래 참고용 리포트입니다. 법정 선박검사를 대체하지 않습니다.">ⓘ 기준 안내</button>
        </div>
        <div class="report">
          ${Object.entries(item.inspection).map(([k,v]) => {
            const good = ['A','A+','S','완료','양호','매우 양호','예약 가능'].includes(v);
            return `<div><strong>${k}</strong><span class="${good ? 'rep-good' : 'rep-warn'}">${v}</span></div>`;
          }).join('')}
        </div>
        <p class="diagnosis-notice">모두 진단은 점검일 현재 확인 가능한 범위에서 작성된 거래 참고용 리포트입니다. 비분해 육안 점검·작동 확인 방식이며, 수중부·내부 부품·잠재 하자·점검 이후 발생한 상태 변화까지 보증하지 않습니다. 법정 선박검사, 선급검사, 제조사 보증을 대체하지 않습니다.</p>
      </section>
      ${item.badges.includes('모두인증') ? `
      <section class="section">
        <div class="section-head"><h2>모두 인증</h2><button class="badge-info-btn" data-action="모두 인증은 법정 선박검사를 대체하지 않는 민간 검증 표시입니다. 선체·엔진·서류·이력 등 주요 항목을 확인하고 기준을 통과한 매물에 부여됩니다.">ⓘ 기준 안내</button></div>
        <p class="diagnosis-notice">모두 인증은 모두의 마린이 정한 민간 기준을 통과한 매물에 부여됩니다. 선박의 무하자, 향후 고장 없음, 법정 운항 가능성 또는 특정 목적 적합성을 보증하는 의미가 아닙니다. 최종 구매 판단은 구매자의 직접 확인 및 시운전을 권장합니다.</p>
      </section>` : ''}

      <section class="section">
        <div class="section-head"><h2>사고 / 침수 / 좌초 이력</h2></div>
        <div class="history-box">
          ${[['사고','이력 없음'],['침수','이력 없음'],['좌초','이력 없음'],['대수리','이력 없음']].map(([k,v]) =>
            `<div class="history-row"><span class="hist-label">${k}</span><strong class="hist-none">${v}</strong></div>`
          ).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>등록 / 검사 / 보험</h2></div>
        <div class="info-grid">
          ${[['선박 등록증','정상'],['선박 검사','유효'],['보험','가입'],['등록 연도',`${item.year}년`]].map(([a,b]) => `<div class="info"><span>${a}</span><strong>${b}</strong></div>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>포함 품목</h2></div>
        <div class="include-list">
          ${(item.trailer ? ['트레일러'] : []).concat(['구명조끼 2개','소화기','선박 서류 일체',(item.video?'영상 자료':'')]).filter(Boolean).map(t => `<span class="include-tag">${t}</span>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>예상 추가 비용</h2></div>
        <div class="extra-cost-list">
          <div class="extra-cost"><span>육상 운송비</span><strong>거리에 따라 20~80만원</strong></div>
          <div class="extra-cost"><span>연간 계류비</span><strong>마리나별 상이 (80~300만원/년)</strong></div>
          <div class="extra-cost"><span>선박 보험료</span><strong>차량가액의 약 1~2% (연)</strong></div>
          <div class="extra-cost"><span>선박 검사비</span><strong>5~20만원 (유효 시 해당 없음)</strong></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>판매자 정보</h2></div>
        <div class="seller-box">
          <div class="seller-info">
            <div class="seller-name">${item.seller}</div>
            <div class="seller-sub">${item.location} · ${item.marina}</div>
          </div>
          <button class="mini-btn" data-action="판매자 프로필은 준비 중입니다">프로필 보기</button>
        </div>
        <div class="notice" style="margin-top:12px;">실소유자, 선박 등록 정보, 계류/인도 장소를 반드시 확인하세요. 앱 밖 계약금 송금이나 제3자 명의 거래는 권장하지 않습니다.</div>
      </section>

      <section class="section" style="padding-bottom:22px;">
        <div class="section-head"><h2>비슷한 매물</h2><small>${item.category}</small></div>
        <div class="card-list">
          ${listings.filter(x => x.category === item.category && x.id !== item.id).slice(0, 2).map(x => card(x)).join('')}
        </div>
      </section>
    </div>

    <div class="sticky-cta">
      <button class="sticky-btn primary" style="grid-column:span 2" data-action="문의가 접수되었습니다">문의하기</button>
      <button class="sticky-btn${state.compared.has(item.id) ? ' cmp-on' : ' outline'}" data-compare="${item.id}">⇄ ${state.compared.has(item.id) ? '비교중' : '비교담기'}</button>
      <button class="sticky-btn orange" data-action="방문 예약 화면은 준비 중입니다">방문예약</button>
    </div>`;
}

export function compare() {
  const items = [...state.compared].map(byId).filter(Boolean);
  if (items.length === 0) {
    return `
      <div class="panel">
        <h1 class="detail-title" style="margin-top:0;">비교함</h1>
        <div class="empty" style="padding:52px 0;text-align:center;">
          비교할 매물이 없습니다.<br>
          <small style="color:var(--muted);">매물 카드의 ⇄ 버튼으로 추가하세요.</small>
        </div>
        <button class="wide-btn primary" style="border-radius:var(--r-md);margin-top:8px;" data-tab="search">매물 검색하러 가기</button>
      </div>`;
  }

  const gradeRank = { 'S':5, 'A+':4, 'A':3, 'B+':2, 'B':1 };
  const minPrice  = Math.min(...items.map(x => x.price));
  const minHours  = Math.min(...items.map(x => x.hours));
  const maxYear   = Math.max(...items.map(x => x.year));
  const maxGrade  = Math.max(...items.map(x => gradeRank[gradeOf(x.score)]));

  const rows = [
    { label:'가격',     fn: x => won(x.price),                      best: x => x.price === minPrice },
    { label:'AI시세',   fn: x => (x.market.split('·')[1]||'').trim() || '-' },
    { label:'등급',     fn: x => gradeOf(x.score),                  best: x => gradeRank[gradeOf(x.score)] === maxGrade },
    { label:'연식',     fn: x => `${x.year}년`,                      best: x => x.year === maxYear },
    { label:'운항시간', fn: x => `${x.hours}h`,                      best: x => x.hours === minHours },
    { label:'선체 길이', fn: x => x.length },
    { label:'엔진',     fn: x => x.engine },
    { label:'지역',     fn: x => x.location },
  ];

  return `
    <div class="panel">
      <div class="cmp-page-header">
        <h1 class="detail-title" style="margin:0;">비교함 <span style="color:var(--blue)">${items.length}</span>대</h1>
        <button class="text-link" data-compare-clear>전체 초기화</button>
      </div>
      <p class="cmp-legend">녹색 ✓ 는 비교 항목 중 유리한 값입니다.</p>
      <div class="cmp-table">
        <div class="cmp-label-col">
          <div class="cmp-head-cell"></div>
          <div class="cmp-img-head"></div>
          ${rows.map(r => `<div class="cmp-label-cell">${r.label}</div>`).join('')}
          <div class="cmp-label-cell badge-row">배지</div>
          <div class="cmp-action-head"></div>
        </div>
        <div class="cmp-scroll">
          ${items.map(item => {
            const grade = gradeOf(item.score);
            const gradeCls = grade.replace('+', 'p');
            return `
              <div class="cmp-col">
                <div class="cmp-head-cell">
                  <button class="cmp-remove-btn" data-compare="${item.id}" aria-label="제거">×</button>
                </div>
                <div class="cmp-img-cell" data-detail="${item.id}">
                  <div class="cmp-thumb" style="background-image:url('${item.image}')">
                    <div class="grade-dot grade-${gradeCls}" style="bottom:5px;left:5px;font-size:10px;padding:2px 5px;">${grade}</div>
                  </div>
                  <div class="cmp-item-title">${item.title}</div>
                </div>
                ${rows.map(r => {
                  const isBest = r.best && items.length > 1 && r.best(item);
                  return `<div class="cmp-cell${isBest ? ' best' : ''}">${r.fn(item)}${isBest ? ' ✓' : ''}</div>`;
                }).join('')}
                <div class="cmp-cell cmp-badge-cell">
                  ${item.badges.slice(0,2).map(b => `<span class="badge ${b==='모두인증'?'orange':''}">${b}</span>`).join('')}
                </div>
                <div class="cmp-action-cell">
                  <button class="wide-btn primary" style="border-radius:var(--r-sm);font-size:12px;padding:8px 0;" data-detail="${item.id}">상세보기</button>
                </div>
              </div>`;
          }).join('')}
          ${items.length < 4 ? `
            <div class="cmp-col cmp-add-col">
              <div class="cmp-head-cell"></div>
              <div class="cmp-img-head cmp-add-slot" data-tab="search">
                <span style="font-size:26px;font-weight:300;color:var(--muted);">+</span>
                <span style="font-size:11px;color:var(--muted);">매물 추가</span>
              </div>
            </div>` : ''}
        </div>
      </div>
    </div>`;
}

export function sell() {
  const s = state.sellStep;
  const steps = Array.from({length: 7}, (_, i) =>
    `<div class="step ${i <= s ? 'active' : ''}"></div>`
  ).join('');
  const stepFns = [sellStep0, sellStep1, sellStep2, sellStep3, sellStep4, sellStep5, sellStep6];
  return `
    <section>
      <h1 class="detail-title" style="margin-bottom:4px;">내마린팔기</h1>
      <div class="sell-stepper">${steps}</div>
      <div class="sell-step-label">단계 ${s + 1} / 7</div>
      ${stepFns[s]()}
    </section>`;
}

export function sellStep0() {
  return `
    <div class="sell-card">
      <h2>판매 방식을 선택하세요</h2>
      <div class="mode-grid">
        <button class="mode ${state.sellMode === 'self' ? 'active' : ''}" data-mode="self">
          <strong>내마린팔기 Self</strong>
          <span>사진 직접 등록<br>72시간 검증 딜러 입찰</span>
          <em class="mode-fee">수수료 2.5%</em>
        </button>
        <button class="mode ${state.sellMode === 'pro' ? 'active' : ''}" data-mode="pro">
          <strong>내마린팔기 Pro</strong>
          <span>전문 평가사 방문 진단<br>48시간 입찰</span>
          <em class="mode-fee">수수료 3.5%</em>
        </button>
      </div>
      <button class="wide-btn primary" style="margin-top:16px;" data-next>다음</button>
    </div>`;
}

export function sellStep1() {
  const d = state.sellData;
  return `
    <div class="sell-card">
      <h2>선박 기본 정보</h2>
      <div class="field">
        <label>선종</label>
        <select data-sell-key="type">
          ${['제트스키','모터보트','낚시보트','요트','RIB'].map(t => `<option ${d.type===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field"><label>제조사</label><input data-sell-key="brand" value="${d.brand}" placeholder="예: Yamaha"/></div>
        <div class="field"><label>모델명</label><input data-sell-key="model" value="${d.model}" placeholder="예: VX Cruiser"/></div>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field"><label>연식</label><input type="number" data-sell-key="year" value="${d.year}" placeholder="2021"/></div>
        <div class="field"><label>등록번호 / HIN</label><input data-sell-key="hin" value="${d.hin}" placeholder="선택 입력"/></div>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

export function sellStep2() {
  const d = state.sellData;
  const regions = ['서울','경기','부산','인천','강원','충남','전남','경남','제주'];
  return `
    <div class="sell-card">
      <h2>가격 및 위치</h2>
      <div class="field">
        <label>희망 판매 가격 (만원)</label>
        <input type="number" data-sell-key="price" value="${d.price}" placeholder="예: 2500"/>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field">
          <label>지역</label>
          <select data-sell-key="region">
            ${regions.map(r => `<option ${d.region===r?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>계류지 / 마리나</label><input data-sell-key="marina" value="${d.marina}" placeholder="예: 전곡항"/></div>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

export function sellStep3() {
  const d = state.sellData;
  return `
    <div class="sell-card">
      <h2>제원 정보</h2>
      <div class="filter-row">
        <div class="field"><label>운항시간 (h)</label><input type="number" data-sell-key="hours" value="${d.hours}" placeholder="68"/></div>
        <div class="field"><label>선체 길이</label><input data-sell-key="length" value="${d.length}" placeholder="3.5m"/></div>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field">
          <label>엔진 종류</label>
          <select data-sell-key="engine">
            ${['아웃보드','인보드','제트','디젤','전기'].map(t => `<option ${d.engine===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>마력 (HP)</label><input type="number" data-sell-key="hp" value="${d.hp}" placeholder="150"/></div>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

export function sellStep4() {
  const d = state.sellData;
  return `
    <div class="sell-card">
      <h2>서류 및 안전 상태</h2>
      <div class="field">
        <label>선박 등록증</label>
        <select data-sell-key="regStatus">
          ${['정상','말소 예정','미등록'].map(s => `<option ${d.regStatus===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin-top:10px;">
        <label>선박 검사 (선박법)</label>
        <select data-sell-key="inspStatus">
          ${['유효','만료','해당 없음'].map(s => `<option ${d.inspStatus===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin-top:10px;">
        <label>보험 상태</label>
        <select data-sell-key="insStatus">
          ${['가입','만료','미가입'].map(s => `<option ${d.insStatus===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

export function sellStep5() {
  const d = state.sellData;
  const uploaded = Object.values(d.photos).filter(Boolean).length;
  return `
    <div class="sell-card">
      <h2>사진 등록</h2>
      <p class="sell-hint">각 박스를 <b>탭하면 사진을 선택</b>할 수 있습니다. 필수(*) 4장 이상 등록해 주세요.</p>
      <div class="photo-count-bar">
        <span class="photo-count-num">${uploaded}</span> / ${PHOTO_SLOTS.length}장 등록됨
      </div>
      <div class="photo-guide-grid">
        ${PHOTO_SLOTS.map(s => {
          const url = d.photos[s.key];
          if (url) {
            return `
              <div class="pgslot filled">
                <div class="pgslot-preview" style="background-image:url('${url}')">
                  <button class="pgslot-remove" data-remove-photo="${s.key}" aria-label="삭제">×</button>
                </div>
                <div class="pgslot-filled-label">${s.label}${s.req ? '<em>*</em>' : ''}</div>
              </div>`;
          }
          return `
            <label class="pgslot${s.req ? ' req' : ''}" for="photo-${s.key}">
              <div class="pgslot-empty">
                <span class="pgslot-plus">+</span>
                <span class="pgslot-label">${s.label}${s.req ? '<em>*</em>' : ''}</span>
                <span class="pgslot-tap">탭하여 추가</span>
              </div>
              <input type="file" id="photo-${s.key}" accept="image/*"
                class="photo-file-input" data-photo-key="${s.key}" style="display:none">
            </label>`;
        }).join('')}
      </div>
      <div class="field" style="margin-top:16px;">
        <label>상태 설명</label>
        <textarea data-sell-key="desc" rows="4" placeholder="정비 이력, 보관 방식, 포함 품목, 특이사항 등">${d.desc}</textarea>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>미리보기</button>
      </div>
    </div>`;
}

export function sellStep6() {
  const d = state.sellData;
  const priceStr = d.price ? won(Number(d.price)) : '미입력';
  const titleStr = [d.brand, d.model, d.year ? d.year + '년' : ''].filter(Boolean).join(' ') || '선박 정보 미입력';
  const photoUrls = PHOTO_SLOTS.map(s => d.photos[s.key]).filter(Boolean);
  return `
    <div class="sell-card">
      <h2>접수 미리보기</h2>
      ${photoUrls.length
        ? `<div class="preview-photo-strip">
            <div class="preview-photo-main" style="background-image:url('${photoUrls[0]}')"></div>
            ${photoUrls.length > 1 ? `<div class="preview-photo-row">
              ${photoUrls.slice(1).map(u => `<div class="preview-photo-thumb" style="background-image:url('${u}')"></div>`).join('')}
            </div>` : ''}
          </div>`
        : `<div class="preview-photo-empty">📷 등록된 사진이 없습니다<br><small>사진을 등록하면 매물 노출 확률이 높아집니다</small></div>`
      }
      <div class="preview-card">
        <div class="preview-mode-badge ${state.sellMode === 'pro' ? 'orange' : ''}">${state.sellMode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self'}</div>
        <div class="preview-title">${titleStr}</div>
        <div class="preview-price">${priceStr}</div>
        <div class="info-grid" style="margin-top:12px;">
          ${[['선종',d.type],['지역',d.region||'-'],['운항',d.hours?d.hours+'h':'-'],['엔진',d.engine],['등록증',d.regStatus],['보험',d.insStatus]].map(([k,v])=>`<div class="info"><span>${k}</span><strong>${v}</strong></div>`).join('')}
        </div>
      </div>
      <div class="notice" style="margin-top:14px;">
        ${state.sellMode === 'pro' ? '전문 평가사 방문 후 48시간 검증 딜러 입찰로 진행됩니다.' : '사진 기반 72시간 검증 딜러 입찰이 진행됩니다.'}
      </div>
      <label class="consent-row">
        <input type="checkbox" id="consentCheck">
        <span>모두 진단/인증의 범위와 한계 안내를 확인했으며, 등록 정보가 사실임에 동의합니다.</span>
      </label>
      <div class="cta-row" style="margin-top:12px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" id="submitSell" disabled>등록 요청</button>
      </div>
    </div>`;
}

export function garage() {
  const wished = [...state.wished].map(byId).filter(Boolean);
  const recent = state.recent.map(byId).filter(Boolean);
  return `
    <div class="panel">
      <h1 class="detail-title" style="margin-top:0;">내마린고</h1>
      <div class="info-grid">
        <div class="info"><span>보유 장비</span><strong>Sea-Doo Spark</strong></div>
        <div class="info"><span>AI 예상 시세</span><strong>1,420만원</strong></div>
        <div class="info"><span>보험 만료</span><strong>2026-09-30</strong></div>
        <div class="info"><span>검사 알림</span><strong>120일 남음</strong></div>
      </div>
    </div>
    <section class="section">
      <div class="section-head"><h2>판매 진행</h2><small>${state.sellRequests.length}건</small></div>
      ${state.sellRequests.length
        ? `<div class="summary-list">${state.sellRequests.map(r => `
            <div class="sell-request">
              <div class="sr-left">
                <div class="sr-mode">${r.mode}</div>
                <div class="sr-title">${[r.brand, r.model, r.year ? r.year+'년' : ''].filter(Boolean).join(' ') || r.type || '선박명 미입력'}</div>
                <div class="sr-meta">${r.type || ''}${r.price ? ' · ' + won(Number(r.price)) : ''}${r.region ? ' · ' + r.region : ''}</div>
              </div>
              <span class="sr-status">${r.status}</span>
            </div>`).join('')}</div>`
        : '<div class="empty">진행 중인 판매가 없습니다.</div>'}
    </section>
    <section class="section">
      <div class="section-head"><h2>찜한 매물</h2><small>${wished.length}대</small></div>
      <div class="card-list">${wished.length ? wished.map(x => card(x)).join('') : '<div class="empty">찜한 매물이 없습니다.</div>'}</div>
    </section>
    <section class="section" style="padding-bottom:22px;">
      <div class="section-head"><h2>최근 본 매물</h2><small>${recent.length}대</small></div>
      <div class="card-list">${recent.length ? recent.map(x => card(x)).join('') : '<div class="empty">최근 본 매물이 없습니다.</div>'}</div>
    </section>`;
}

export function more() {
  return `
    <div class="panel">
      <h1 class="detail-title" style="margin-top:0;">전체서비스</h1>
      <div class="service-menu">
        <button data-service="전체매물">내마린사기</button>
        <button data-service="모두인증">모두인증</button>
        <button data-service="모두진단">모두진단</button>
        <button data-service="홈배송">홈배송</button>
        <button data-open-ai>AI시세</button>
        <button data-tab="sell">내마린팔기</button>
        <button data-tab="garage">내마린고</button>
        <button data-action="마린론 상담 화면은 준비 중입니다">마린론</button>
        <button data-action="보험/정비 화면은 준비 중입니다">보험/정비</button>
        <button data-action="고객센터 연결 화면은 준비 중입니다">고객센터</button>
      </div>
    </div>
    <section class="section">
      <div class="section-head"><h2>인증 · 진단 기준 안내</h2></div>
      <div class="notice-accordion">
        <details class="notice-details">
          <summary class="notice-summary">모두 인증이란?</summary>
          <div class="notice-body">
            모두 인증은 모두의 마린이 정한 민간 기준을 통과한 매물에 부여되는 표시입니다.<br><br>
            <b>인증 기준</b>: 모두 진단 완료 · 서류/소유권/저당/압류 확인 · 사고/침수/좌초 이력 고지 · 내부 검수자 승인<br><br>
            <b>인증이 보장하지 않는 것</b>: 선박의 무하자, 향후 고장 없음, 법정 운항 가능성, 특정 목적 적합성, 보험 인수 가능성<br><br>
            모두 인증은 법정 선박검사, 선급검사, 제조사 보증을 대체하지 않습니다. 구매 전 직접 확인 및 시운전을 권장합니다.
          </div>
        </details>
        <details class="notice-details">
          <summary class="notice-summary">모두 진단이란?</summary>
          <div class="notice-body">
            선박/해양장비 점검 경험을 갖춘 진단자가 표준 체크리스트에 따라 현장에서 확인한 상태 리포트입니다.<br><br>
            <b>점검 범위</b>: 선체·갑판·엔진·추진계·전장·조타·연료계·계류장비·서류·소유권 관련 확인<br><br>
            <b>점검 방식</b>: 비분해 육안 확인, 작동 확인, 사진/영상, 계측값, 판매자 제출 서류 확인, 시운전 여부<br><br>
            <b>점검 한계</b>: 수중부·내부 부품 미분해, 잠재 하자, 점검 이후 상태 변화, 판매자 허위자료 가능성은 확인 불가합니다.<br><br>
            본 리포트는 법정 선박검사, 선급검사, 제조사 보증, 보험 인수 심사를 대체하지 않습니다.
          </div>
        </details>
        <details class="notice-details">
          <summary class="notice-summary">점검 한계 및 유의사항</summary>
          <div class="notice-body">
            모두의 마린은 진단/인증 과정에서 확인한 정보와 확인하지 못한 항목을 구분하여 공개합니다.<br><br>
            판매자가 제공한 자료가 허위이거나 점검 당시 확인할 수 없었던 숨은 하자가 있는 경우, 책임 범위는 관련 법령·개별 계약·판매자 귀책 여부 및 모두의 마린의 고의 또는 과실 여부에 따라 달라질 수 있습니다.<br><br>
            최종 구매 계약 전 직접 확인, 시운전, 별도 정비소 점검 또는 전문가 검토를 진행하시기 바랍니다.
          </div>
        </details>
        <details class="notice-details">
          <summary class="notice-summary">분쟁 및 문의</summary>
          <div class="notice-body">
            진단/인증 결과에 대한 정정 요청, 재진단 요청, 분쟁은 고객센터를 통해 접수할 수 있습니다.<br><br>
            <button class="wide-btn" style="margin-top:8px;" data-action="고객센터 연결 화면은 준비 중입니다">고객센터 문의</button>
          </div>
        </details>
      </div>
    </section>
    <section class="section" style="padding-bottom:22px;">
      <button class="dealer-entry" data-tab="dealer">
        <div class="dealer-entry-left">
          <div class="dealer-entry-icon">⚓</div>
          <div>
            <div class="dealer-entry-title">딜러·마리나 센터</div>
            <div class="dealer-entry-sub">매물 관리, 문의 확인, 정산 현황</div>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </section>`;
}

export function dealer() {
  const unread = DEALER.inquiries.filter(q => !q.read).length;
  const statusColor = { '게시중': '#1469FF', '문의중': '#FF5F1F', '상담예약': '#00A8C6', '거래완료': '#8896A7' };
  const statusBg   = { '게시중': '#EEF5FF', '문의중': '#FFF4EE', '상담예약': '#E6F7FA', '거래완료': '#F4F7FB' };

  const myListingsHtml = DEALER.myListings.map(dl => {
    const item = byId(dl.id);
    if (!item) return '';
    const sc = statusColor[dl.status] || '#8896A7';
    const sb = statusBg[dl.status]   || '#F4F7FB';
    return `
      <div class="dlisting">
        <div class="dlisting-thumb" style="background-image:url('${item.image}')"></div>
        <div class="dlisting-body">
          <div class="dlisting-status" style="color:${sc};background:${sb};">${dl.status}</div>
          <div class="dlisting-title">${item.title}</div>
          <div class="dlisting-price">${won(item.price)}</div>
          <div class="dlisting-meta">조회 ${dl.views} · 문의 ${dl.inquiries}건</div>
        </div>
        <div class="dlisting-actions">
          <button class="mini-btn" data-detail="${item.id}">상세</button>
          <button class="mini-btn" data-action="매물 수정 화면은 준비 중입니다">수정</button>
        </div>
      </div>`;
  }).join('');

  const inquiriesHtml = DEALER.inquiries.map(q => `
    <div class="dinquiry ${q.read ? '' : 'dinquiry-unread'}">
      <div class="dinquiry-dot ${q.read ? '' : 'dot-active'}"></div>
      <div class="dinquiry-info">
        <div class="dinquiry-item">${q.item}</div>
        <div class="dinquiry-type">${q.type}</div>
      </div>
      <div class="dinquiry-meta">
        <div class="dinquiry-time">${q.time}</div>
        <button class="mini-btn" style="height:28px;font-size:11px;" data-action="문의 답변 화면은 준비 중입니다">${q.read ? '보기' : '답변'}</button>
      </div>
    </div>`).join('');

  return `
    <div class="dealer-header">
      <div class="dealer-thumb" style="background-image:url('${DEALER.image}')"></div>
      <div class="dealer-info">
        <div class="dealer-name">${DEALER.name}
          ${DEALER.certified ? '<span class="dealer-cert">모두인증</span>' : ''}
        </div>
        <div class="dealer-meta">${DEALER.region} · ${DEALER.since}년 개업</div>
        <div class="dealer-rating">★ ${DEALER.rating} <span>(후기 ${DEALER.reviewCount}건)</span></div>
      </div>
    </div>

    <section class="section">
      <div class="section-head"><h2>이번달 현황</h2></div>
      <div class="dstat-grid">
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.listed}</div>
          <div class="dstat-label">등록 매물</div>
        </div>
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.monthlyInquiries}</div>
          <div class="dstat-label">이달 문의</div>
        </div>
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.completedDeals}</div>
          <div class="dstat-label">누적 거래</div>
        </div>
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.settlementPending}만</div>
          <div class="dstat-label">정산 예정</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>내 매물</h2>
        <button class="mini-btn primary" data-tab="sell" style="height:30px;font-size:12px;">+ 새 매물</button>
      </div>
      <div class="dlisting-list">${myListingsHtml}</div>
    </section>

    <section class="section" style="padding-bottom:22px;">
      <div class="section-head">
        <h2>최근 문의</h2>
        ${unread > 0 ? `<span class="unread-badge">${unread}건 미확인</span>` : '<small>모두 확인</small>'}
      </div>
      <div class="dinquiry-list">${inquiriesHtml}</div>
    </section>`;
}
