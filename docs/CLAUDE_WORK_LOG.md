# Claude 작업 로그 — 모두의 마린

Codex 인수용 작업 기록입니다.
Claude가 받은 지시, 처리 방식, 결과, 발생한 문제와 해결 과정을 정리합니다.

---

## 세션 1 — UI 개선 + 기능 확장

### 받은 지시
"tasks 기준으로 일해" (MM-001 ~ MM-005 순서대로)

---

### MM-001: UI Polish Pass

**처리 내용**
- 디자인 토큰 도입: `--navy / --blue / --aqua / --orange / --ink / --sub / --muted / --line / --soft / --surface`
- 홈 hero 개편: "30개 매물 실시간 등록 중" 카운터, 카테고리 아이콘 스트립
- 매물 카드 전면 교체:
  - 이미지 위 floating 찜 버튼 (♡/♥)
  - 등급 뱃지 (S/A+/A/B+/B) — `gradeOf(score)` 함수
  - AI시세 힌트 색상 분기 (`hint-good` / `hint-high` / `hint-fair`)
  - 카드 전체 클릭 → 상세 이동
- 검색바: 홈에서 입력 후 돋보기 버튼으로만 검색 탭 이동

**발생한 문제 & 해결**
- 문제: 홈 검색창에서 한 글자만 입력해도 검색 탭으로 넘어가서 입력 불가
- 원인 1: input 이벤트마다 `setTab('search')` 호출 → 전체 DOM 재렌더 → 포커스 소실
- 시도 1: setTab 후 `#q`에 focus 복원 → 실패 (input 자체가 사라짐)
- 시도 2: Enter 키만 검색 탭 이동 → 실패 (한국어 IME가 조합 완료 시 Enter 발생)
- 시도 3: 돋보기 버튼 추가, 버튼 클릭으로만 탭 이동 → 사용자 "아직도 같은 문제"
- 근본 원인: 검색 탭의 `#q` input에서도 input 이벤트마다 `render()` 전체 호출
- **최종 해결**: `renderResults()` 함수 분리 (검색 결과 영역만 업데이트) + 350ms debounce (`qTimer`)
- 사용자 확인: "굿. 해결됐어"

---

### MM-002: Seller Listing Flow V2

**처리 내용**
- 판매 등록 7단계 플로우 구현 (`state.sellStep` 0-6)
- `sellStep0()` ~ `sellStep6()` 함수 분리
- `data-sell-key` 속성으로 form 데이터 수집 (DOM querySelectorAll)
- 제출 시 `state.sellRequests`에 push → 내마린고에 카드 표시

---

### MM-003: localStorage Persistence

**처리 내용**
- `saveState()` / `loadState()` 구현
- `wished(Set)`, `compared(Set)`, `recent[]`, `sellRequests[]` 저장/복구
- try/catch로 깨진 JSON 안전 복구

**Codex가 이후 보강한 내용**
- 배열 타입 검증 추가: `Array.isArray()` + `Number.isFinite` 필터
- 잘못된 타입이면 빈 상태로 초기화

---

### MM-004: Listing Detail V2

**처리 내용**
- 상세 화면 8개 섹션 구현
- `getPhotos(item)` 헬퍼: photos 객체 → URL 배열 / 없으면 단일 image
- 다중 이미지 갤러리: 썸네일 클릭 → 메인 이미지 전환 (재렌더 없이 DOM 직접)
- sticky CTA: `grid-template-columns: 1fr 1fr` + 문의하기(2칸) / ⇄ 비교담기 / 방문예약

---

### MM-005: Data Expansion

**처리 내용**
- 더미 매물 10개 → 30개
- 선종 분포: 제트스키 5 / 모터보트 8 / 낚시보트 6 / 요트 6 / RIB 5
- 각 매물: inspection 객체, market AI시세, badges, score, desc 포함
- 이미지: 선종별 Unsplash 사진으로 교체 (카테고리 매칭)

---

### MM-006: File Structure Cleanup

