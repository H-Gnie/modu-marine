# 모두의 마린 — 론칭 준비 작업 지시서 (PM 리뷰 기준, 2026-07 작성)

이 문서는 어떤 Claude 모델이든 이어서 작업할 수 있도록 작성됐다.
작업 전 반드시 「주의사항」을 먼저 읽을 것. 티켓은 우선순위 순서대로 정렬돼 있다.

---

## 현재 상태 (완료된 것)

- **스택**: React 19 + Vite 8 SPA, Supabase (DB/Auth/Storage), Vercel (호스팅 + 서버리스 `api/`)
- **배포**: main push → Vercel 자동 배포 → https://modu-marine.vercel.app
- **로그인**: 이메일 + 카카오 (커스텀 OIDC — 주의사항 필독). 모바일/데스크탑 로그인 진입 완비
- **매물**: 등록(6단계, 단계별 자동검수, 필수/선택 표시) · 내리기 · 찜(계정 동기화) · 비교함
- **문의/예약**: 문의하기·방문예약 → inquiries 저장 + 판매자 이메일 라우팅(Resend, 도메인 미인증 상태)
- **신뢰**: 개인/딜러 배지(profiles.role), 딜러 셀프 신청 → 국세청 API 자동 승인 (BUSINESS_API_KEY 설정됨)
- **결제**: 토스 코드 완성(api/confirm-payment.js, lib/payments.js) — 키 미설정으로 휴면
- **UX**: 핀치줌 잠금 + 사진 전용 확대 뷰어(모바일 핀치/데스크탑 휠), safe-area, 뒤로가기 origin 복원, 조종면허 가이드 + 면허별 필터
- **더미 매물 30개** (id 900001~900030) + 실매물 병합 표시

## 주의사항 (이걸 모르면 깨뜨린다)

1. **카카오 로그인**: `signInWithOAuth({provider:'kakao'})`로 되돌리기 금지 (KOE205).
   커스텀 플로우: AuthModal 직접 리다이렉트 → `/api/kakao-token` → `signInWithIdToken`.
   client_id는 AuthModal에 하드코딩(공개키), redirect_uri는 api/kakao-token.js에 하드코딩.
2. **App.jsx TDZ**: useCallback 헬퍼 선언보다 위의 useEffect deps에 그 헬퍼 넣으면 흰 화면. 빌드는 통과함.
3. **Vercel 서버리스는 `api/` 루트 직속만** 인식. 서브디렉토리는 404.
4. **환경변수**: `Resend_API`(이름 주의 — RESEND_API_KEY 아님, 코드가 둘 다 읽음), `KAKAO_REST_API_KEY`,
   `KAKAO_CLIENT_SECRET`, `BUSINESS_API_KEY`(국세청, Decoding 키), `GEMINI_API_KEY`(실제론 Groq 키),
   `SUPABASE_SERVICE_ROLE_KEY`(서버 전용). 변수 변경 후 Redeploy(캐시 해제) 필수.
5. **더미 매물**: id 900001+ (DUMMY_ID_OFFSET). 실매물 판별은 `sellerId` 유무로.
6. **Resend 테스트 도메인**: 발신 `onboarding@resend.dev` → 계정 소유자(hja871004@gmail.com)로만 배달됨.
7. push 전 `npm run build` 필수. 커밋 후 자동 배포됨.
8. **설계 원칙: 모든 업무 자동화** — 운영자 수동 개입이 필요한 설계 금지. 셀프서비스 + API 검증 우선.

## 로컬 개발

```bash
cd "d:/1. Work w AI/modu-marine"
npm run dev      # http://localhost:5173 (api/는 Vercel 전용)
npm run build    # push 전 필수
```

---

# 론칭 PM 리뷰 결과 — 작업 티켓 (우선순위 순)

## ❗ P0 — 출시 블로커 (이거 없이 론칭 불가)

### MM-401: 보안 구멍 — verify-business 요청자 인증

Status: TODO. **가장 시급 (악용 가능한 실제 취약점).**

문제: `api/verify-business.js`가 body의 `userId`를 그대로 믿고 service role로 profiles를 수정한다.
공개된 사업자 정보(번호+대표자명+개업일은 준공개 정보)로 **아무나 임의 userId에 딜러 role을 부여**할 수 있다.

방법:
1. 클라이언트(DealerApplyModal)에서 `supabase.auth.getSession()`의 access_token을 `Authorization: Bearer`로 전송.
2. 서버에서 `GET {SUPABASE_URL}/auth/v1/user` (헤더: apikey=anon key, Authorization=받은 토큰)로 토큰 검증
   → 응답의 user.id를 사용. body의 userId는 제거.
