# 모두의 마린 — 다음 작업 핸드오프 (2026-06 기준)

이 문서는 어떤 Claude 모델(Opus/Sonnet/Haiku)이든 이어서 작업할 수 있도록 작성됐다.
작업 전 반드시 「현재 상태」와 「주의사항」을 먼저 읽을 것.

---

## 현재 상태 (완료된 것)

- **스택**: React 19 + Vite 8 (SPA), Supabase (DB/Auth/Storage), Vercel (호스팅 + 서버리스 `api/`)
- **배포**: GitHub `H-Gnie/modu-marine` main 브랜치 push → Vercel 자동 배포 → https://modu-marine.vercel.app
- **로그인**: 이메일/비밀번호 + 카카오 로그인 모두 동작함 (2026-06-11 확인)
  - 카카오는 Supabase 기본 OAuth가 아닌 **커스텀 OIDC 플로우** 사용 (아래 주의사항 참조)
- **DB**: `docs/supabase_schema.sql` 전체가 Supabase에 적용돼 있음
  - profiles / listings / wishlists / inquiries 테이블 + RLS + Storage 버킷(listing-images)
- **매물 등록**: 로그인 후 내마린팔기 → Supabase listings 테이블 + Storage 이미지 업로드까지 동작
- **AI 챗봇**: `api/chat.js` — Groq(llama-3.1-8b-instant) 기반 매물 추천. 동작함
- **더미 매물 30개** + Supabase 실매물 병합 표시 (`src/hooks/useListings.js`)

## 주의사항 (이걸 모르면 깨뜨린다)

1. **카카오 로그인 구조** — 절대 `supabase.auth.signInWithOAuth({ provider: 'kakao' })`로 되돌리지 말 것.
   Supabase GoTrue가 `account_email` scope를 강제 추가하는데, 이 앱은 비즈니스 인증이 없어 KOE205 에러가 난다.
   현재 플로우: `AuthModal.jsx`에서 kauth.kakao.com으로 직접 리다이렉트 (scope: `openid profile_nickname profile_image`)
   → `?code=` 복귀 → `App.jsx` useEffect가 `/api/kakao-token` 호출 → `signInWithIdToken`.
   - client_id는 `AuthModal.jsx`에 하드코딩 (Vercel이 VITE_ 환경변수를 빌드에 주입 안 해서. 공개 키라 무해)
   - `api/kakao-token.js`의 redirect_uri는 `https://modu-marine.vercel.app` 하드코딩 — 도메인 바뀌면 수정 필요

2. **`App.jsx`의 useEffect 의존성 배열에 `showToast` 같은 useCallback 헬퍼를 넣을 때**,
   그 effect가 헬퍼 **선언보다 위에** 있으면 TDZ ReferenceError로 앱 전체가 흰 화면이 된다.
   빌드는 통과하므로 배포 후에야 터진다. 헬퍼를 쓰는 effect는 반드시 헬퍼 선언 아래에 둘 것.

3. **Vercel 서버리스 함수는 `api/` 루트 직속 파일만 인식**한다. `api/auth/foo.js` 같은 서브디렉토리는 404.

4. **배포 후 변화가 없어 보이면**: Vercel Deployments에서 Ready 확인 → 브라우저 Ctrl+Shift+R.
   그래도 흰 화면이면 F12 → Console 탭의 빨간 에러를 받아볼 것.

5. **환경변수** (Vercel에 설정돼 있음, 로컬은 `.env.local`):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — 프론트
   - `SUPABASE_SERVICE_ROLE_KEY` — 서버 전용 (프론트 노출 금지)
   - `GEMINI_API_KEY` — 이름과 달리 **Groq API 키**다 (api/chat.js가 사용)
   - `KAKAO_REST_API_KEY`, `KAKAO_CLIENT_SECRET` — api/kakao-token.js가 사용
   - 환경변수 추가/변경 후엔 Vercel **Redeploy** 필요 (Build Cache 체크 해제)

6. 커밋 메시지는 영어 `fix:`/`feat:` 컨벤션, push하면 자동 배포되므로 push 전 `npm run build`로 빌드 확인.

## 로컬 개발

```bash
cd "d:/1. Work w AI/modu-marine"
npm install        # 최초 1회
npm run dev        # http://localhost:5173 (api/는 로컬에서 안 뜸 — Vercel 전용)
npm run build      # push 전 필수 확인
```

`api/*.js`는 Vercel 함수라 `npm run dev`로는 실행되지 않는다.
로컬에서 API까지 테스트하려면 `npx vercel dev`를 쓰거나, 프론트만 로컬로 확인하고 API는 배포로 검증.