**결정**: 스킵  
Node/npm 없는 정적 앱 환경이므로 단일 파일 유지. ES module 분리 시 CORS 문제 발생 가능성 있음.

---

## 세션 2 — 사진 업로드 + 갤러리

### 받은 지시
"여러 장 올리면 여러 장을 다 볼 수 있게 만들어야 해. 가이드를 주면 좋겠지."

**처리 내용**

**sellStep5 — 가이드 슬롯 10개**
- `PHOTO_SLOTS` 전역 상수 정의 (app.js)
- 슬롯: 정면\* / 우측면\* / 좌측면\* / 후면\* / 갑판 / 조종석 / 계기판 / 엔진룸 / 기타1·2
- `\*` = 필수 (파란 배경으로 구분)
- 슬롯 구조: `data-open-photo` 속성 → click 핸들러 → `input[type=file].click()`
- change 이벤트: `URL.createObjectURL(file)` → `state.sellData.photos[key]` 저장 → render()
- X 버튼: `URL.revokeObjectURL()` 후 삭제 → render()
- 상단 "N / 10장 등록됨" 카운터

**sellStep6 — 미리보기에 사진 표시**
- 대표사진 (16:9) + 나머지 썸네일 행
- 사진 없으면 안내 문구

**갤러리 — 다중 이미지 지원**
- `getPhotos(item)` → 2장 이상이면 썸네일 스트립 표시
- 썸네일 `data-src` / `data-idx` 속성
- click 핸들러: DOM 직접 업데이트 (재렌더 없음)

**한계 (알림)**: blob URL은 새로고침 시 소실. IndexedDB 저장은 미구현.

---

## 세션 3 — 비교함 상세 뷰

### 받은 지시
사용자 선택: "새 기능 추가" → "비교함 상세 뷰"

**처리 내용**

**compare() 뷰 신규 구현**
- `state.tab === 'compare'` 라우팅 추가
- 상단바 ⇄ 버튼 → `setTab('compare')` (기존 toast 대신)
- `isPadded` 배열에 `'compare'` 추가

**비교 테이블 레이아웃**
- 좌측 고정 레이블 칼럼 (68px) + 우측 가로 스크롤
- 각 열: 이미지/제목, 8개 비교 행, 배지, 상세보기 버튼
- 유리한 값 자동 강조: 가격(최저), 운항시간(최단), 연식(최신), 등급(최고) → 녹색 ✓

**비교함 관련 기능**
- 카드 하단 `⇄ 비교` 버튼 추가 (`.card-cmp-btn`)
- 상세 sticky CTA에 `⇄ 비교담기` 버튼 추가 (`.sticky-btn.cmp-on`)
- 최대 4대 초과 시 토스트: "비교함은 최대 4대까지 가능합니다"
- 개별 `×` 제거, `data-compare-clear` 전체 초기화
- 빈 비교함 안내 + "매물 검색하러 가기" 버튼
- `+` 슬롯: `data-tab="search"` 연결

---

## 세션 4 — 공개 배포 (GitHub Pages)

### 받은 지시
"다른 사람들도 볼 수 있게 해줘" → "너가 알아서 해줄 수는 없어?"

**처리 과정**

1. 시도 1: `localhost.run` SSH 터널
   - `ssh -R 80:localhost:4173 nokey@localhost.run`
   - URL 발급 성공: `https://392e173d5d7c9f.lhr.life`
   - 결과: 임시 (컴퓨터 켜있는 동안만) → 사용자 "영구 URL 써야지"

2. GitHub Pages 배포
   - 사용자 제공: GitHub username `H-Gnie`, Personal Access Token
   - `urllib.request`로 GitHub API 호출 (curl 미설치 환경)
   - 저장소 생성: `https://github.com/H-Gnie/modu-marine`
   - `git init → commit → push` 실행
   - Pages 활성화 API 호출
   - **최종 URL**: `https://h-gnie.github.io/modu-marine/`

