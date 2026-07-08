import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

// 비밀번호 재설정 메일의 링크로 복귀했을 때(recovery 세션) 새 비밀번호를 설정한다.
export default function PasswordResetModal({ onClose, showToast }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return }
    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    showToast('비밀번호가 변경되었습니다')
    onClose()
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h3 className="inquiry-title">새 비밀번호 설정</h3>
        <p className="inquiry-listing">새로 사용할 비밀번호를 입력해 주세요.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="password" placeholder="새 비밀번호 (6자 이상)" value={password}
            onChange={e => setPassword(e.target.value)} minLength={6} required />
          <input type="password" placeholder="새 비밀번호 확인" value={confirm}
            onChange={e => setConfirm(e.target.value)} minLength={6} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  )
}