3. 같은 패턴을 `api/send-inquiry.js`(스팸 방지 겸)에는 적용하지 말 것 — 비로그인 문의 허용이 스펙임.
   대신 send-inquiry에는 간단한 길이/필드 검증이 이미 있음.

Acceptance: 토큰 없이 POST하면 401. 정상 로그인 사용자는 본인 계정만 딜러 전환됨.

### MM-402: 실매물 중심 전환 — 챗봇·데모 매물 정리

Status: TODO.

문제 2가지:
1. **AI 챗봇이 더미 매물만 추천** — `ChatBot.jsx`가 `data.js`의 listings(더미 30개)만 API에 보낸다.
   실제 등록 매물은 추천 대상에서 빠짐. → App에서 `allListings`를 prop으로 내려 사용하도록 수정.
2. **데모 매물이 실매물처럼 보임** — 더미 30개는 판매자가 없어 문의해도 거래 불가.
   → 카드·상세에 `데모` 배지 표시(id >= 900000 또는 !sellerId 기준), 문의/방문예약 시
   "데모 매물입니다. 실제 거래가 불가합니다" 안내 후 차단. 챗봇 시스템 프롬프트에도 데모 표기 전달.
   (더미를 아예 빼면 매물이 2개뿐이라 앱이 비어 보임 — 론칭 초기엔 데모 배지로 유지가 낫다.)

Acceptance: 실매물 등록 → 챗봇에 조건 말하면 실매물이 추천됨. 데모 매물엔 데모 배지가 보이고 문의가 차단됨.

### MM-403: 계정 기본기 — 비밀번호 재설정 · 회원 탈퇴 · 카카오 닉네임

Status: TODO. (탈퇴는 개인정보보호법상 필수 기능)

1. **비밀번호 재설정**: AuthModal에 "비밀번호를 잊으셨나요?" →
   `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin })` → 메일 링크로 복귀 시
   `?type=recovery` 감지 → 새 비밀번호 입력 모달 → `supabase.auth.updateUser({ password })`.
2. **회원 탈퇴**: 더보기 계정 영역에 "회원 탈퇴" → 확인 모달 → 신규 `api/delete-account.js`
   (요청자 JWT 검증 → service role로 `auth.admin.deleteUser`; profiles/listings는 FK cascade로 정리됨).
3. **카카오 닉네임 폴백**: 카카오 유저는 user_metadata 구조가 달라 닉네임이 비어 보일 수 있음.
   표시 로직을 `nickname ?? name ?? full_name ?? email앞부분 ?? '회원'`으로 통일 (PCTopNav, More, Garage, InquiryModal).

### MM-404: 판매자 루프 완성 — 내 매물 DB 연동 + 받은 문의함 + 매물 수정 + 판매완료

Status: TODO. **가장 큰 P0 티켓.** 판매자가 이메일 없이도 앱 안에서 거래를 완결할 수 있어야 한다.

1. **내 매물 DB 연동**: 내마린고 "판매 진행"이 localStorage(sellRequests) 기반이라 기기 바뀌면 사라짐.
   → 로그인 시 `listings?seller_id=eq.user.id` 조회로 대체(상태 무관 전체). localStorage는 폴백/캐시로만.
2. **받은 문의함**: 내마린고에 "받은 문의" 섹션 — `inquiries` 중 내 매물에 달린 것 조회
   (RLS가 이미 판매자 조회 허용). 문의 유형/이름/연락처/메시지/시간 표시, 읽음 처리(status→replied).
3. **매물 수정**: 판매 진행 항목에 "수정" → Sell 플로우를 수정 모드로 재사용(기존 값 프리필, submit 시 update).
4. **판매완료**: "내리기(삭제)" 외에 "판매완료" 버튼 → status='sold'. sold는 카탈로그에서 제외(현행 active 필터 유지)하되 내 매물 목록엔 표시.

### MM-405: 법적 필수 — 이용약관 · 개인정보처리방침 + 동의

Status: TODO. (개인정보 수집(이메일·전화번호) 서비스는 법적 필수)

1. 신규 `src/views/Terms.jsx` — 이용약관 / 개인정보처리방침 두 문서 (탭 or 앵커).
   중고거래 플랫폼 표준 템플릿 기반으로 작성하되 "통신판매중개자로서 거래 당사자가 아님" 면책 명시.