**발생한 문제**
- `curl` 미설치 → `python3 urllib.request`로 대체
- 사용자가 토큰 삭제 후 인수인계 문서 push 실패 → 로컬에만 저장

---

## 세션 5 — 검수 및 문서 싱크

### 받은 지시 (Codex 작성 지시문)
"비교함/문서 싱크 검수 및 수정"

**검수 결과**: 코드 이상 없음 (전 항목 통과)

**문서 수정**
- `TASKS_FOR_CLAUDE.md`: MM-004 CTA 설명, MM-006 상태 Deferred, 티켓 외 구현 섹션 추가
- `README.md`: 공개 URL, 비교함 기능, 배포 방법, 한계 표 추가
- `HANDOFF_TO_CODEX.md`: 신규 작성 (전체 인수인계 문서)
- `CLAUDE_WORK_LOG.md`: 이 문서

---

## 현재 파일 상태

| 파일 | 줄 수 | 주요 내용 |
|------|-------|-----------|
| `index.html` | 55줄 | 앱 shell, 변경 거의 없음 |
| `styles.css` | ~1760줄 | 디자인 토큰, 전체 스타일 |
| `app.js` | ~1120줄 | 데이터·상태·렌더·이벤트 전체 |
| `docs/TASKS_FOR_CLAUDE.md` | 230줄 | 티켓 + 구현 현황 |
| `docs/HANDOFF_TO_CODEX.md` | 200줄 | Codex 인수인계 |
| `docs/CLAUDE_WORK_LOG.md` | 이 문서 | Claude 작업 로그 |

---

## Codex가 주의할 사항

1. **git remote 인증 만료** — 토큰이 삭제됨. push 필요 시 새 토큰 필요.
2. **blob URL 사진** — 새로고침 시 소실. IndexedDB 저장 미구현 상태.
3. **단일 파일 구조** — `app.js` ~1120줄. 분리 논의됐으나 보류.
4. **`/home/hj/kis-autotrader` 절대 건드리지 말 것.**
5. **Node/npm 없음** — React/Vite 전환 불가 (MM-007 Backlog).

---

## 세션 6 — 모바일 UI 검수 및 마감

### 받은 지시
Codex 작성 지시문: 360/390/430px 폭 기준 모바일 UI 검수 및 깨지는 부분 수정

### 검수 방식
Chrome 헤드리스 렌더링 환경 제약으로 실행 불가 → CSS/JS 정적 분석 + 수치 계산으로 검수

---

### 발견한 문제 및 수정 내역

#### Bug 1 — sticky CTA가 하단 콘텐츠를 가림 (CRITICAL)
- **원인**: 기존 1행 CTA(64px) → 2행 CTA(116px)로 변경됐는데 `detail-pad` padding-bottom이 155px 그대로
- **계산**: bottom-nav(62px) + CTA 2행(116px) = 178px 필요, 23px 부족
- **수정**: `padding-bottom: 155px` → `padding-bottom: 185px`
- **파일**: `styles.css` (`.screen.detail-pad`)

#### Bug 2 — 카드 판매자명이 비교 버튼을 밀어냄
- **원인**: `.card-bottom-row` flex 컨텍스트에서 `.one-line`에 `min-width: 0` 없어 flex shrink 미작동
- **수정**: `.card-bottom-row { min-width: 0 }` + `.card-bottom-row .one-line { flex: 1; min-width: 0; margin-top: 0 }`
- **파일**: `styles.css`

#### Bug 3 — 비교함 테이블 행 높이 어긋남
- **원인**: label 열과 item 열이 독립적 블록 컨텍스트 — `min-height`로는 내용 길이 따라 높이가 달라져 행이 어긋남
- **수정**: `min-height: 40px` → `height: 40px` (고정) + `overflow: hidden` + `white-space: nowrap`
- **파일**: `styles.css` (`.cmp-cell`, `.cmp-label-cell`)

