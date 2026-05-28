# Tasks for Claude: 모두의 마린

이 문서는 `/home/hj/modu-marine` 전용입니다.
자동매매 프로젝트 `/home/hj/kis-autotrader`는 건드리지 마세요.

## TICKET-MM-001: UI Polish Pass

Status: Done.

Goal: 현재 MVP를 더 세련된 모바일 중고거래 앱처럼 보이게 개선한다.
사용자가 "너무 못생겼다"고 피드백했으므로 최우선 작업이다.

Files likely to change:

- `styles.css`
- `app.js`
- 필요하면 `index.html`

Requirements:

- 홈 상단 hero를 더 정교하게 구성한다.
- 매물 카드의 사진, 가격, 배지, 제원, CTA 위계를 개선한다.
- 카드 높이와 이미지 비율을 안정화한다.
- 섹션 간 간격을 정돈한다.
- KB차차차처럼 정보 밀도는 높게 유지하되, 시각적으로 답답하지 않게 한다.
- 모바일 360px~430px 폭에서 텍스트가 깨지지 않게 한다.

Acceptance criteria:

- 홈 첫 화면이 실제 앱처럼 보인다.
- 매물 카드가 글자 썸네일이 아니라 이미지 중심으로 보인다.
- 하단 탭, 상단바, 검색바, 섹션 헤더가 일관된 디자인 언어를 가진다.
- `http://127.0.0.1:4173`에서 수동 확인 가능하다.

## TICKET-MM-002: Seller Listing Flow V2

Status: Done.

Goal: 판매자가 실제로 매물을 올릴 수 있는 페이지처럼 보이도록 `내마린팔기` 플로우를 고도화한다.

Files likely to change:

- `app.js`
- `styles.css`

Requirements:

- Self/Pro 선택을 더 명확히 보여준다.
- 단계:
  1. 판매 방식 선택
  2. 선종/제조사/모델/연식
  3. 가격/지역/계류지
  4. 엔진/운항시간/선체 길이/마력
  5. 서류/검사/보험 상태
  6. 사진 등록 UI mock
  7. 미리보기/제출
- 제출 후 `내마린고 > 판매 진행`에 표시한다.
- 새로고침 전까지라도 입력값이 반영되게 한다.

Acceptance criteria:

- 판매 등록 과정이 단순 mock 버튼이 아니라 실제 입력 플로우처럼 보인다.
- 판매 요청이 내마린고에 카드로 표시된다.

## TICKET-MM-003: localStorage Persistence

Status: Done.

Goal: 새로고침 후에도 찜, 비교, 최근 본 매물, 판매 등록 mock 데이터가 유지되게 한다.

Files likely to change:

- `app.js`

Requirements:

- `state.wished`
- `state.compared`
- `state.recent`
- `state.sellRequests`

위 상태를 localStorage에 저장/복구한다.

Acceptance criteria:

- 찜한 매물이 새로고침 후에도 유지된다.
- 판매 등록 요청이 새로고침 후에도 유지된다.
- localStorage 데이터가 깨져도 앱이 빈 상태로 안전하게 시작한다.

## TICKET-MM-004: Listing Detail V2

Status: Done.

Goal: 매물 상세를 KB차차차식 상세 정보 구조에 더 가깝게 만든다.

Files likely to change:

- `app.js`
- `styles.css`

Requirements:

- 이미지 갤러리 mock
- 가격/AI시세 비교
- 기본 제원
- 판매자 정보
- 등록/검사/보험 정보
- 선체/엔진/전장/추진계 진단 리포트
- 사고/침수/좌초 이력
- 포함 품목
- 예상 추가 비용: 운송비, 계류비, 보험료 mock
- 하단 sticky CTA: 문의, 방문예약, 홈배송상담

Acceptance criteria:

- 상세 화면만 보고 구매자가 상태와 비용을 판단할 수 있다.
- CTA가 항상 명확하게 보인다.

## TICKET-MM-005: Data Expansion

Status: Done.

Goal: 더미 매물을 10개에서 최소 30개로 확대한다.

Files likely to change:

- `app.js`
- 필요하면 `data/listings.js`로 분리

Requirements:

- 제트스키, 낚시보트, 모터보트, 요트, RIB를 고르게 포함
- 지역 다양화
- 가격대 다양화
- 운항시간 다양화
- 인증/진단/홈배송/영상 배지 다양화
- 매물마다 진단 리포트와 포함 품목 제공

Acceptance criteria:

- 검색/필터 결과가 빈약하지 않다.
- 홈 섹션별 추천 매물이 충분하다.

## TICKET-MM-006: File Structure Cleanup

Status: Ready after UI polish.

Goal: 단일 `app.js`가 너무 커지는 문제를 완화한다.

Suggested structure:

```text
/home/hj/modu-marine/
  index.html
  styles.css
  README.md
  src/
    data.js
    state.js
    render.js
    views/
      home.js
      search.js
      detail.js
      sell.js
      garage.js
      more.js
```

Requirements:

- 빌드 도구 없이 브라우저에서 동작할 수 있게 ES module을 사용하거나, 단일 파일 유지가 더 낫다면 분리하지 않는다.
- 분리할 경우 `python3 -m http.server 4173` 실행 방식은 유지한다.

Acceptance criteria:

- 동작이 깨지지 않는다.
- 기능별 파일 위치가 명확하다.

## TICKET-MM-007: Optional React/Vite Migration

Status: Backlog.

Goal: Node/npm 설치가 가능해지면 React/Vite 프로젝트로 전환한다.

Do not start this unless the user explicitly asks or Node/npm is available.

Requirements:

- 현재 정적 MVP 기능 보존
- 컴포넌트 기반 구조로 이동
- 라우팅, 상태관리, 폼 처리 개선

Acceptance criteria:

- `npm run dev`로 실행 가능
- 기존 화면과 기능이 유지 또는 개선됨

## Design Reference Notes

KB차차차에서 참고할 UX 패턴:

- 홈 첫 화면에 검색과 핵심 서비스 진입을 동시에 제공
- 추천 매물, 인증 매물, 영상 매물, 테마 매물을 분리
- 예산 기반 탐색 제공
- 판매는 Self/Pro 선택지로 명확히 제시
- 내차고처럼 보유 자산 관리와 거래 활동을 통합
- 상세 화면에서 가격, 시세, 이력, 진단, 판매자 신뢰 정보를 강조

모두의 마린으로 바꿀 때:

- 자동차 용어 대신 선박/수상레저 용어 사용
- 운항시간, 엔진, 선체, 계류지, 선박검사, 보험, 운송비를 강조
- 고가 거래이므로 실소유, 서류, 안전거래 문구를 눈에 띄게 배치
