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

- 이미지 갤러리 (다중 이미지 지원, 썸네일 클릭으로 메인 전환)
- 가격/AI시세 비교
- 기본 제원
- 판매자 정보
- 등록/검사/보험 정보
- 선체/엔진/전장/추진계 진단 리포트
- 사고/침수/좌초 이력
- 포함 품목
- 예상 추가 비용: 운송비, 계류비, 보험료 mock
- 하단 sticky CTA: 문의하기(2칸) / ⇄ 비교담기 / 방문예약 (2열 그리드)

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

Status: Deferred. 단일 파일 유지 결정.

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

## 티켓 외 추가 구현 (Done)

### 사진 가이드 슬롯 (sellStep5 → Step 6)
- 판매 등록 Step 6에 `PHOTO_SLOTS` 10개 슬롯: 정면\*/우측면\*/좌측면\*/후면\*/갑판/조종석/계기판/엔진룸/기타1·2
- 슬롯 탭 → 파일 탐색기 → `URL.createObjectURL()` 미리보기
- 사진 blob URL은 새로고침 시 소실 (알려진 한계, IndexedDB 저장은 미구현)

### 다중 이미지 갤러리 (detail)
- `getPhotos(item)` 헬퍼: photos 객체 있으면 URL 배열, 없으면 단일 image
- 2장 이상일 때만 썸네일 스트립 표시
- 썸네일 클릭 → 메인 이미지 전환 (재렌더 없이 DOM 직접 업데이트)

### 비교함 상세 뷰 (compare)
- `state.tab === 'compare'` 신규 화면
- 상단바 ⇄ 버튼 → `setTab('compare')`
- 좌측 고정 레이블 + 우측 가로 스크롤 (최대 4대)
- 가격/등급/연식/운항시간 유리한 값 녹색 ✓ 표시
- 개별 제거, 전체 초기화, 빈 상태 안내, 매물 추가 슬롯
- 최대 4대 초과 시 토스트 안내

### 이미지 카테고리 매칭
- 30개 매물 image 필드를 선종별 Unsplash 사진으로 교체

## TICKET-MM-008: 모두 인증/모두 진단 고지 및 약관성 문구

Status: Backlog.

Goal: `모두 인증`과 `모두 진단`의 의미, 기준, 한계, 책임 범위를 앱 안에 명확히 고지한다. 사용자가 인증/진단을 법정 선박검사, 완전한 품질보증, 하자 없음 보증으로 오해하지 않게 하고, 향후 분쟁 시 모두의 마린이 어떤 내용을 사전에 고지했는지 기록으로 남길 수 있게 한다.

Important legal note:

- 이 티켓의 문구는 제품/약관 초안이며 최종 법률 자문을 대체하지 않는다.
- “고지했으니 무조건 면책된다”는 식으로 작성하지 않는다.
- 약관의 규제에 관한 법률상 고객에게 부당하게 불리하거나 사업자의 고의/중과실 책임까지 배제하는 조항은 무효가 될 수 있으므로, 면책 문구는 “검증 범위와 한계의 명확화” 중심으로 작성한다.
- 전자상거래/통신판매중개 성격이 있는 경우 판매자 신원정보, 거래 당사자, 분쟁 해결 절차, 정보 제공 범위 고지가 필요할 수 있다.
- 구현 후 변호사 또는 관련 법무 검토 필요.

References to consider:

- 전자상거래 등에서의 소비자보호에 관한 법률: 통신판매중개자의 고지 및 정보제공 의무, 분쟁해결 관련 의무
- 약관의 규제에 관한 법률: 부당한 면책조항, 고객에게 불리한 약관 제한
- 선박안전법 및 KOMSA/KR 검사 체계: 법정 선박검사와 민간 진단/인증의 구분

Files likely to change:

- `app.js`
- `styles.css`
- 필요하면 `terms.html` 또는 `docs/TERMS_DRAFT.md`

Required product surfaces:

1. 매물 상세의 `모두 인증` 배지 설명
2. 매물 상세의 `모두 진단` 리포트 하단 고지
3. 더보기/설정 탭의 `인증/진단 기준 안내`
4. 판매 등록 플로우의 진단/인증 신청 동의 문구
5. 문의/예약 CTA 직전 또는 리포트 열람 시 확인 체크
6. 향후 실제 백엔드가 붙을 때 저장할 동의 로그 구조 mock

Core distinction:

- `모두 진단`: 선박/해양장비 점검 경험이 있는 진단자가 표준 체크리스트에 따라 현장에서 확인한 상태 리포트. 확인된 사실, 사진/영상, 계측값, 점검 한계를 함께 제공한다.
- `모두 인증`: 모두 진단 결과, 서류/소유권/이력 확인, 필수 항목 통과 여부, 내부 검수 절차를 기준으로 모두의 마린이 거래 참고용으로 부여하는 민간 인증 표시.
- 두 서비스 모두 법정 선박검사, 선급검사, 제조사 보증, 보험사의 담보 판단, 하자 없음 보증을 대체하지 않는다.

