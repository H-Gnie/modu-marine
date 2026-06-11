export default async function handler(req, res) {
  const { code } = req.query
  if (!code) return res.status(400).json({ error: 'missing code' })

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.KAKAO_REST_API_KEY,
    redirect_uri: 'https://modu-marine.vercel.app',
    code,
    client_secret: process.env.KAKAO_CLIENT_SECRET,
  })

  try {
    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: params.toString(),
    })
    const data = await response.json()

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error })
    }
    if (!data.id_token) {
      return res.status(400).json({ error: 'id_token_missing' })
    }

    return res.status(200).json({ id_token: data.id_token })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
