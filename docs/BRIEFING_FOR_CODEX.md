# 모두의 마린 — Codex 브리핑

**작성일**: 2026-05-30  
**프로젝트**: `/home/hj/modu-marine`  
**금지**: `/home/hj/kis-autotrader` 절대 건드리지 말 것

---

## 현재 상태 요약

정적 HTML/JS 앱으로 시작해 **React + Vite** 앱으로 완전 전환 완료.  
GitHub Actions로 push 시 자동 빌드 → GitHub Pages 배포.

---

## 실행 방법

```bash
cd /home/hj/modu-marine
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
git push         # → GitHub Actions → 자동 배포
```

**공개 URL**: https://h-gnie.github.io/modu-marine/  
**저장소**: https://github.com/H-Gnie/modu-marine  
**배포 방식**: push → GitHub Actions (`.github/workflows/deploy.yml`) → gh-pages 브랜치 → Pages

---

## 파일 구조

```
/home/hj/modu-marine/
  index.html               Vite 진입점
  vite.config.js           base: '/modu-marine/'
  package.json             scripts: dev / build / preview
  styles.css               ~1900줄, 디자인 토큰 + 전체 스타일 (변경 최소화)
  .gitignore               node_modules/, dist/ 제외
  .github/workflows/
    deploy.yml             push → build → gh-pages 자동 배포
  src/
    main.jsx               createRoot 마운트
    App.jsx                213줄, 전체 상태 useState 훅, 라우팅
    data.js                listings 30개, DEALER, PHOTO_SLOTS
    state.js               state 초기값, freshSellData, saveState, loadState
    utils.js               won(), byId(), gradeOf(), getPhotos(), showToast()
    components/
      TopBar.jsx            상단바 (backBtn, brand, compareBtn 뱃지, wishBtn)
      BottomNav.jsx         하단 5탭
      Card.jsx              매물 카드 (찜, 비교 버튼 포함)
      CompareBar.jsx        플로팅 비교 바 (비교함 N대 / 비교하기 →)
      Toast.jsx             토스트 알림
    views/
      Home.jsx              홈 (hero, 서비스스트립, 스타픽, 영상, 테마, 예산, 신규)
      Search.jsx            검색 + 필터 패널 + 결과 카드 리스트
      Detail.jsx            매물 상세 (갤러리, 진단, 이력, 비용, sticky CTA)
      Compare.jsx           비교함 (좌측 고정 레이블 + 가로 스크롤)
      Sell.jsx              판매 등록 7단계 + 사진 슬롯 10개
      Garage.jsx            내마린고 (판매 진행, 찜, 최근)
      More.jsx              전체서비스 + 인증/진단 안내 아코디언
      Dealer.jsx            딜러·마리나 센터 대시보드
  docs/
    TASKS_FOR_CLAUDE.md    티켓 정의
    HANDOFF_TO_CODEX.md    이전 인수인계 문서
    CLAUDE_WORK_LOG.md     Claude 작업 로그
    BRIEFING_FOR_CODEX.md  이 문서
```

---

## 완료된 전체 티켓

| 티켓 | 내용 | 상태 |
|------|------|------|
| MM-001 | UI Polish (디자인 토큰, 카드 개편, 홈 hero) | ✅ Done |
| MM-002 | 판매 등록 7단계 플로우 | ✅ Done |
| MM-003 | localStorage 저장 (찜/비교/최근/판매요청) | ✅ Done |
| MM-004 | 매물 상세 V2 (갤러리, 진단, sticky CTA) | ✅ Done |
| MM-005 | 더미 매물 30개 확대 | ✅ Done |
| MM-006 | ES module 파일 분리 | ✅ Done |
| MM-007 | React + Vite 전환 + GitHub Actions 배포 | ✅ Done |
| MM-008 | 인증/진단 고지 및 약관 문구 | ✅ Done |

---

## App.jsx 상태 구조

