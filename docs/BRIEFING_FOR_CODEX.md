# 모두의 마린 — Codex 브리핑 (최신)

**최종 업데이트**: 2026-06-02  
**프로젝트**: `/home/hj/modu-marine`  
**절대 금지**: `/home/hj/kis-autotrader` 건드리지 말 것

---

## 실행 방법

```bash
cd /home/hj/modu-marine
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드
git push         # → Vercel 자동 배포
```

**배포 플랫폼**: Vercel (GitHub push → 자동 빌드/배포)  
**공개 URL**: https://modu-marine.vercel.app  
**저장소**: https://github.com/H-Gnie/modu-marine  
**GitHub Pages**: 더 이상 사용 안 함 (Vercel로 이전 완료)

---

## 롤백 태그

| 태그 | 상태 |
|------|------|
| `v1.0-backup` | React/Vite 전환 + MM-001~008 완료 |
| `v1.1-chatbot` | AI 챗봇 + FAB 추가 완료 |

롤백: `git reset --hard <태그명> && git push --force`

---

## 파일 구조

```
/home/hj/modu-marine/
  index.html                    Vite 진입점
  vite.config.js                base: '/'
  package.json                  dev/build/preview scripts
  styles.css                    ~1950줄 전체 스타일
  .gitignore                    node_modules/, dist/ 제외
  api/
    chat.js                     Vercel 서버리스 함수 (Claude API 호출)
  src/
    main.jsx                    React 진입점
    App.jsx                     전체 상태, PC/모바일 레이아웃 분기
    data.js                     listings 30개, DEALER, PHOTO_SLOTS
    state.js                    freshSellData
    utils.js                    won, byId, gradeOf, getPhotos, showToast
    hooks/
      useIsMobile.js            window.innerWidth < 768 반응형 훅
    components/
      TopBar.jsx                모바일 상단바
      BottomNav.jsx             모바일 하단 5탭
      Sidebar.jsx               PC 좌측 사이드바 (240px)
      Card.jsx                  매물 카드
      CompareBar.jsx            플로팅 비교 바
      Toast.jsx                 토스트 알림
      ChatBot.jsx               AI 챗봇 슬라이드업 UI
    views/
      Home.jsx                  홈
      Search.jsx                검색 + 필터
      Detail.jsx                매물 상세
      Compare.jsx               비교함
      Sell.jsx                  판매 등록 7단계
      Garage.jsx                내마린고
      More.jsx                  전체서비스
      Dealer.jsx                딜러 센터
  docs/
    BRIEFING_FOR_CODEX.md       이 문서
    HANDOFF_TO_CODEX.md         이전 인수인계 문서
    CLAUDE_WORK_LOG.md          Claude 세션별 작업 로그
    TASKS_FOR_CLAUDE.md         티켓 정의
```

---

## 완료된 전체 작업

### 티켓 (MM-001 ~ MM-008) — 모두 완료

| 티켓 | 내용 |
|------|------|
| MM-001 | UI Polish: 디자인 토큰, 카드 개편, 홈 hero |
| MM-002 | 판매 등록 7단계 플로우 |
| MM-003 | localStorage 저장 (찜/비교/최근/판매요청) |
| MM-004 | 매물 상세 V2 (갤러리, 진단, sticky CTA) |
| MM-005 | 더미 매물 30개 |
| MM-006 | ES module 파일 분리 (src/data, state, utils, views) |
| MM-007 | React + Vite 전환 + Vercel 배포 |
| MM-008 | 모두인증/모두진단 고지 및 동의 체크박스 |

### 티켓 외 추가 작업

#### 비교함 기능
- 상단 ⇄ 버튼 숫자 뱃지
- 플로팅 비교 바 (비교함·상세 외 모든 화면)
- 최대 4대, 좌측 고정 레이블 + 가로 스크롤 테이블
- 유리한 값 녹색 ✓ 자동 강조

#### 사진 업로드
- PHOTO_SLOTS 10개 (정면\*/우측면\*/좌측면\*/후면\*/갑판/조종석/계기판/엔진룸/기타1·2)
- `<label for>` 방식으로 모바일 단 1탭에 파일 피커 열림
- blob URL 기반 (새로고침 시 소실 — 알려진 한계)