Draft copy: short badge tooltip

```text
모두 인증은 법정 선박검사를 대체하지 않는 민간 검증 표시입니다. 모두의 마린 기준에 따라 선체, 엔진, 전장, 서류, 이력 등 주요 항목을 확인하고 기준을 통과한 매물에 부여됩니다.
```

Draft copy: diagnostic report disclaimer

```text
모두 진단은 점검일 현재 확인 가능한 범위에서 선박의 상태를 기록한 거래 참고용 리포트입니다. 진단은 비분해 육안 점검, 작동 확인, 사진/영상 자료, 판매자 제출 서류 및 현장 확인 자료를 바탕으로 작성되며, 수중부·내부 부품·잠재 하자·점검 이후 발생한 상태 변화까지 보증하지 않습니다.

본 리포트는 법정 선박검사, 선급검사, 제조사 보증, 보험 인수 심사 또는 정비 견적을 대체하지 않습니다. 구매자는 계약 전 직접 확인, 시운전, 별도 정비소 점검 또는 전문가 검토를 진행할 수 있습니다.
```

Draft copy: certification disclaimer

```text
모두 인증은 모두의 마린이 정한 민간 기준을 통과한 매물에 부여되는 표시입니다. 인증 여부는 거래 판단을 돕기 위한 정보이며, 선박의 무하자, 향후 고장 없음, 가치 상승, 법정 운항 가능성 또는 특정 목적 적합성을 보증하는 의미가 아닙니다.

모두의 마린은 진단/인증 과정에서 확인한 정보와 확인하지 못한 항목을 구분하여 공개합니다. 판매자가 제공한 자료가 허위이거나 점검 당시 확인할 수 없었던 숨은 하자가 있는 경우, 책임 범위는 관련 법령, 개별 계약, 판매자 귀책 여부 및 모두의 마린의 고의 또는 과실 여부에 따라 달라질 수 있습니다.
```

Draft copy: qualified diagnostician criteria

```text
모두 진단자는 선박 운항, 정비, 검사, 해양장비 관리 또는 관련 분야의 실무 경험을 바탕으로 모두의 마린 내부 기준을 통과한 사람으로 제한됩니다. 모두의 마린은 진단자의 경력/자격 증빙, 실무 평가, 표준 체크리스트 교육, 리포트 품질 검수, 클레임 이력 관리를 통해 진단 권한을 부여하거나 제한합니다.
```

Required diagnostic criteria section:

- 점검자 정보: 이름 또는 식별번호, 소속, 주요 경력, 보유 자격/교육 이수 여부, 점검일
- 점검 범위: 선체, 갑판, 엔진, 추진계, 전장, 조타, 연료계, 계류/안전장비, 서류, 소유권/저당/압류 관련 확인 항목
- 점검 방식: 육안 확인, 작동 확인, 사진/영상 촬영, 계측값 입력, 판매자 제출 자료 확인, 시운전 여부
- 점검 한계: 비분해 점검 여부, 수중부 확인 여부, 엔진 내부 미분해, 전기계통 잠재 불량, 점검 이후 상태 변화, 판매자 허위자료 가능성
- 결과 등급: 양호, 주의, 정비필요, 확인불가
- 증거 자료: 항목별 사진/영상, 계측값, 서류 이미지, 진단자 코멘트
- 이의제기: 구매자/판매자의 정정 요청, 재진단 요청, 분쟁 접수 경로

Required certification criteria section:

- 모두 진단 리포트 완료
- 필수 사진/영상 자료 충족
- 등록/소유권/저당/압류/검사증서 등 핵심 서류 확인 상태 표시
- 사고/침수/좌초/대수리 이력 확인 및 판매자 고지 여부 표시
- 내부 검수자 승인
- 기준 미달 항목이 있는 경우 인증 제외 또는 조건부 표시
- 인증 일자와 유효기간 표시
- 인증 후 상태 변경 가능성 고지

Required consent/logging mock:

- `diagnosisNoticeAcceptedAt`
- `diagnosisNoticeVersion`
- `certificationNoticeAcceptedAt`
- `certificationNoticeVersion`
- `reportViewedAt`
- `listingId`
- `userRole`: buyer/seller

Acceptance criteria:

- 사용자가 `모두 인증`과 `모두 진단`의 차이를 앱 안에서 바로 이해할 수 있다.
- 배지/리포트/더보기 화면에 법정 검사 대체가 아니라는 문구가 명확히 노출된다.
- 진단자 자격 기준과 검증 방식이 “전문가가 봤다” 수준을 넘어 구체적으로 설명된다.
- 점검 범위와 점검 한계가 함께 표시된다.
- 사용자가 리포트 확인 또는 진단/인증 신청 시 고지 문구를 확인했다는 mock 상태가 남는다.
- 문구는 공격적인 면책보다 투명한 범위 고지 중심이다.

### 배포
- GitHub Pages: `https://h-gnie.github.io/modu-marine/`
- 저장소: `https://github.com/H-Gnie/modu-marine`
- push 후 1~2분 자동 반영

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