---

# 작업 티켓 (우선순위 순)

## TICKET-MM-101: 문의하기 실제 동작 + 이메일 알림

Status: TODO. **최우선.**

Goal: 매물 상세의 "문의하기" 버튼이 지금은 토스트만 띄운다 (`src/views/Detail.jsx` 177행 근처).
실제로 inquiries 테이블에 저장하고 판매자에게 이메일을 보낸다.

Files: `src/views/Detail.jsx`, 신규 `src/components/InquiryModal.jsx`, 신규 `api/send-inquiry.js`, `styles.css`

방법:

1. **InquiryModal 컴포넌트** 생성 — AuthModal.jsx의 모달 구조(auth-overlay/auth-modal 클래스)를 재사용.
   필드: 이름(로그인 시 자동 채움), 연락처, 문의 유형(일반/방문/운송 = general/visit/delivery), 메시지(필수).
2. Detail.jsx의 문의하기 버튼 → 모달 오픈. 로그인 안 했어도 문의 가능 (inquiries RLS의 insert는 `with check (true)`).
3. 제출 시:
   ```js
   await supabase.from('inquiries').insert({
     listing_id: item.id,        // 주의: 더미 매물(id 1~30)은 DB에 없어 FK 위반.
     buyer_id: user?.id ?? null, // 더미 매물이면 insert 생략하고 이메일만 보내거나,
     buyer_name, buyer_phone, message, inquiry_type
   })
   ```
   **더미 매물 처리**: `item.seller_id`가 없으면(더미) DB insert를 건너뛰고 mock 성공 처리할 것. FK 에러 방지.
4. **이메일 알림** — `api/send-inquiry.js` 생성, Resend 사용:
   - https://resend.com 가입 → API 키 발급 → Vercel 환경변수 `RESEND_API_KEY` 추가 (사용자에게 요청할 것)
   - 도메인 인증 전에는 `onboarding@resend.dev` 발신, 수신은 Resend 가입 이메일만 가능 — MVP는 이걸로 충분
   - fetch로 `https://api.resend.com/emails` POST (`Authorization: Bearer`), SDK 설치 불필요
   - 판매자 이메일은 profiles에 없으므로, MVP는 운영자(사용자 본인 이메일)에게 "새 문의" 알림만 보내는 것으로 시작
5. 제출 성공 → 토스트 "문의가 접수되었습니다. 판매자가 곧 연락드립니다."

Acceptance: 배포 후 실매물에 문의 작성 → Supabase Table Editor의 inquiries에 행 생성 + 이메일 수신.

## TICKET-MM-102: 찜 목록 계정 연동

Status: TODO.

Goal: 찜이 지금 localStorage에만 있어 기기 바뀌면 사라진다. 로그인 사용자는 wishlists 테이블에 동기화.

Files: `src/App.jsx` (toggleWish, 초기 로드), 필요시 신규 `src/hooks/useWishlist.js`

방법:

1. 로그인 감지 시(user 변경 useEffect) `supabase.from('wishlists').select('listing_id')`로 서버 찜을 불러와
   localStorage 찜과 **합집합 병합** 후 setWished. 병합분은 서버에도 upsert.
2. toggleWish 수정: user 있으면 insert/delete 병행 (낙관적 업데이트 — UI 먼저 바꾸고 실패 시 롤백 또는 토스트).
   ```js
   if (adding) supabase.from('wishlists').insert({ user_id: user.id, listing_id: numId })
   else supabase.from('wishlists').delete().match({ user_id: user.id, listing_id: numId })
   ```
3. **더미 매물 주의**: id 1~30은 listings 테이블에 없어 FK 위반 → 더미 id는 localStorage만 사용하고
   DB 동기화는 건너뛸 것. (실매물 id는 bigserial이라 보통 큰 수지만, id로 구분하지 말고
   `allListings.find(x => x.id === numId)?.seller_id` 존재 여부로 실매물 판별 권장)
4. 로그아웃해도 localStorage 찜은 유지 (현행 동작 보존).

Acceptance: A 브라우저에서 실매물 찜 → B 브라우저(같은 계정 로그인)에서 찜 목록에 보임.

## TICKET-MM-103: 챗봇 입력창 가시성 최종 검증

Status: 코드 수정은 끝났으나 **사용자 확인이 안 됨**. 검증만 남음.

