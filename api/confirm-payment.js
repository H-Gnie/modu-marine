// 상품별 정가 — 클라이언트가 보낸 amount를 이 값과 대조해 변조를 막는다
const PRODUCT_AMOUNTS = { reservation: 10000 }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  const { paymentKey, orderId, amount, userId, listingId } = req.body || {}
  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ error: '결제 정보가 누락되었습니다' })
  }

  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) return res.status(500).json({ error: '결제 서버 설정 오류 (TOSS_SECRET_KEY)' })

  // orderId 접두사로 상품 판별 후 정가 검증
  const productKey = String(orderId).split('_')[0]
  const expected = PRODUCT_AMOUNTS[productKey]
  if (expected != null && Number(amount) !== expected) {
    return res.status(400).json({ error: '결제 금액이 올바르지 않습니다' })
  }

  try {
    // 1. 토스 결제 승인
    const auth = Buffer.from(`${secretKey}:`).toString('base64')
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    })
    const data = await tossRes.json()
    if (!tossRes.ok) {
      return res.status(400).json({ error: data.message || '결제 승인에 실패했습니다' })
    }

    // 2. 결제 기록 저장 (service role로 RLS 우회)
    const sUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (sUrl && sKey) {
      await fetch(`${sUrl}/rest/v1/payments?on_conflict=order_id`, {
        method: 'POST',
        headers: {
          apikey: sKey,
          Authorization: `Bearer ${sKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          order_id: orderId,
          user_id: userId || null,
          listing_id: listingId ? Number(listingId) : null,
          product_name: data.orderName,
          amount: Number(amount),
          status: 'paid',
          payment_key: paymentKey,
          method: data.method || null,
          paid_at: new Date().toISOString(),
        }),
      }).catch(e => console.error('결제 기록 저장 오류:', e))
    }

    return res.status(200).json({ ok: true, orderName: data.orderName, amount: Number(amount), method: data.method })
  } catch (err) {
    console.error('confirm-payment error:', err)
    return res.status(500).json({ error: err.message || '결제 처리 중 오류' })
  }
}
