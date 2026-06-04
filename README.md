# 모두의 마린 (Modu Marine)

> 중고 보트 · 제트스키 · 요트 · 낚시보트 · RIB 수상레저 탈것 거래 플랫폼 MVP

---

## ⚡ Windows 빠른 시작 (처음 세팅)

> **이 섹션만 따라가면 5분 안에 로컬에서 실행됩니다.**

### 1단계 — 필수 도구 설치 (처음 한 번만)

| 도구 | 다운로드 | 비고 |
|---|---|---|
| **Git** | https://git-scm.com/download/win | 기본 옵션으로 설치 |
| **Node.js LTS** | https://nodejs.org/en (LTS 버튼) | npm 자동 포함 |
| **VS Code** | https://code.visualstudio.com | 권장 에디터 |

설치 후 **PowerShell** (또는 Git Bash) 에서 확인:
```powershell
git --version    # git version 2.x
node --version   # v20.x 또는 v22.x
npm --version    # 10.x
```

### 2단계 — 저장소 클론

```powershell
git clone https://github.com/H-Gnie/modu-marine.git
cd modu-marine
```

### 3단계 — 패키지 설치

```powershell
npm install
```

### 4단계 — 개발 서버 실행

```powershell
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 → 앱 확인.

> **AI 챗봇**은 Vercel 환경변수(`ANTHROPIC_API_KEY`)가 없으면 동작하지 않습니다.  
> 챗봇 버튼을 무시하면 나머지 모든 기능은 정상 작동합니다.  
> 챗봇까지 로컬에서 테스트하려면 아래 [챗봇 로컬 테스트](#챗봇-로컬-테스트-선택-사항) 참고.

### 5단계 — 수정 후 GitHub에 올리기

```powershell
git add .
git commit -m "수정 내용 설명"
git push origin main
# → Vercel이 자동으로 감지해서 1~2분 내 https://modu-marine.vercel.app 반영
```

### 챗봇 로컬 테스트 (선택 사항)

```powershell
npm install -g vercel          # Vercel CLI 설치 (처음 한 번)
vercel login                   # GitHub 계정으로 로그인
vercel env pull .env.local     # Vercel에 설정된 환경변수 로컬로 가져오기
vercel dev                     # http://localhost:3000 에서 챗봇 포함 전체 동작
```

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [레퍼런스 & 컨셉](#2-레퍼런스--컨셉)
3. [기술 스택](#3-기술-스택)
4. [화면 구성](#4-화면-구성)
5. [주요 기능 상세](#5-주요-기능-상세)
6. [디렉터리 구조](#6-디렉터리-구조)
7. [로컬 개발](#7-로컬-개발)
8. [배포](#8-배포)
9. [개발 진행 이력](#9-개발-진행-이력)
10. [현재 한계 & 다음 단계](#10-현재-한계--다음-단계)

---

## 1. 프로젝트 개요

**모두의 마린**은 수상레저 탈것(보트·제트스키·요트·낚시보트·RIB)을 사고파는 **모바일 우선 거래 플랫폼 MVP**입니다.

국내에 중고 보트를 거래하는 플랫폼이 마땅히 없는 시장 공백을 채우기 위해 시작됐습니다. 중고차 거래 앱인 KB차차차의 정보 구조와 UX 패턴을 수상레저 도메인에 맞게 재해석해서 만들고 있습니다.

### 한 줄 포지셔닝

> "수상레저 탈것의 당근마켓 + KB차차차"

### 타깃 사용자

- 중고 제트스키·보트 구매를 고려 중인 레저 입문자
- 보유 선박을 처분하려는 개인 판매자
- 계류장을 찾거나 관리하는 마리나·딜러

---

## 2. 레퍼런스 & 컨셉

### KB차차차에서 빌려온 정보 구조

KB차차차의 브랜드나 UI를 복제하지 않았지만, 정보 밀도와 서비스 구조는 참고했습니다.

| KB차차차 개념 | 모두의 마린 개념 |
|---|---|
| 내차사기 | 내마린사기 |
| KB스타픽 | 모두스타픽 |
| KB진단 / KB인증 | 모두진단 / 모두인증 |
| 홈배송 | 홈배송 / 마리나 운송 상담 |
| AI시세 | 모두 AI시세 |
| 내차팔기 Self / Pro | 내마린팔기 Self / Pro |
| 내차고 | 내마린고 |
| 전체서비스 | 전체서비스 |

### 도메인 치환 (수상레저 전용 용어)

| 자동차 용어 | 수상레저 용어 |
|---|---|
| 주행거리 | 운항시간 / 엔진시간 |
| 성능점검 | 선체·엔진·전장·추진계 진단 |
| 사고이력 | 사고 / 침수 / 좌초 / 대수리 이력 |
| 소재지 | 계류지 / 마리나 / 항구 |
| 홈배송 | 육상운송 / 마리나이동 / 현장인도 |
| 내차고 | 내마린고 |
| 차종 | 선종 (제트스키·모터보트·낚시보트·요트·RIB) |

### 디자인 방향

- **색상**: 흰색 + 짙은 네이비(`#0B1D2E`) + 블루(`#1469FF`) + 오렌지 포인트(`#FF5F1F`) + 중립 회색
- **톤**: 랜딩페이지 금지. 첫 화면부터 바로 거래 앱 홈이어야 함
- **정보 밀도**: KB차차차처럼 섹션이 많고 신뢰 배지(인증·진단·홈배송)가 잘 보여야 함
- **해양 느낌**: 바다 분위기는 주되, 과한 파도 장식은 피함