#### Bug 4 — 비교함 배지 행 높이 미스매치 (4px)
- **원인**: label col 배지 행은 40px(`cmp-label-cell`), item col 배지 행은 44px(`cmp-badge-cell`)
- **수정**: `cmp-label-cell.badge-row { height: 48px }` 추가, `cmp-badge-cell { height: 48px }` 통일
- JS: `<div class="cmp-label-cell badge-row">배지</div>` 클래스 추가
- **파일**: `styles.css`, `app.js`

#### Issue 5 — 360px 폭에서 텍스트 clipping 가능성
- **대상**: 홈 아이콘 "내마린팔기" (5자, 11px bold → 76px 버튼에서 빠듯), sticky CTA "⇄ 비교담기"
- **수정**: `@media (max-width: 360px)` 블록에 추가
  - `.home-icons button span { font-size: 10px }`
  - `.sticky-btn { font-size: 12px }`
  - `.cmp-label-col { flex: 0 0 56px }` (비교 레이블 열 축소)
  - `.cmp-col { flex: 0 0 136px }` (비교 아이템 열 축소)
  - `.pgslot-hint { font-size: 9px }` (사진 슬롯 힌트 텍스트)
- **파일**: `styles.css`

---

### 검수한 화면 (코드 분석 기준)

| 화면 | 검수 항목 | 결과 |
|------|-----------|------|
| 홈 | hero/검색창/아이콘 4개/카드 레이아웃 | ✅ (360px 폰트 보정 추가) |
| 검색 | IME debounce, 필터 2col→1col@360, 비교버튼 | ✅ |
| 상세 | 갤러리, sticky CTA 2행, padding-bottom | ✅ (185px로 수정) |
| 비교함 | 빈상태, 최대4대, 테이블 행 정렬 | ✅ (height 고정으로 수정) |
| 판매 Step 5 | 10개 슬롯 2열, 4:3 비율, 힌트텍스트 | ✅ |
| 판매 Step 6 | 대표사진+썸네일 행 미리보기 | ✅ |
| 내마린고 | 판매 진행 카드 | ✅ (코드 변경 없음, 기존 유지) |
| 더보기/딜러 | 레이아웃 변경 없음 | ✅ |

---

### 남은 한계
- 브라우저 헤드리스 렌더링 불가로 실제 픽셀 확인 미완 — 코드 분석 기반 검수
- blob URL 사진 → 새로고침 시 소실 (IndexedDB 미구현)
- 일부 Unsplash 이미지 ID 만료 가능 (앱 오류 아님)
- git push 인증 토큰 만료 → 배포 보류

### 배포 여부
로컬만 수정 완료. GitHub Pages 배포는 새 토큰 필요.

---

## 세션 7 — 비교 기능 가시성 개선

### 받은 지시
"비교는 좋은데, 비교함이 눈에 띄지 않아서 찾기 어려워."

### 문제
- 카드 하단 `⇄ 비교` 버튼이 작고 눈에 잘 안 띔
- 상단 ⇄ 아이콘만으로는 비교함에 담겼는지 알기 어려움
- 비교함으로 가는 진입점이 불명확

### 처리 내용

**1. 상단 ⇄ 버튼 숫자 뱃지 (`index.html`, `styles.css`)**
- `compareBtn` 안에 `<span class="cmp-topbadge" id="cmpTopBadge">` 추가
- 비교함에 1대 이상 담기면 주황색 뱃지에 대수 표시
- `render()` 에서 `.visible` 클래스 토글로 업데이트

**2. 플로팅 비교 바 (`index.html`, `app.js`, `styles.css`)**
- `index.html`에 `<div id="cmpBar" class="cmp-bar hidden">` 추가 (앱 shell 레벨)
- 비교함에 1대 이상 + 비교함·상세 화면이 아닐 때만 표시
- 구성: `⇄ 비교함 N대` | `비교하기 →` 버튼
- 네이비 배경, `bottom: 62px` (bottom-nav 바로 위)
- 슬라이드업/다운 transition (`.hidden` 클래스로 `translateY` 제어)
- `비교하기 →` 탭 → `setTab('compare')`