확인 방법: 배포 사이트에서 ① 데스크탑 풀스크린 ② 브라우저 창을 600px 높이로 줄였을 때
③ 모바일(개발자도구 디바이스 모드 iPhone SE) — 세 경우 모두 챗봇 열었을 때
추천 질문 칩 + 입력창 + 전송 버튼이 보여야 한다.
구조: `.chatbot-wrap`은 `bottom`+`height` 기반(절대 `top` 추가 금지), `.chatbot-footer`가 `flex-shrink: 0`,
`.chatbot-messages`가 `flex: 1; min-height: 0`. 문제가 보이면 이 세 가지부터 점검.

## TICKET-MM-104: 토스페이먼츠 결제 (모두진단 예약비)

Status: TODO. MM-101, 102 이후 진행.

Goal: "모두진단 예약" 같은 소액 결제 1건을 끝까지 연결해 결제 인프라를 검증한다.

방법:

1. https://developers.tosspayments.com — 테스트 키는 가입 즉시 발급 (test_ck_/test_sk_).
   Vercel 환경변수: `VITE_TOSS_CLIENT_KEY`(공개), `TOSS_SECRET_KEY`(서버 전용).
   주의: VITE_ 주입 문제가 재발하면 클라이언트 키도 하드코딩 가능 (공개 키임).
2. 프론트: `@tosspayments/tosspayments-sdk` 설치 → 결제위젯 또는 `requestPayment`로 결제창 호출.
   successUrl: `${origin}/?payment=success`, failUrl: `${origin}/?payment=fail`
   (SPA라 라우터가 없으므로 쿼리 파라미터로 처리 — App.jsx의 카카오 콜백 useEffect 패턴 참고)
3. 서버: 신규 `api/confirm-payment.js` — successUrl로 받은 paymentKey/orderId/amount를
   `https://api.tosspayments.com/v1/payments/confirm`에 POST해 승인 (시크릿 키는 Basic auth, base64).
   **amount는 반드시 서버에서 주문 원본과 대조** (금액 변조 방지).
4. Supabase에 `payments` 테이블 추가 (orderId, user_id, listing_id, amount, status, paymentKey).
   schema 파일에도 반영할 것 (`docs/supabase_schema.sql`).
5. 테스트 키 결제는 실제 청구 없음. 카드번호 아무거나(4330-1234-5678-9012 등) 통과.

Acceptance: 테스트 결제 → 승인 성공 → payments 테이블 기록 → 성공 화면 토스트.

## TICKET-MM-105: 기술 부채 정리

Status: TODO. 다른 티켓 사이사이에.

1. **번들 503KB → 코드 스플리팅**: `vite.config.js`에 manualChunks로 react/supabase 분리하거나
   views를 `React.lazy` + Suspense로 전환. 목표: 메인 청크 300KB 이하.
2. **환경변수 이름 정리**: `GEMINI_API_KEY` → `GROQ_API_KEY`.
   api/chat.js의 `process.env.GEMINI_API_KEY` 수정 + Vercel 환경변수 추가 + Redeploy까지 한 세트.
   (Vercel에서 옛 키 지우기 전에 새 키 먼저 추가할 것)
3. **`.env.local` git 확인**: `.gitignore`에 있는지 확인. 만약 과거에 커밋된 적 있으면 키 전부 로테이션.
4. **카카오 로그인 시 profiles.nickname**: 카카오 유저는 `raw_user_meta_data` 구조가 이메일 가입과 달라
   nickname이 비어 보일 수 있음. PCTopNav가 `user.user_metadata?.name || user.email`을 쓰는데
   카카오 유저는 둘 다 없을 수 있다 → `user_metadata.nickname ?? user_metadata.full_name ?? '회원'` 폴백 추가.

## TICKET-MM-106: 매물 상세 강화 (여유 있을 때)

- 조회수: Detail 진입 시 listings.view_count 증가 (RLS 때문에 RPC 함수 또는 서버리스 경유 필요)
- 판매자 프로필 보기 (현재 "준비 중" 토스트)
- 방문 예약 (현재 "준비 중" 토스트) — MM-104 결제와 묶어서 설계 가능

---

## 작업 순서 요약

```
MM-101 문의하기 (Resend 키 발급은 사용자에게 요청)
  → MM-102 찜 동기화
  → MM-103 챗봇 검증 (5분)
  → MM-104 토스 결제
  → MM-105/106 틈틈이
```

각 티켓 완료 시: `npm run build` 통과 확인 → 커밋 → push → Vercel Ready 확인 → 배포 사이트에서 실제 동작 확인 → 사용자에게 보고.
