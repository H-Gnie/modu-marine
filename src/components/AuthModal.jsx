import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login') // login | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false) // 'signup' | 'reset' | false
  const [agreed, setAgreed] = useState(false)

  function handleKakao() {
    const url = new URL('https://kauth.kakao.com/oauth/authorize')
    url.searchParams.set('client_id', '3393bf946994c6ec91a6ff143f31e473')
    url.searchParams.set('redirect_uri', window.location.origin)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', 'openid profile_nickname profile_image')

    window.location.href = url.toString()
  }

  async function handleEmailAuth(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      if (!agreed) { setError('이용약관 및 개인정보처리방침에 동의해 주세요.'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: nickname } }
      })
      if (error) { setError(error.message); setLoading(false); return }
      setSent('signup')
    } else if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (error) { setError(error.message); setLoading(false); return }
      setSent('reset')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>✕</button>

        <div className="auth-logo">
          <span className="logo-text">모두의<span className="logo-accent">마린</span></span>
        </div>
        <p className="auth-subtitle">로그인하고 매물을 찜하고 팔아보세요</p>

        {sent ? (
          <div className="auth-sent">
            <div className="auth-sent-icon">✉️</div>
            <p><strong>{email}</strong>로 {sent === 'reset' ? '재설정 메일' : '인증 메일'}을 보냈습니다.</p>
            <p className="auth-sent-sub">
              {sent === 'reset'
                ? '메일의 링크를 클릭하면 새 비밀번호를 설정할 수 있습니다.'
                : '메일함을 확인해 링크를 클릭하면 로그인됩니다.'}
            </p>
          </div>
        ) : (
          <>
            <button className="kakao-btn" onClick={handleKakao} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6L5 21l4.4-2.4c.8.2 1.7.2 2.6.2 5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
              </svg>
              카카오로 로그인
            </button>

            <div className="auth-divider"><span>또는 이메일로</span></div>

            <div className="auth-tabs">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>로그인</button>
              <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>회원가입</button>
            </div>

            <form onSubmit={handleEmailAuth} className="auth-form">
              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {mode !== 'reset' && (
                <input
                  type="password"
                  placeholder="비밀번호 (6자 이상)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              )}
              {mode === 'signup' && (
                <label className="auth-agree">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <span><b>이용약관</b> 및 <b>개인정보처리방침</b>에 동의합니다 (필수)</span>
                </label>
              )}
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? '처리 중...'
                  : mode === 'login' ? '로그인'
                  : mode === 'reset' ? '재설정 메일 보내기'
                  : '가입하기'}
              </button>
            </form>

            {mode === 'login' && (
              <button type="button" className="auth-forgot" onClick={() => { setMode('reset'); setError('') }}>
                비밀번호를 잊으셨나요?
              </button>
            )}
            {mode === 'reset' && (
              <button type="button" className="auth-forgot" onClick={() => { setMode('login'); setError('') }}>
                ← 로그인으로 돌아가기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