---

## 3. 기술 스택

| 항목 | 선택 | 이유 |
|---|---|---|
| UI 프레임워크 | **React 19 + Vite 8** | 컴포넌트 분리 후 유지보수 편의 |
| 스타일 | **단일 CSS 파일** (`styles.css`) | 빌드 없이 바로 수정 가능, 변수 기반 |
| 상태 관리 | React useState / localStorage | 백엔드 없이 브라우저에서 영속성 |
| AI 챗봇 | **Anthropic Claude Haiku** | 빠르고 저렴, 매물 추천에 최적 |
| 챗봇 API | **Vercel Serverless Functions** (`/api/chat.js`) | CORS 없이 클라이언트 키 노출 방지 |
| 배포 | **Vercel** (자동 CD) | GitHub push → 자동 빌드·배포 |
| 보조 배포 | GitHub Pages (Actions) | 백업 URL |
| 패키지 | npm (Node 24) | |

### 주요 의존성

```json
{
  "react": "^19",
  "react-dom": "^19",
  "@anthropic-ai/sdk": "^0.100",
  "vite": "^8",
  "@vitejs/plugin-react": "^6"
}
```

---

## 4. 화면 구성

### 모바일 (375px ~ 430px)

하단 탭 네비게이션 5개:

| 탭 | 설명 |
|---|---|
| 홈 | 히어로 검색, 모두스타픽, 영상, 테마픽, 예산, 신규등록 |
| 검색 | 카테고리·가격·지역·인증·운송·정렬 필터 + 30개 매물 |
| 팔기 (내마린팔기) | Self / Pro 7단계 등록 플로우 |
| 마이마린 (내마린고) | 찜, 비교함, 최근 본 매물, 등록 내역 |
| 더보기 (전체서비스) | 전체 메뉴, 공지, 딜러 대시보드 진입 |

하단 탭에 없는 화면:
- **매물 상세** (검색 결과 클릭)
- **계류장 찾기** (홈 서비스 스트립 or 사이드바)
- **비교함** (최대 4대 비교)
- **딜러·마리나 대시보드** (전체서비스 → 딜러 센터)

### PC (768px 이상)

왼쪽 **고정 사이드바** + 오른쪽 **콘텐츠 영역** (max-width 1280px 중앙 정렬):

| 영역 | 내용 |
|---|---|
| 사이드바 (240px 고정) | 로고, 주요 탭 네비, 찜/비교함 바로가기 |
| PC 상단 내비게이션 (sticky) | 검색바, 선종별 카테고리 탭, 찜·비교·로그인·내마린팔기 유틸 |
| 홈 히어로 | min-height 340px, 요트 배경, 대형 h1, 6개 서비스 아이콘 |
| 홈 2컬럼 그리드 | 좌: 모두스타픽 4열·영상·신규등록 / 우: 테마픽·예산·팔기배너·계류장·매거진 |

---

## 5. 주요 기능 상세

### 5-1. 더미 데이터 (30개 매물)

`src/data.js`에 하드코딩된 30개 매물:
- 제트스키 5개, 모터보트 8개, 낚시보트 6개, 요트 6개, RIB 5개
- 각 매물: 제목, 선종, 제조사/모델, 연식, 가격(만원), 위치, 마리나, 운항시간, 길이, 엔진, 판매자 유형, 배지(모두인증·모두진단·홈배송·트레일러·영상·직거래), AI시세, 진단 리포트, 설명

