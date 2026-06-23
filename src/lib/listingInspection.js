// 매물 자동 검수: 필수항목 · 가격 sanity · 연락처 노출 · 금칙어
// 단계별 검증(validateSellStep)으로 등록 중 즉시 차단하고,
// 최종 등록(inspectListing)에서 한 번 더 백스톱으로 점검한다.
import { PHOTO_SLOTS } from '../data.js'

// 휴대폰 번호 (010-1234-5678, 01012345678 등)
const PHONE_RE = /01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/
// 외부 메신저/연락 유도 (카톡 ID, 오픈채팅 등)
const MESSENGER_RE = /(카톡|카카오톡|kakao|오픈\s*채팅|오픈\s*톡|텔레그램|telegram|라인\s*아이디|인스타\s*디엠)/i
// 기본 금칙어(욕설/스팸). 운영하며 보강.
const BANNED_WORDS = ['시발', '씨발', '병신', '개새끼', '좆', '존나', '사기꾼', '도배']

const MAX_PRICE_MANWON = 1000000 // 100억(만원 단위) 초과는 입력 오류로 간주

// 설명 텍스트 점검 → 위반 메시지 or null
function checkDescription(desc = '') {
  const t = String(desc)
  if (PHONE_RE.test(t)) return '설명에 전화번호를 넣을 수 없습니다. 문의는 앱 안에서 안전하게 받게 됩니다.'
  if (MESSENGER_RE.test(t)) return '설명에 외부 메신저(카톡 등) 정보는 넣을 수 없습니다.'
  if (BANNED_WORDS.some(w => t.includes(w))) return '설명에 부적절한 표현이 포함되어 있습니다.'
  return null
}

const REQUIRED_PHOTO_KEYS = PHOTO_SLOTS.filter(s => s.req).map(s => s.key)

// 단계별 검증: 해당 단계에서 "다음"을 누를 때 호출. 위반 메시지 or null.
export function validateSellStep(step, d = {}) {
  // 1) 선박 기본 정보
  if (step === 1) {
    if (!String(d.brand || '').trim()) return '제조사를 입력해 주세요.'
    if (!String(d.model || '').trim()) return '모델명을 입력해 주세요.'
    const y = Number(d.year)
    const thisYear = new Date().getFullYear()
    if (!d.year || !y || y < 1950 || y > thisYear + 1) return '연식을 올바르게 입력해 주세요.'
  }
  // 2) 가격 및 위치
  if (step === 2) {
    const p = Number(d.price)
    if (!d.price || !p || p <= 0) return '판매 가격을 올바르게 입력해 주세요. (만원 단위)'
    if (p > MAX_PRICE_MANWON) return '가격이 비정상적으로 큽니다. 만원 단위로 입력했는지 확인해 주세요.'
    if (!d.region) return '지역을 선택해 주세요.'
  }
  // 3) 제원 (선택 입력 — 입력 시 숫자 sanity만)
  if (step === 3) {
    if (d.hours !== '' && d.hours != null && Number(d.hours) < 0) return '운항시간을 올바르게 입력해 주세요.'
    if (d.hp !== '' && d.hp != null && Number(d.hp) < 0) return '마력을 올바르게 입력해 주세요.'
  }
  // 5) 사진 + 설명
  if (step === 5) {
    const photos = d.photos || {}
    const filled = REQUIRED_PHOTO_KEYS.filter(k => photos[k]).length
    if (filled < REQUIRED_PHOTO_KEYS.length) {
      return `필수 사진 ${REQUIRED_PHOTO_KEYS.length}장을 모두 등록해 주세요. (현재 ${filled}장)`
    }
    const descErr = checkDescription(d.desc)
    if (descErr) return descErr
  }
  return null
}

// 최종 등록 백스톱 검사 (submitSell에서 호출)
export function inspectListing(d = {}) {
  const errors = []

  if (!d.type) errors.push('선종을 선택해 주세요.')
  const price = Number(d.price)
  if (!price || price <= 0) errors.push('판매 가격을 올바르게 입력해 주세요. (만원 단위)')
  if (price > MAX_PRICE_MANWON) errors.push('가격이 비정상적으로 큽니다. 만원 단위로 입력했는지 확인해 주세요.')
  if (!d.region) errors.push('지역(계류지)을 입력해 주세요.')
  const photoCount = Object.values(d.photoFiles || {}).filter(Boolean).length
  if (photoCount < 1) errors.push('대표 사진을 최소 1장 등록해 주세요.')

  const descErr = checkDescription(d.desc)
  if (descErr) errors.push(descErr)

  return { ok: errors.length === 0, errors }
}
