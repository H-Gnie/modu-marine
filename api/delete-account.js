// 회원 탈퇴 — 요청자의 JWT를 검증해 "본인 계정"만 삭제한다.
// auth.users 삭제 시 profiles/listings/wishlists/inquiries는 FK on delete cascade로 함께 정리됨.
async function getAuthedUserId(req) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  const sUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const apiKey = process.env.VITE_SUPABASE_ANON_KEY
  try {
    const r = await fetch(`${sUrl}/auth/v1/user`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${token}` },
    })
    if (!r.ok) return null
    const u = await r.json()
    return u?.id || null
  } catch { return null }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

  const userId = await getAuthedUserId(req)
  if (!userId) return res.status(401).json({ error: '로그인이 필요합니다.' })

  const sUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  try {
    const r = await fetch(`${sUrl}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { apikey: sKey, Authorization: `Bearer ${sKey}` },
    })
    if (!r.ok) {
      const e = await r.text()
      console.error('delete user error:', e)
      return res.status(500).json({ error: '탈퇴 처리 중 오류가 발생했습니다.' })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('delete-account error:', err)
    return res.status(500).json({ error: err.message || '탈퇴 처리 중 오류가 발생했습니다.' })
  }
}