### 5-2. 검색 & 필터

- 실시간 텍스트 검색 (제목·브랜드·모델·위치)
- 선종 카테고리 (전체 / 제트스키 / 모터보트 / 낚시보트 / 요트 / RIB)
- 최대 가격 슬라이더
- 지역 선택
- 모두인증 / 홈배송 체크박스
- 정렬 (추천순 / 낮은 가격 / 높은 가격 / 최신순 / 낮은 운항시간)
- 필터 프리셋: 서비스 스트립(인증·진단·홈배송 등)

### 5-3. 매물 상세

- 다중 이미지 갤러리 (슬라이드)
- 핵심 제원: 연식·운항시간·길이·엔진
- 신뢰 배지: 모두인증·모두진단·홈배송·트레일러
- 진단 리포트: 선체·엔진·전장·추진계 등급 (A/B+/B)
- AI시세 비교
- 사고/침수/좌초 이력
- 포함 옵션 태그
- 비용 안내: 이전등록비·검사비·계류비·보험
- sticky CTA: 문의하기 / ⇄ 비교담기 / 방문예약

### 5-4. 내마린팔기 (등록 7단계)

**Self 모드** (본인 직접):
1. 선종 선택
2. 제조사·모델·연식 입력
3. 기본 제원 (길이·엔진·운항시간)
4. 사진 업로드 (가이드 슬롯 10개: 외관 전면·후면·측면·엔진·조종석 등)
5. 인증/진단 동의 (모두진단/모두인증 선택 약관)
6. 가격·지역 설정
7. 등록 완료 + localStorage 저장

**Pro 모드**: 전문가 방문 촬영 신청 플로우

### 5-5. 내마린고 (마이페이지)

- **찜 목록**: toggleWish → localStorage `modu_wished`
- **비교함**: 최대 4대, 나란히 비교, 낮은/높은 값 자동 강조, localStorage `modu_compared`
- **최근 본 매물**: viewDetail 시 자동 기록, 최대 8개, `modu_recent`
- **나의 등록 매물**: submitSell 시 `modu_sellRequests`

### 5-6. 계류장 찾기

6개 mock 마리나 데이터 (`src/data.js` → `MARINAS`):

| 마리나 | 지역 | 월 계류비 | 상담 가능 자리 |
|---|---|---|---|
| 전곡항 마리나 | 경기 화성 | 42만원~ | 7 |
| 왕산마리나 | 인천 중구 | 55만원~ | 4 |
| 수영만 요트경기장 | 부산 수영 | 68만원~ | 2 |
| 진해 마리나 | 경남 창원 | 38만원~ | 9 |
| 강정마리나 | 제주 서귀포 | 72만원~ | 3 |
| 아라마리나 | 경기 김포 | 35만원~ | 12 |

필터: 지역 / 필요 시설 / 상담 가능 자리만 보기  
CTA: 상담 요청 (toast) / 전화 문의 (toast)

### 5-7. AI 매물 추천 챗봇

- **모델**: Claude Haiku (빠른 응답, 저비용)
- **엔드포인트**: Vercel `/api/chat.js` (서버리스)
- **동작**: 사용자 자연어 입력 → 시스템 프롬프트가 30개 매물 중 조건에 맞는 `listingIds` 추출 → 프론트에서 카드 렌더링
- **UI**: 하단 슬라이드업 패널 + FAB 버튼, 자동 1.5초 후 오픈 (세션당 1회)
- **안전장치**: 메시지 200자 제한, 외부 URL 금지, 서비스 무관 대화 차단

### 5-8. 딜러·마리나 센터 대시보드 (mock)

전체서비스 → 딜러 센터:
- 딜러 프로필 (왕산마리나 예시)
- 매물 현황 (게시중·문의중·상담예약·거래완료)
- 미정산 금액, 월 문의 수
- 최근 문의 목록

---

## 6. 디렉터리 구조