**3. `render()` 업데이트 (`app.js`)**
- 매 렌더마다 뱃지 텍스트·표시 여부 동기화
- 매 렌더마다 플로팅 바 표시 여부·대수 텍스트 동기화

### 수정 파일
- `index.html`: compareBtn 뱃지 span, cmpBar div 추가
- `app.js`: render() 뱃지·바 업데이트 로직, cmpBarBtn 클릭 핸들러
- `styles.css`: `.cmp-topbadge`, `.cmp-bar`, `.cmp-bar-left`, `.cmp-bar-btn` 스타일

### 배포 여부
로컬만 수정 완료. GitHub Pages 배포는 새 토큰 필요.

---

## 세션 8 — Codex 선작업: AI 챗봇 UX 안정화

### 작업 배경
Claude 사용 한도 도달로 Codex가 먼저 안정화 작업을 진행. 이후 Claude가 UX 문구/시각 마감을 다듬을 수 있도록 범위를 작게 유지.

### 처리 내용

**1. 챗봇 자동 오픈 정책 개선 (`src/App.jsx`)**
- 기존: 접속 1.5초 후 PC/모바일 공통으로 무조건 슬라이드업
- 변경: 사용자가 챗봇을 닫으면 `sessionStorage.chat_auto_dismissed = '1'` 저장
- 같은 세션에서는 새로고침 후에도 자동 재오픈하지 않음
- FAB 숨김은 기존처럼 `localStorage.chat_fab_hidden` 사용
- 더보기 탭의 "AI 챗봇 다시 켜기" 동작 시 숨김/세션 상태를 해제하고 즉시 오픈

**2. 추천 질문 버튼 추가 (`src/components/ChatBot.jsx`, `styles.css`)**
- 입력창 바로 위에 항상 보이는 빠른 질문 4개 추가:
  - `500만원 이하 제트스키`
  - `부산 근처 낚시보트`
  - `모두인증 요트 추천`
  - `홈배송 가능한 매물`
- 버튼 클릭 시 즉시 전송
- 모바일 360px 대응 폰트 보정 추가

**3. 입력/API 방어 (`src/components/ChatBot.jsx`, `api/chat.js`)**
- 클라이언트/서버 양쪽에서 200자 초과 입력 제한
- 빈 입력 방어 유지
- `loading` 중 중복 요청 방어 유지
- `/api/chat`에서 `ANTHROPIC_API_KEY` 누락 시 503 + 사용자용 메시지 반환
- Claude API 401/402/429 계열 오류를 사용자 친화 메시지로 변환
- 응답 `listingIds` 숫자 배열 정규화
- 서버 로그에는 오류를 남기되 API 키/내부 원문은 사용자에게 노출하지 않음

### 수정 파일
- `src/App.jsx`
- `src/components/ChatBot.jsx`
- `api/chat.js`
- `styles.css`
- `docs/BRIEFING_FOR_CODEX.md`
- `docs/CLAUDE_WORK_LOG.md`

### 검증
- `source /home/hj/.nvm/nvm.sh && npm run build`: 통과
- Vite dev server + Chrome headless 390px 렌더링: 자동 오픈 챗봇, 추천 질문 버튼 표시 확인
- 사용자 피드백 "질문 버튼 안떠" 이후, 추천 질문 영역을 메시지 조건부 표시에서 입력창 위 고정 표시로 변경. 재빌드 통과.

### 남은 한계 / Claude에게 넘길 부분
- 실제 Vercel 환경에서 `ANTHROPIC_API_KEY`와 크레딧 상태 확인 필요
- 모바일/PC 실제 화면에서 추천 질문 칩 간격, 챗봇 높이, FAB/비교바 겹침 최종 육안 검수 필요
- 필요하면 추천 질문 문구와 챗봇 첫 문장을 더 브랜드 톤에 맞게 다듬기

### 배포 여부
로컬 수정만 완료. `git status` 확인 후 필요 시 Claude 또는 사용자가 `git push`로 Vercel 배포.
