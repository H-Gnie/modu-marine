import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleKakao() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleEmailAuth(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: nickname } }
      })
      if (error) { setError(error.message); setLoading(false); return }
      setSent(true)
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
            <p><strong>{email}</strong>로 인증 메일을 보냈습니다.</p>
            <p className="auth-sent-sub">메일함을 확인해 링크를 클릭하면 로그인됩니다.</p>
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
              <input
                type="password"
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