```
modu-marine/
├── index.html              # SPA 진입점
├── vite.config.js          # Vite 설정 (React plugin)
├── styles.css              # 전체 스타일 (단일 파일, CSS 변수 기반)
├── api/
│   └── chat.js             # Vercel 서버리스 함수 (AI 챗봇 엔드포인트)
├── src/
│   ├── main.jsx            # React 마운트
│   ├── App.jsx             # 라우팅, 전역 상태, 모바일/PC 분기
│   ├── data.js             # 더미 매물 30개 + MARINAS 6개
│   ├── state.js            # sellData 초기값
│   ├── utils.js            # won(), byId(), gradeOf(), getPhotos()
│   ├── hooks/
│   │   └── useIsMobile.js  # window.innerWidth < 768 감지
│   ├── components/
│   │   ├── TopBar.jsx      # 모바일 상단바
│   │   ├── BottomNav.jsx   # 모바일 하단 탭 (5개)
│   │   ├── Sidebar.jsx     # PC 왼쪽 고정 사이드바
│   │   ├── PCTopNav.jsx    # PC 상단 네비 (검색+카테고리+유틸)
│   │   ├── Card.jsx        # 매물 목록 카드
│   │   ├── CompareBar.jsx  # 비교함 하단 바
│   │   ├── Toast.jsx       # 알림 토스트
│   │   └── ChatBot.jsx     # AI 챗봇 패널
│   └── views/
│       ├── Home.jsx        # 홈 화면 (히어로·섹션·2컬럼 그리드)
│       ├── Search.jsx      # 검색·필터 화면
│       ├── Detail.jsx      # 매물 상세
│       ├── Compare.jsx     # 비교함
│       ├── Sell.jsx        # 내마린팔기 7단계
│       ├── Garage.jsx      # 내마린고 (찜·비교·최근·등록)
│       ├── Marinas.jsx     # 계류장 찾기
│       ├── More.jsx        # 전체서비스
│       └── Dealer.jsx      # 딜러 대시보드
├── docs/
│   ├── TASKS_FOR_CLAUDE.md     # 작업 티켓 목록
│   ├── CLAUDE_WORK_LOG.md      # 작업 로그
│   ├── BRIEFING_FOR_CODEX.md   # Codex용 브리핑
│   └── HANDOFF_TO_CODEX.md     # 인수인계 문서
└── dist/                   # Vite 빌드 결과물 (배포용)
```

---

## 7. 로컬 개발

### 사전 조건

- Node.js 20 LTS 이상 (Windows: nodejs.org LTS 설치)
- npm (Node.js에 포함)
- Git (Windows: git-scm.com)

### 명령어 요약

```bash
npm install        # 패키지 설치 (처음 한 번 또는 package.json 변경 시)
npm run dev        # 개발 서버 → http://localhost:5173
npm run build      # dist/ 생성 (배포용 빌드)
npm run preview    # 빌드 결과물 로컬 확인
```

### 자주 쓰는 Git 명령

```bash
git pull origin main          # 최신 코드 받기
git add .                     # 변경 파일 전체 스테이징
git commit -m "작업 내용"     # 커밋
git push origin main          # GitHub에 올리기 → Vercel 자동 배포
git log --oneline             # 커밋 이력 확인
git diff                      # 현재 변경사항 확인
```

### AI 챗봇 로컬 테스트

챗봇은 Vercel 서버리스 함수(`/api/chat.js`)를 사용합니다.  
`npm run dev`만으로는 챗봇 API가 동작하지 않습니다.

```bash
npm install -g vercel         # Vercel CLI 설치
vercel login                  # GitHub 계정으로 로그인
vercel env pull .env.local    # Vercel 환경변수 로컬에 저장
vercel dev                    # http://localhost:3000 에서 챗봇 포함 실행
```

> `.env.local` 파일은 `.gitignore`에 포함되어 있어 GitHub에 올라가지 않습니다.

---

## 8. 배포

### 현재 배포 환경

| 환경 | URL | 방법 |
|---|---|---|
| **Vercel (메인)** | `https://modu-marine.vercel.app` | GitHub push → 자동 빌드·배포 |
| GitHub Pages (서브) | `https://h-gnie.github.io/modu-marine/` | GitHub Actions 자동 트리거 |

### 배포 방법

```bash
git add .
git commit -m "변경 내용"
git push origin main
# → Vercel이 자동으로 감지해서 1~2분 내 빌드·배포 완료
```

### 환경변수 (Vercel 대시보드에서 설정)

| 변수명 | 설명 |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API 키 (챗봇 동작에 필수) |

---

## 9. 개발 진행 이력

### Phase 0 — 정적 HTML 프로토타입

- 단일 `index.html` + `styles.css` + `app.js`로 시작
- Node/npm 없이 `python3 -m http.server`로 실행
- 핵심 화면 구조 빠르게 실험

### Phase 1 — ES Module 분리 & 기능 확장

