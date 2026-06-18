const TYPE_LABELS = { general: '일반 문의', visit: '방문/시승 문의', delivery: '운송/인도 문의' }

const esc = (s) => String(s).slice(0, 500)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// 판매자(seller_id = auth.users.id)의 이메일을 service role로 조회
async function getSellerEmail(sellerId) {
  const sUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!sUrl || !sKey || !sellerId) return null
  try {
    const r = await fetch(`${sUrl}/auth/v1/admin/users/${sellerId}`, {
      headers: { apikey: sKey, Authorization: `Bearer ${sKey}` },
    })
    if (!r.ok) return null
    const u = await r.json()
    return u?.email || null
  } catch { return null }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  const { listingId, listingTitle, buyerName, buyerPhone, inquiryType, message, sellerId } = req.body || {}
  if (!listingTitle || !buyerName || !message) {
    return res.status(400).json({ error: 'missing fields' })
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API
  if (!apiKey) {
    // 키 미설정 시 이메일만 생략 — 문의 접수 플로우는 막지 않는다
    return res.status(200).json({ skipped: true })
  }

  const operator = process.env.INQUIRY_NOTIFY_EMAIL || 'hja871004@gmail.com'
  const sellerEmail = await getSellerEmail(sellerId)

  const subject = `[모두의 마린] 새 문의: ${esc(listingTitle)}`
  const html = `
    <h2>매물에 새 문의가 도착했습니다</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
      <tr><td><b>매물</b></td><td>${esc(listingTitle)} (ID: ${esc(listingId ?? '-')})</td></tr>
      <tr><td><b>유형</b></td><td>${TYPE_LABELS[inquiryType] || '일반 문의'}</td></tr>
      <tr><td><b>문의자</b></td><td>${esc(buyerName)}</td></tr>
      <tr><td><b>연락처</b></td><td>${esc(buyerPhone || '-')}</td></tr>
    </table>
    <p style="white-space:pre-wrap;border-left:3px solid #1a73e8;padding-left:12px">${esc(message)}</p>
    <p style="color:#888;font-size:12px">모두의 마린 · 빠른 회신이 거래 성사율을 높입니다.</p>
  `

  // 한 수신자에게 독립적으로 발송 (한쪽 실패가 다른 쪽을 막지 않도록)
  async function send(to) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: '모두의 마린 <onboarding@resend.dev>', to: [to], subject, html }),
      })
      const data = await r.json()
      if (!r.ok) { console.error(`Resend error (${to}):`, data); return false }
      return true
    } catch (e) { console.error(`send error (${to}):`, e); return false }
  }

  // 1) 판매자에게 (실매물이라 이메일이 있으면)
  let sellerSent = false
  if (sellerEmail) sellerSent = await send(sellerEmail)
  // 2) 운영자 사본 (판매자와 같은 주소면 생략)
  let operatorSent = false
  if (!sellerEmail || sellerEmail !== operator) operatorSent = await send(operator)

  return res.status(200).json({
    ok: sellerSent || operatorSent,
    sellerNotified: sellerSent,
    operatorNotified: operatorSent,
    hadSellerEmail: !!sellerEmail,
  })
}
