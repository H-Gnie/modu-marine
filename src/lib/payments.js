import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk'

// 상품 카탈로그 — 가격은 서버(api/confirm-payment.js)와 반드시 일치시킬 것
export const PRODUCTS = {
  reservation: { name: '방문 예약금', amount: 10000 },
}

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY

// 토스 결제창 호출. 성공/실패 시 ?payment= 파라미터를 달고 앱으로 리다이렉트된다.
export async function startPayment({ productKey, listingId, customerName }) {
  const product = PRODUCTS[productKey]
  if (!product) throw new Error('알 수 없는 결제 상품입니다')
  if (!CLIENT_KEY) throw new Error('결제 설정이 아직 준비되지 않았습니다')

  const orderId = `${productKey}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const tossPayments = await loadTossPayments(CLIENT_KEY)
  const payment = tossPayments.payment({ customerKey: ANONYMOUS })
  await payment.requestPayment({
    method: 'CARD',
    amount: { currency: 'KRW', value: product.amount },
    orderId,
    orderName: product.name,
    successUrl: `${window.location.origin}/?payment=success`,
    failUrl: `${window.location.origin}/?payment=fail`,
    customerName: customerName || '고객',
    metadata: { listingId: String(listingId ?? '') },
  })
}