- `app.js`를 모듈로 분리 (views.js, utils.js 등)
- 비교함 최대 4대 나란히 비교
- 인증/진단 고지 및 동의 화면
- 사진 업로드 가이드 슬롯 (label 방식으로 모바일 파일 피커 정상화)
- 모바일 safe-area, sticky CTA, 비교함 3열 렌더링 버그 수정

### Phase 2 — React/Vite 전환

- `src/` 디렉터리로 컴포넌트 분리
- App.jsx가 전역 상태·라우팅·모바일/PC 분기 담당
- Vite로 빌드 파이프라인 구축
- GitHub Actions → GitHub Pages 자동 배포

### Phase 3 — AI 챗봇 & PC 레이아웃

- **AI 챗봇**: Anthropic Claude Haiku + Vercel 서버리스 `/api/chat.js`
  - 자연어로 매물 조건 입력 → 추천 카드 자동 렌더링
  - 세션당 1.5초 후 자동 슬라이드업, 200자 제한, 프롬프트 가드레일
- **PC 기본 반응형**: 사이드바 240px 고정, desktop-main 구조 잡기
- Vercel 배포로 전환 (챗봇 API 라우트 필요)

### Phase 4 — 계류장 찾기

- `MARINAS` 데이터 6개 추가 (전국 주요 마리나)
- `Marinas.jsx` 뷰: 지역·시설 필터, 빈자리 실시간 표시, 상담/전화 CTA
- PC 사이드바 + 홈 서비스 스트립에 계류장 탭 추가
- 홈 계류장 진입 카드 추가 (팔기 배너 아래)

### Phase 5 — PC 홈페이지 전면 개선 ← 현재

- **PCTopNav** 신규: sticky 상단 바 (검색 + 카테고리 9개 + 찜/비교/로그인/팔기)
- **desktop-right 래퍼**: 사이드바 우측 영역을 flex column으로 분리
- **max-width 1280px**: 1920px 최대화에서도 콘텐츠 중앙 정렬
- **홈 2컬럼 그리드**: 좌(모두스타픽 4열·영상·신규등록) / 우(테마픽·예산·팔기·계류장·매거진)
- **PC 히어로**: min-height 340px, h1 40px, 서비스 아이콘 6개 1열
- 모바일 스트립 → `.mobile-only` 처리 (PC에서 숨김)

---

## 10. 현재 한계 & 다음 단계

### 현재 한계 (Mock/미구현)

| 항목 | 현재 상태 | 비고 |
|---|---|---|
| 데이터베이스 | 없음 (더미 30개) | Supabase 또는 Firebase 검토 |
| 로그인/회원 | 없음 | Next Auth 또는 Supabase Auth |
| 사진 서버 저장 | 없음 (blob URL, 새로고침 시 소실) | S3 또는 Cloudflare R2 |
| 결제 | mock (toast) | 토스페이먼츠 또는 포트원 |
| 문의/예약 알림 | mock (toast) | 카카오 알림톡 또는 이메일 |
| 계류장 데이터 | mock 6개 | 실제 마리나 API 또는 직접 수집 |
| 이미지 | 외부 Unsplash URL 의존 | 자체 CDN으로 이전 필요 |
| 검색 | 프론트 in-memory 필터 | Algolia 또는 PostgreSQL Full-text |

### 다음 단계 후보

1. **실제 DB 연동** — Supabase (PostgreSQL + Storage + Auth 통합)
2. **로그인** — 카카오 소셜 로그인 우선
3. **사진 업로드** — Supabase Storage (5MB 이하 이미지 압축)
4. **문의 알림** — 카카오 알림톡 (판매자에게 구매 문의 알림)
5. **AI시세 실제 로직** — 유사 매물 기반 가격 산정
6. **모바일 앱 검토** — React Native 또는 Capacitor로 네이티브 앱 전환

---

## 개발 역할 분담

| 역할 | 담당 |
|---|---|
| 기획 / 요구사항 / 설계 방향 | 프로덕트 오너 (사용자) + Codex (총괄 보조) |
| 실제 개발 / 코드 수정 / 커밋 / 배포 | Claude (Code) |
| 코드 리뷰 / 작업 지시문 작성 | Codex |

> **참고**: Codex가 직접 코드를 수정·커밋·푸시하는 경우는 사용자가 명시적으로 요청한 경우에만 허용.  
> 기본 원칙은 **Codex가 지시 → Claude가 구현** 구조입니다.

---

*마지막 업데이트: 2026-06-04*
