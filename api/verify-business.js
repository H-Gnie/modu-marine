// 국세청 사업자등록 진위확인(공공데이터포털) → 통과 시 자동으로 role='dealer' 부여
// 요청자의 Supabase JWT를 검증해 "본인 계정"만 전환 가능 (body의 userId는 신뢰하지 않음)
async function getAuthedUserId(req) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return null
  const sUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const apiKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
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
  if (!userId) return res.status(401).json({ error: '로그인이 필요합니다. 다시 로그인해 주세요.' })

  const { bizNo, ceoName, openDate, bizName } = req.body || {}
  if (!bizNo || !ceoName || !openDate) {
    return res.status(400).json({ error: '상호·사업자등록번호·대표자명·개업일을 모두 입력해 주세요.' })
  }

  const key = process.env.BUSINESS_API_KEY
  if (!key) return res.status(500).json({ error: '사업자 검증 설정이 아직 준비되지 않았습니다.' })

  const bno = String(bizNo).replace(/[^0-9]/g, '')        // 숫자만
  const startDt = String(openDate).replace(/[^0-9]/g, '') // YYYYMMDD

  try {
    // 1) 국세청 진위확인 (사업자번호 + 대표자명 + 개업일 일치 여부)
    const vr = await fetch(
      `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businesses: [{ b_no: bno, start_dt: startDt, p_nm: ceoName, b_nm: bizName || '' }],
        }),
      }
    )
    const vdata = await vr.json()
    const item = vdata?.data?.[0]
    if (item?.valid !== '01') {
      return res.status(200).json({
        ok: false,
        message: '사업자 정보가 일치하지 않습니다. 등록번호·대표자명·개업일을 다시 확인해 주세요.',
      })
    }

    // 2) 자동 승인: role=dealer + 사업자 정보 저장 (service role, RLS 우회)
    const sUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const sKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const up = await fetch(`${sUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      headers: {
        apikey: sKey,
        Authorization: `Bearer ${sKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        role: 'dealer',
        biz_no: bno,
        biz_name: bizName || null,
        ceo_name: ceoName,
        dealer_verified_at: new Date().toISOString(),
      }),
    })
    if (!up.ok) {
      const e = await up.text()
      console.error('profile update error:', e)
      const dup = e.includes('duplicate') || e.includes('profiles_biz_no_uniq')
      return res.status(200).json({
        ok: false,
        message: dup ? '이미 다른 계정에 등록된 사업자번호입니다.' : '인증은 확인됐지만 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      })
    }

    return res.status(200).json({ ok: true, message: '딜러 인증이 완료되었습니다!' })
  } catch (err) {
    console.error('verify-business error:', err)
    return res.status(500).json({ error: err.message || '검증 중 오류가 발생했습니다.' })
  }
}
