# Claude Handoff: 모두의 마린

이 프로젝트는 `d:\1. Work w AI\modu-marine`에 있는 별도 프로젝트입니다.
자동매매 프로젝트(autotrader)와 절대 섞지 마세요.

**새 세션은 먼저 `docs/NEXT_TASKS.md`를 읽으세요.** 현재 상태, 주의사항(카카오 로그인 구조,
배포 시 함정), 작업 티켓이 모두 거기 있습니다.

## 프로젝트 목표

`모두의 마린`은 중고 보트, 제트스키, 요트, 낚시보트, RIB 등 수상레저 탈것을 사고파는 모바일 우선 거래 앱입니다.
사용자는 KB차차차처럼 정보 밀도가 높고 신뢰 장치가 잘 보이는 중고 거래 앱을 원합니다.

중요: KB차차차의 브랜드, 로고, 문구, 화면 디자인, 그래픽을 그대로 복제하면 안 됩니다.
다만 공개적으로 관찰 가능한 정보 구조와 UX 패턴은 참고합니다.

참고할 구조:

- 내차사기 -> 내마린사기
- KB스타픽 -> 모두마린픽
- KB진단/KB인증 -> 모두진단/모두인증
- 홈배송 -> 홈배송/마리나 운송 상담
- AI시세 -> 모두 AI시세
- 내차팔기 Self/Pro -> 내마린팔기 Self/Pro
- 내차고 -> 내마린고
- 전체서비스 -> 전체서비스

## 현재 구현 상태 (2026-06 기준)

React 19 + Vite 8 SPA. Supabase(DB/Auth/Storage) + Vercel(호스팅/서버리스) 연동 완료.

- 배포: main push → Vercel 자동 배포 → https://modu-marine.vercel.app
- 구조: `src/` (App.jsx, views/, components/, hooks/, lib/supabase.js), `api/` (Vercel 서버리스), `styles.css`
- 로그인: 이메일 + 카카오 (카카오는 커스텀 OIDC — `docs/NEXT_TASKS.md` 주의사항 필독)
- DB: `docs/supabase_schema.sql` 적용됨 (profiles/listings/wishlists/inquiries + RLS)
- 매물 등록: 로그인 → 내마린팔기 → listings 저장 + Storage 이미지 업로드 동작
- AI 챗봇: `api/chat.js`, Groq llama-3.1-8b-instant (환경변수 이름은 `GEMINI_API_KEY`지만 Groq 키)
- 더미 매물 30개 + 실매물 병합 표시

## 실행

```bash
cd "d:/1. Work w AI/modu-marine"
npm run dev      # http://localhost:5173 — 단, api/는 Vercel 전용이라 로컬에서 안 뜸
npm run build    # push 전 필수
```

## 현재 한계

- 문의/예약/결제는 아직 mock (토스트만) — `docs/NEXT_TASKS.md`의 MM-101, MM-104
- 찜/판매등록 localStorage 의존 — 계정 동기화는 MM-102
- 더미 매물 이미지가 외부 Unsplash URL 의존
- 번들 503KB (코드 스플리팅 필요)

## 디자인 방향

- 랜딩페이지처럼 만들지 말고, 첫 화면이 바로 실제 거래 앱 홈이어야 합니다.
- KB차차차처럼 섹션이 많고 정보 밀도는 높게 유지합니다.
- 단, 여백/카드/배지/가격/사진 위계를 정교하게 다듬습니다.
- 매물 카드는 실제 사진, 가격, 핵심 제원, 신뢰 배지가 한눈에 보여야 합니다.
- 하단 탭(모바일)/사이드바(PC)는 실제 앱처럼 고정합니다.
- 수상레저 특성상 해양 느낌은 주되 과한 파도/장식은 피합니다.
- 색은 프리미엄 중고 거래 앱 느낌: 흰색, 짙은 네이비, 선명한 블루, 오렌지 포인트, 중립 회색.

## 도메인 치환표

자동차 앱 개념을 그대로 쓰지 말고 수상레저에 맞게 바꿉니다.

- 차종 -> 선종
- 제조사/모델 -> 제조사/모델
- 연식 -> 연식
- 주행거리 -> 운항시간/엔진시간
- 성능점검 -> 선체/엔진/전장/추진계 진단
- 사고이력 -> 사고/침수/좌초/대수리 이력
- 소재지 -> 계류지/마리나/항구
- 홈배송 -> 육상 운송/마리나 이동/현장 인도
- 내차고 -> 내마린고
- 할부/금융 -> 마린론/리스/보험/계류비 계산

## 절대 하지 말 것

- 카카오 로그인을 `signInWithOAuth({ provider: 'kakao' })`로 되돌리기 금지 (KOE205 재발)
- `App.jsx`에서 useCallback 헬퍼 선언보다 위의 useEffect deps에 그 헬퍼 넣기 금지 (흰 화면 크래시)
- `api/` 아래 서브디렉토리에 서버리스 함수 만들기 금지 (Vercel 404)
- `SUPABASE_SERVICE_ROLE_KEY`를 프론트 코드(`src/`)에서 사용 금지
- KB차차차 로고, 브랜드 컬러, 고유 문구 그대로 사용 금지
- 앱을 마케팅 랜딩페이지처럼 변경 금지
- 다른 프로젝트(autotrader) 파일 수정 금지

## 우선순위

`docs/NEXT_TASKS.md`의 티켓 순서를 따르세요:

1. MM-101 문의하기 실제 동작 + Resend 이메일 알림
2. MM-102 찜 목록 계정 동기화
3. MM-103 챗봇 입력창 가시성 검증
4. MM-104 토스페이먼츠 결제
5. MM-105 기술 부채 (코드 스플리팅, 환경변수 정리)

과거 완료 티켓 기록은 `docs/TASKS_FOR_CLAUDE.md` 참조.