2. 가입 폼에 "약관 및 개인정보처리방침 동의" 체크(필수) + 링크.
3. 푸터/전체서비스에 약관 링크 추가.
4. **[사용자 액션]** 실제 운영하려면: 사업자등록 → 통신판매업 신고(간이과세라도) → 약관에 사업자 정보 기재.
   결제(토스 실키)까지 가면 필수. 코드와 무관하게 병행 진행할 것.

### MM-406: [사용자 액션] 도메인 구입 + Resend 인증 → 판매자 실메일 발송 ON

Status: TODO. 코드 변경은 발신 주소 한 줄.

1. 도메인 구입 (가비아/Cloudflare 등, 예: modumarine.kr — 연 1~2만원).
2. Resend → Domains → Add Domain → 안내된 SPF/DKIM DNS 레코드를 도메인 업체에 등록 → 인증 완료.
3. `api/send-inquiry.js`의 from을 `알림 <noreply@구입도메인>`으로 변경.
4. (선택) Vercel 커스텀 도메인 연결 + `api/kakao-token.js` redirect_uri, 카카오 콘솔 리다이렉트 URI 갱신.

Acceptance: 판매자(운영자 아닌 계정) 메일로 문의 알림이 실제 배달됨.

## ⚠️ P1 — 출시 주간 (품질·신뢰)

### MM-407: 이미지 클라이언트 압축
휴대폰 원본(수 MB)이 그대로 Storage에 올라감 → 업로드 느리고 카드 로딩 무거움.
업로드 전 canvas 리사이즈(최대 1600px, JPEG q0.8)로 압축. `browser-image-compression` 또는 직접 구현.

### MM-408: 죽은 버튼 정리 (PM 판단: 축소/삭제)
"준비 중입니다" 토스트만 뜨는 진입점은 론칭 신뢰도를 깎는다:
- **숨김**: 딜러·마리나 센터(Dealer.jsx mock — role='dealer'에게만 노출하거나 제거), 매거진, 마린론, 보험/정비
- **최소 구현**: 고객센터 → mailto 링크 또는 문의 폼, AI시세 → 상세의 AI시세 박스로 스크롤 안내
- **영상 보기**: 더미 전용 기능 — 데모 배지와 함께 데모 매물에서만 표시

### MM-409: 운영 가시성 — Sentry + GA4 + OG 메타
- Sentry(무료 플랜) 프론트 에러 수집 — 흰 화면류 사고를 사용자 제보 전에 감지
- GA4 또는 Vercel Analytics — 유입/전환 측정
- `index.html`에 OG 태그(og:title/description/image) — 카톡 공유 시 미리보기

### MM-410: 기술 부채
- 코드 스플리팅 (번들 503KB → React.lazy 뷰 분리 or manualChunks)
- `GEMINI_API_KEY` → `GROQ_API_KEY` 개명 (Vercel에 새 키 추가 후 코드 수정, 옛 키 제거)
- PWA 재활성화 결정: 안정화됐다고 판단되면 vite.config.js의 `selfDestroying: true` 제거
- `src/views.js` (구버전 죽은 코드 700줄) 삭제

## 🚀 P2 — 출시 후 (성장·수익화)

- **MM-411 상위노출 결제**: listings.featured_until + 토스 결제(featured_7d/30d 상품) + 정렬 우선 + '추천' 배지. 토스 실키는 사업자 필요.
- **MM-412 카카오 알림톡**: 채널 개설 + 솔라피 연동. 사업자 인증 필요.
- **MM-413 신고/차단**: 매물·사용자 신고 → reports 테이블 → 임계치 초과 시 자동 숨김(자동화 원칙).
- **MM-414 검수 고급화**: 등록을 서버 API 경유로 강제(클라 우회 차단) + 사진 AI 검수(보트 사진 여부)·중복 이미지 탐지.
- **MM-415 앱스토어**: Capacitor 래핑 → 플레이스토어($25)/앱스토어($99/년). PWA 재활성화가 선행.
- **MM-416 AI시세 실구현**: 등록 매물 축적 후 실거래 데이터 기반 산정으로 교체.

---

## 실행 순서 요약

```
MM-401 보안(반나절) → MM-402 챗봇·데모(반나절) → MM-403 계정(1일)
→ MM-404 판매자 루프(1~2일) → MM-405 약관(1일)
→ [사용자] MM-406 도메인 + 사업자/통신판매업 신고 병행
→ P1 일괄 (2~3일) → 론칭 → P2
```

각 티켓 완료 시: `npm run build` → 커밋 → push → Vercel Ready → 배포 사이트 실동작 확인 → 보고.