#### AI 챗봇
- **`api/chat.js`**: Vercel 서버리스 함수, Anthropic Claude Haiku 호출
- **`src/components/ChatBot.jsx`**: 슬라이드업 채팅 UI
- 접속 1.5초 후 자동 슬라이드업 (PC/모바일 공통, 무조건)
- 챗봇 응답 → 검색 탭에 해당 매물 자동 필터링
- **환경변수**: `ANTHROPIC_API_KEY` (Vercel 대시보드에 등록됨)

#### FAB (Floating Action Button)
- 우하단 파란 채팅 버튼 (bottom: 80px, right: 16px)
- 첫 방문 시 펄스 애니메이션
- FAB 우상단 작은 X: 숨기기 (localStorage 저장)
- 더보기 탭: "AI 챗봇 다시 켜기" 항목으로 복원

#### PC 반응형 레이아웃
- **≥ 768px**: 좌측 240px 사이드바 + 3열 카드 그리드
- **< 768px**: 기존 모바일 레이아웃 그대로
- `useIsMobile()` 훅으로 분기
- 모바일 하단탭 safe-area-inset-bottom 수정

#### 배포 이전
- GitHub Pages → Vercel 이전
- Vercel 서버리스로 API 키 서버사이드 보관 (보안)
- Node.js v24 + npm v11 설치 완료

---

## App.jsx 상태 구조

```js
tab            // 'home'|'search'|'detail'|'compare'|'sell'|'garage'|'more'|'dealer'
listing        // 선택된 매물 객체
filters        // { category, maxPrice, region, certified, delivery, sort, q, service, chatIds }
wished         // Set<number>
compared       // Set<number> (최대 4)
recent         // number[] (최대 8)
sellStep       // 0-6
sellMode       // 'self' | 'pro'
sellData       // { type, brand, model, year, hin, price, region, marina, engine,
               //   hours, length, hp, regStatus, inspStatus, insStatus, desc, photos:{} }
sellRequests   // 제출된 판매 요청 배열
toast          // { msg, visible }
chatOpen       // boolean
fabVisible     // boolean (localStorage 'chat_fab_hidden' 키)
```

**localStorage 키**: `modu_wished`, `modu_compared`, `modu_recent`, `modu_sellRequests`, `chat_fab_hidden`

---

## API 구조

### `POST /api/chat`
```json
// Request
{ "message": "사용자 입력", "listings": [...요약된 매물 배열] }

// Response
{ "message": "챗봇 응답 텍스트", "listingIds": [1, 3, 7] }
```
- 모델: `claude-haiku-4-5-20251001`
- 환경변수: `ANTHROPIC_API_KEY` (Vercel에 등록)
- 응답 형식: JSON (message + listingIds)
- chatIds 필터: Search.jsx에서 chatIds가 있으면 해당 ID만 표시

---

## 알려진 한계

| 항목 | 상태 |
|------|------|
| 실제 DB | 없음 (더미 데이터 30개) |
| 로그인/회원 | 없음 |
| 사진 서버 저장 | 없음 (blob URL, 새로고침 시 소실) |
| IndexedDB 사진 저장 | 미구현 |
| 결제/문의/예약 | mock (toast 처리) |
| Claude API 크레딧 | Trial 크레딧 상태 (충전 필요) |
| Unsplash 이미지 | 일부 만료 시 회색 표시 (앱 오류 아님) |

---

## 다음 작업 후보

| 항목 | 내용 |
|------|------|
| PC 레이아웃 고도화 | 2단 상세 보기, 넓은 검색 UI |
| 사진 IndexedDB | 새로고침 후에도 판매 사진 유지 |
| 문의/방문예약 플로우 | mock → 실제 입력 폼 |
| 챗봇 UX 개선 | 대화 히스토리 유지, 추천 질문 버튼 |
| Anthropic API 크레딧 충전 | 실사용 전 필수 |

---

## Claude 작업 규칙

1. `/home/hj/kis-autotrader` 절대 수정 금지
2. 코드 수정 후 반드시 `git push` (Vercel 자동 배포)
3. 큰 변경 전 `git tag` 백업
4. `styles.css` 변경 최소화
5. 법적 고지 문구: "면책" 아닌 "검증 범위 명확화" 방향 유지
6. Anthropic API 키는 절대 코드에 하드코딩 금지 (환경변수만)