```js
// useState로 관리하는 전체 상태
tab            // 'home' | 'search' | 'detail' | 'compare' | 'sell' | 'garage' | 'more' | 'dealer'
listing        // 선택된 매물 객체 (상세 화면용)
filters        // { category, maxPrice, region, certified, delivery, sort, q, service }
wished         // Set<number> — 찜한 매물 id
compared       // Set<number> — 비교함 매물 id (최대 4)
recent         // number[] — 최근 본 매물 id (최대 8)
sellStep       // 0-6
sellMode       // 'self' | 'pro'
sellData       // { type, brand, model, year, hin, price, region, marina, engine, hours, length, hp, regStatus, inspStatus, insStatus, desc, photos:{} }
sellRequests   // 제출된 판매 요청 배열
toast          // { msg, visible }
```

**localStorage 키**: `modu_wished`, `modu_compared`, `modu_recent`, `modu_sellRequests`

---

## 주요 구현 포인트

### 사진 업로드 (Sell Step 5)
- `<label htmlFor="photo-KEY">` 방식으로 파일 피커 직접 연결
- JS `.click()` 없음 — 모바일에서 탭 한 번에 바로 열림
- `URL.createObjectURL(file)` → `sellData.photos[key]` 저장
- 새로고침 시 blob URL 소실 (알려진 한계, IndexedDB 미구현)

### 비교함
- 상단 ⇄ 버튼에 주황 숫자 뱃지
- 플로팅 바: 비교·상세 화면 제외한 모든 화면에서 노출
- 최대 4대, 초과 시 토스트
- 비교 테이블: 68px 고정 레이블 + 가로 스크롤 (126px/열)
- 유리한 값 녹색 ✓ 자동 표시 (가격 최저, 운항시간 최단, 연식 최신, 등급 최고)

### 인증/진단 고지 (MM-008)
- 매물 상세 → 진단 리포트 하단 고지문 + ⓘ 기준 안내 버튼
- 모두인증 매물 → 인증 범위/한계 섹션
- 더보기 탭 → `<details>/<summary>` 아코디언 4항목
- 판매 등록 Step 7 → 동의 체크박스 (미체크 시 제출 비활성)
- 제출 시 `diagnosisNoticeAcceptedAt`, `consentAcceptedAt` 저장

### 갤러리
- 사진 1장이면 썸네일 없음, 2장 이상이면 스트립 표시
- 썸네일 클릭 → `imgIdx` state로 메인 이미지 전환

---

## 알려진 한계

| 항목 | 상태 |
|------|------|
| 실제 DB | 없음 (더미 데이터) |
| 로그인/회원 | 없음 |
| 사진 서버 업로드 | 없음 (blob URL, 새로고침 시 소실) |
| IndexedDB 사진 저장 | 미구현 |
| 결제/문의/예약 실연동 | 없음 |
| 일부 Unsplash 이미지 | 만료 시 회색 썸네일 (앱 오류 아님) |

---

## 다음 작업 후보

| 항목 | 내용 |
|------|------|
| 사진 IndexedDB 저장 | 새로고침 후에도 판매 등록 사진 유지 |
| 검색 필터 UX 개선 | 드로어, 가격 슬라이더, 키워드 태그 |
| 문의/방문예약 플로우 | mock 버튼 → 실제 입력 폼 |
| React 상태 최적화 | Context API 또는 Zustand 도입 |
| TypeScript 전환 | 타입 안전성 |

---

## Claude 작업 규칙 (항상 지킬 것)

1. `/home/hj/kis-autotrader` 절대 수정 금지
2. 코드 수정 후 반드시 `git push` (GitHub Actions 자동 배포)
3. `styles.css` 변경 최소화 — 기존 CSS 클래스 재사용
4. 기능 추가보다 UI 품질 우선
5. 법적 고지 문구는 "면책" 아닌 "검증 범위 명확화" 방향 유지
