# 모두의 마린 — Codex 인수인계 문서

**프로젝트 경로**: `/home/hj/modu-marine`  
**절대 금지**: `/home/hj/kis-autotrader` 건드리지 말 것  
**스택**: 순수 정적 웹앱 (HTML/CSS/JS, Node/npm 없음)  
**로컬 실행**: `python3 -m http.server 4173` → `http://127.0.0.1:4173`  
**공개 배포 URL**: `https://h-gnie.github.io/modu-marine/` (GitHub Pages, main 브랜치 자동 배포)

---

## 파일 구조

```
/home/hj/modu-marine/
  index.html          # 앱 shell, 상단바, 하단 탭 (변경 거의 없음)
  styles.css          # ~1700줄, 디자인 토큰 + 전체 스타일
  app.js              # ~1100줄, 데이터·상태·렌더·이벤트 통합
  CLAUDE.md           # 프로젝트 지침 (Claude/Codex 필독)
  README.md
  docs/
    TASKS_FOR_CLAUDE.md     # 원본 티켓 정의
    HANDOFF_TO_CODEX.md     # 이 문서
```

---

## 완료된 작업 전체 목록

### MM-001: UI Polish Pass ✅
- 디자인 토큰: `--navy / --blue / --aqua / --orange / --ink / --sub / --muted / --line / --soft / --surface`
- 홈 hero: "30개 매물 실시간 등록 중" 카운터
- 홈 카테고리 아이콘 스트립 (모두진단·모두인증·홈배송·내마린팔기)
- 매물 카드 전면 개편:
  - 이미지 위 floating 찜 버튼 (♡/♥)
  - 등급 뱃지 (S/A+/A/B+/B, `score` 기반 `gradeOf()`)
  - AI시세 힌트 (`hint-good` 초록 / `hint-high` 빨강 / `hint-fair` 회색)
  - 카드 전체 클릭 → 상세 이동
  - 카드 하단 `⇄ 비교` 버튼 (비교함 추가/제거)
- 검색바: 홈에서 쿼리 입력 후 돋보기 버튼으로만 검색 탭 이동

### MM-002: Seller Listing Flow V2 ✅
7단계 판매 등록 플로우 (`state.sellStep` 0-6):
- Step 0: Self / Pro 선택
- Step 1: 선종 / 제조사 / 모델 / 연식 / HIN
- Step 2: 가격 / 지역 / 계류지
- Step 3: 엔진 / 운항시간 / 선체 길이 / 마력
- Step 4: 등록증 / 검사 / 보험 상태
- Step 5: 사진 등록 (가이드 슬롯 10개 — 아래 별도 기술)
- Step 6: 미리보기 / 등록 요청
- 제출 후 `내마린고 > 판매 진행`에 카드로 표시

### MM-003: localStorage Persistence ✅
- `state.wished` / `state.compared` / `state.recent` / `state.sellRequests` 저장
- `saveState()` / `loadState()` — try/catch 안전 복구
- 타입 검증: Array가 아닌 값이면 빈 상태로 복구
- **blob URL(사진)은 localStorage에 저장 안 됨** — 새로고침 시 사진 소실 (알려진 한계)

### MM-004: Listing Detail V2 ✅
상세 화면 구성:
- 다중 이미지 갤러리 (썸네일 탭으로 메인 이미지 전환, 재렌더 없이 DOM 직접 업데이트)
- 가격 + 모두 AI시세 박스
- 기본 제원 (선종/제조사/모델/연식/운항시간/선체/엔진/계류지)
- 판매자 정보
- 선체/엔진/전장/추진계 진단 리포트
- 사고/침수/좌초/대수리 이력
- 포함 품목 태그
- 예상 추가 비용 (운송비/계류비/보험료)
- 하단 sticky CTA: **문의하기(2칸) / ⇄ 비교담기 / 방문예약** (2열 그리드)

### MM-005: Data Expansion ✅
더미 매물 30개 (IDs 1-30):
- 제트스키 5개: Yamaha VX, Sea-Doo GTX/Spark, Honda AquaTrax, Polaris Pro
- 모터보트 8개: Sea Ray, Yamaha AR195/242X, Candela C-8(전기), SunStreamer, MasterCraft X22, Sea-Doo Challenger/Wake PRO
- 낚시보트 6개: Quicksilver 605, Parker 660/830, 알루미늄 550/워크보트, Yamaha F115
- 요트 6개: Beneteau Oceanis/First 27, Bavaria C38, Jeanneau, Hans Christian, Sunwave(모터요트)
- RIB 5개: Brig Eagle, Nada 470, Ribeye 750, Marine Partner 580, Thrill Seeker 850
- 각 매물: 카테고리별 Unsplash 이미지, 진단 리포트, AI시세, 배지 다양화

### MM-006: File Structure Cleanup ⏭️ 스킵
빌드 도구 없는 환경이므로 단일 파일 유지 결정.

### MM-007: React/Vite Migration 🔜 Backlog
Node/npm 설치 가능해지면 시작.

---

## 티켓 외 추가 구현

