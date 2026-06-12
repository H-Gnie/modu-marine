const TYPE_LABELS = { general: '일반 문의', visit: '방문/시승 문의', delivery: '운송/인도 문의' }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  const { listingId, listingTitle, buyerName, buyerPhone, inquiryType, message } = req.body || {}
  if (!listingTitle || !buyerName || !message) {
    return res.status(400).json({ error: 'missing fields' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // 키 미설정 시 이메일만 생략 — 문의 접수 플로우는 막지 않는다
    return res.status(200).json({ skipped: true })
  }

  const esc = (s) => String(s).slice(0, 500)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: '모두의 마린 <onboarding@resend.dev>',
        to: [process.env.INQUIRY_NOTIFY_EMAIL || 'hja871004@gmail.com'],
        subject: `[모두의 마린] 새 문의: ${esc(listingTitle)}`,
        html: `
          <h2>새 매물 문의가 접수되었습니다</h2>
          <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
            <tr><td><b>매물</b></td><td>${esc(listingTitle)} (ID: ${esc(listingId ?? '-')})</td></tr>
            <tr><td><b>유형</b></td><td>${TYPE_LABELS[inquiryType] || '일반 문의'}</td></tr>
            <tr><td><b>이름</b></td><td>${esc(buyerName)}</td></tr>
            <tr><td><b>연락처</b></td><td>${esc(buyerPhone || '-')}</td></tr>
          </table>
          <p style="white-space:pre-wrap;border-left:3px solid #1a73e8;padding-left:12px">${esc(message)}</p>
        `,
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      console.error('Resend error:', data)
      return res.status(200).json({ skipped: true })
    }
    return res.status(200).json({ sent: true, id: data.id })
  } catch (err) {
    console.error('send-inquiry error:', err)
    return res.status(200).json({ skipped: true })
  }
}
