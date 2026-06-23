// 매물 자동 검수 (간단 버전): 필수항목 · 가격 sanity · 연락처 노출 · 금칙어
// 등록 시점에 자동 점검해 부적합 매물을 차단한다.

// 휴대폰 번호 (010-1234-5678, 01012345678 등)
const PHONE_RE = /01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/
// 외부 메신저/연락 유도 (카톡 ID, 오픈채팅 등)
const MESSENGER_RE = /(카톡|카카오톡|kakao|오픈\s*채팅|오픈\s*톡|텔레그램|telegram|라인\s*아이디|인스타\s*디엠)/i
// 기본 금칙어(욕설/스팸). 운영하며 보강.
const BANNED_WORDS = ['시발', '씨발', '병신', '개새끼', '좆', '존나', '사기꾼', '도배']

const MAX_PRICE_MANWON = 1000000 // 100억(만원 단위) 초과는 입력 오류로 간주

export function inspectListing(d = {}) {
  const errors = []

  // 1) 필수 항목
  if (!d.type) errors.push('선종을 선택해 주세요.')
  const price = Number(d.price)
  if (!price || price <= 0) errors.push('판매 가격을 올바르게 입력해 주세요. (만원 단위)')
  if (!d.region) errors.push('지역(계류지)을 입력해 주세요.')
  const photoCount = Object.values(d.photoFiles || {}).filter(Boolean).length
  if (photoCount < 1) errors.push('대표 사진을 최소 1장 등록해 주세요.')

  // 2) 가격 sanity
  if (price > MAX_PRICE_MANWON) {
    errors.push('가격이 비정상적으로 큽니다. 만원 단위로 입력했는지 확인해 주세요.')
  }

  // 3) 연락처/외부 메신저 노출 (앱 밖 거래·사기 방지)
  const desc = String(d.desc || '')
  if (PHONE_RE.test(desc)) {
    errors.push('설명에 전화번호를 넣을 수 없습니다. 문의는 앱 안에서 안전하게 받게 됩니다.')
  }
  if (MESSENGER_RE.test(desc)) {
    errors.push('설명에 외부 메신저(카톡 등) 정보는 넣을 수 없습니다.')
  }

  // 4) 금칙어
  if (BANNED_WORDS.some(w => desc.includes(w))) {
    errors.push('설명에 부적절한 표현이 포함되어 있습니다.')
  }

  return { ok: errors.length === 0, errors }
}