### 사진 가이드 슬롯 (sellStep5)
`PHOTO_SLOTS` 배열 (app.js 전역 상수):
- 정면\* / 우측면\* / 좌측면\* / 후면\* / 갑판 / 조종석 / 계기판 / 엔진룸 / 기타1 / 기타2
- `*` = 필수 (파란 배경으로 구분)
- 슬롯 탭 → 파일 탐색기 → `URL.createObjectURL()` 로 즉시 미리보기
- X 버튼으로 개별 삭제, 상단 "N / 10장 등록됨" 카운터
- 미리보기(Step 6)에 대표사진 + 나머지 썸네일 행 표시
- 제출 시 `sellRequests` 에 `photos` 객체와 `image`(대표) 저장

### 다중 이미지 갤러리
- `getPhotos(item)` 헬퍼: `item.photos` 있으면 해당 URL 배열, 없으면 `[item.image]`
- 2장 이상일 때만 썸네일 스트립 표시
- 썸네일 클릭 → 메인 이미지 전환 + `detail-img-count` 업데이트 (전체 재렌더 없음)

### 비교함 상세 뷰 (`state.tab === 'compare'`)
- 상단바 ⇄ 버튼 → `setTab('compare')` 라우팅
- 좌측 고정 레이블 칼럼 + 우측 가로 스크롤 (최대 4대)
- 비교 행: 가격 / AI시세 / 등급 / 연식 / 운항시간 / 선체 길이 / 엔진 / 지역
- 녹색 ✓: 가격 최저, 운항시간 최단, 연식 최신, 등급 최고 자동 강조
- 개별 `×` 제거 버튼, "전체 초기화" 버튼
- `+` 슬롯 → 검색 탭 이동
- 최대 4대 초과 시 토스트 안내
- 빈 비교함이면 안내 + "매물 검색하러 가기" 버튼

### Codex가 수정한 내용 (이전 세션)
- `rows.map(card)` → `rows.map(x => card(x))` 버그 수정 (index가 compact 파라미터로 넘어가던 문제)
- `loadState()` 타입 안전 보강 (배열 여부 체크, Number.isFinite 필터)

### 이미지 업데이트
30개 매물 image 필드를 카테고리별 Unsplash 사진으로 교체  
(일부 ID 만료 시 회색 썸네일 표시, 앱 오류 없음)

---

## 핵심 코드 구조 (app.js)

```
상수/데이터
  listings[]          더미 매물 30개
  DEALER              제휴 마리나 딜러 객체
  PHOTO_SLOTS[]       사진 가이드 슬롯 10개

상태
  state = { tab, listing, filters, wished(Set), compared(Set),
            recent[], sellStep, sellMode, sellData{...photos{}},
            sellRequests[] }

유틸
  won(n)              금액 포맷
  byId(id)            매물 검색
  gradeOf(score)      등급 계산 (S/A+/A/B+/B)
  getPhotos(item)     이미지 배열 반환
  showToast(msg)      토스트 알림
  setTab(tab)         탭 전환 + render()
  viewDetail(id)      상세 진입
  filteredListings()  필터/정렬 적용 후 배열 반환
  saveState()         localStorage 저장
  loadState()         localStorage 복구

렌더 함수
  home()              홈 화면
  search()            검색/필터 화면
  detail()            매물 상세
  compare()           비교함 화면 ← 신규
  sell()              판매 등록 (sellStep0~6 조합)
  garage()            내마린고
  more()              전체서비스
  dealer()            딜러 상세

이벤트
  click 핸들러        탭, 찜, 비교, 상세, 갤러리 썸네일, 사진 슬롯, 사진 삭제,
                      비교 초기화, 판매 단계 이동, 제출 등
  input 핸들러        검색어 (홈/검색 분리), 필터 select
  change 핸들러       필터 select, 파일 입력(사진 업로드)
```

---

## 알려진 한계 (변경 없음)

| 항목 | 상태 |
|------|------|
| 실제 DB | 없음 (더미 데이터) |
| 로그인 | 없음 |
| 사진 서버 업로드 | 없음 (blob URL, 새로고침 시 소실) |
| 결제/문의/예약 | mock (toast로 처리) |
| 이미지 일부 | Unsplash ID 만료 가능 |

---

## 배포 정보

- **플랫폼**: GitHub Pages
- **저장소**: `https://github.com/H-Gnie/modu-marine`
- **공개 URL**: `https://h-gnie.github.io/modu-marine/`
- **배포 브랜치**: `main` (push 후 1~2분 자동 반영)
- **배포 명령**:
  ```bash
  cd /home/hj/modu-marine
  git add -A
  git commit -m "설명"
  git push
  ```

---

## 다음에 할 수 있는 작업 (우선순위 순)

1. **모바일 UI 수동 검수** — 360/390/430px 폭에서 홈·검색·상세·판매등록Step5·비교함 확인
2. **사진 IndexedDB 저장** — 새로고침 후에도 판매 등록 사진 유지
3. **검색 필터 UX 개선** — 필터 드로어, 키워드 태그, 가격 슬라이더
4. **MM-007 React/Vite 전환** — Node/npm 설치 가능 시
